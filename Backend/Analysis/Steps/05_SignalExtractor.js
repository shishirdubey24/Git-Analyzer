import fs from "fs/promises";
import path from "path";
import {
  SIGNAL_PATTERNS,
  SIGNAL_CATEGORIES,
  SIGNAL_METADATA,
} from "../Registries/SignalRules.js";

/**
 * Language-aware comment stripper.
 */
export const stripComments = (content, ext) => {
  if (!content) return "";
  let clean = content;

  if ([".py", ".rb", ".sh", ".yml", ".yaml", ".toml"].includes(ext)) {
    clean = clean.replace(/(""[\s\S]*?""|'''[\s\S]*?''')/g, "");
    clean = clean.replace(/#.*$/gm, "");
  } else if ([".html", ".xml", ".vue", ".svelte"].includes(ext)) {
    clean = clean.replace(/<!--[\s\S]*?-->/g, "");
  } else if (ext === ".sql") {
    clean = clean.replace(/\/\*[\s\S]*?\*\//g, "");
    clean = clean.replace(/--.*$/gm, "");
  } else {
    clean = clean.replace(/\/\*[\s\S]*?\*\//g, "");
    clean = clean.replace(/\/\/.*/g, "");
  }

  return clean;
};

/**
 * Checks if code is minified or auto-generated.
 */
export const isMinifiedOrGenerated = (content) => {
  if (!content) return false;
  const lines = content.split("\n");
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    if (lines[i].length > 1000) return true;
    if (/@generated|auto-generated|do not edit/i.test(lines[i])) return true;
  }
  return false;
};

/**
 * Calculates confidence score for a detected signal based on match count & import presence.
 */
export const calculateSignalConfidence = (
  patternName,
  count,
  hasImportHint,
) => {
  const meta = SIGNAL_METADATA[patternName] || {};
  let confidence = meta.weight || 0.75;

  if (hasImportHint) {
    confidence = Math.min(1.0, confidence + 0.2);
  }

  if (count > 2) {
    confidence = Math.min(1.0, confidence + 0.1);
  } else if (count === 1 && !meta.isImport) {
    confidence = Math.max(0.5, confidence - 0.1);
  }

  return parseFloat(confidence.toFixed(2));
};

/**
 * Step 5: Multi-Language SignalExtractor
 * Reads sampled files, strips comments according to language syntax,
 * detects signal frequencies, framework hints from imports, and assigns confidence scores.
 */
export const extractSignals = async (filePaths = []) => {
  const fileSignals = {};
  const signalTotals = {};
  const detectedSignals = {};
  const confidenceSumMap = {};
  const confidenceCountMap = {};
  const fileLevelSummary = {};

  for (const filePath of filePaths) {
    try {
      const rawContent = await fs.readFile(filePath, "utf-8");
      if (isMinifiedOrGenerated(rawContent)) {
        continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      const cleanContent = stripComments(rawContent, ext);
      const fileName = path.basename(filePath);
      const fileSignalDetails = [];
      const fileSignalNames = [];

      // Detect import framework hints first
      const importSignalsFound = new Set();
      for (const [patternName, meta] of Object.entries(SIGNAL_METADATA)) {
        if (meta.isImport) {
          const regex = SIGNAL_PATTERNS[patternName];
          if (regex) {
            regex.lastIndex = 0;
            if (regex.test(cleanContent)) {
              importSignalsFound.add(patternName);
            }
          }
        }
      }

      for (const [patternName, regex] of Object.entries(SIGNAL_PATTERNS)) {
        regex.lastIndex = 0;
        const matches = cleanContent.match(regex);
        if (matches && matches.length > 0) {
          const count = matches.length;
          const category = SIGNAL_CATEGORIES[patternName] || "General";
          const meta = SIGNAL_METADATA[patternName] || {};

          const confidence = calculateSignalConfidence(
            patternName,
            count,
            importSignalsFound.has(patternName) || importSignalsFound.size > 0,
          );

          fileSignalNames.push(patternName);
          fileSignalDetails.push({
            signal: patternName,
            category,
            count,
            confidence,
            isImport: !!meta.isImport,
          });

          signalTotals[patternName] = (signalTotals[patternName] || 0) + count;
          confidenceSumMap[patternName] =
            (confidenceSumMap[patternName] || 0) + confidence;
          confidenceCountMap[patternName] =
            (confidenceCountMap[patternName] || 0) + 1;
        }
      }

      if (fileSignalNames.length > 0) {
        fileSignals[fileName] = fileSignalNames;
        detectedSignals[filePath] = fileSignalDetails;

        const categoryCounts = {};
        fileSignalDetails.forEach((d) => {
          categoryCounts[d.category] =
            (categoryCounts[d.category] || 0) + d.count;
        });

        let primaryCat = "Utility";
        let maxCatHits = 0;
        for (const [cat, cnt] of Object.entries(categoryCounts)) {
          if (cnt > maxCatHits) {
            maxCatHits = cnt;
            primaryCat = cat;
          }
        }

        fileLevelSummary[fileName] = {
          signalsCount: fileSignalNames.length,
          primaryCategory: primaryCat,
          totalHits: fileSignalDetails.reduce((a, b) => a + b.count, 0),
          details: fileSignalDetails,
        };
      }
    } catch (error) {
      console.error(
        `[SignalExtractor] Error reading ${filePath}: ${error.message}`,
      );
    }
  }

  // Calculate average confidence per signal
  const confidenceScores = {};
  for (const [sig, sum] of Object.entries(confidenceSumMap)) {
    const cnt = confidenceCountMap[sig] || 1;
    confidenceScores[sig] = parseFloat((sum / cnt).toFixed(2));
  }

  // Repository-level signal summary
  const totalRepoHits = Object.values(signalTotals).reduce((a, b) => a + b, 0);
  const categoryTotals = {};
  for (const details of Object.values(detectedSignals)) {
    for (const d of details) {
      categoryTotals[d.category] = (categoryTotals[d.category] || 0) + d.count;
    }
  }

  const repoLevelSummary = {
    totalFilesWithSignals: Object.keys(fileSignals).length,
    totalHits: totalRepoHits,
    signalTotals,
    categoryTotals,
    confidenceScores,
  };

  return {
    fileSignals,
    signalTotals,
    detectedSignals,
    confidenceScores,
    fileLevelSummary,
    repoLevelSummary,
  };
};
