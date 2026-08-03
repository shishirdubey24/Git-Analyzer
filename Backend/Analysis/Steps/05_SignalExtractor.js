import fs from "fs/promises";
import path from "path";
import {
  SIGNAL_PATTERNS,
  SIGNAL_CATEGORIES,
  SIGNAL_METADATA,
} from "../Registries/SignalRules.js";
import { FRAMEWORK_ALIASES } from "../Registries/TechStackRules.js";

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
 * Normalizes framework strings using registry data (FRAMEWORK_ALIASES).
 * Completely technology-agnostic algorithm.
 */
export const isFrameworkAligned = (
  signalFramework,
  detectedFrameworks = [],
) => {
  if (
    !signalFramework ||
    !detectedFrameworks ||
    detectedFrameworks.length === 0
  ) {
    return false;
  }

  const sigNorm = signalFramework.toLowerCase();
  const allowedTokens = FRAMEWORK_ALIASES[sigNorm] || [sigNorm];

  return detectedFrameworks.some((df) => {
    const dfLower = df.toLowerCase();
    return allowedTokens.some(
      (token) => dfLower.includes(token) || token.includes(dfLower),
    );
  });
};

/**
 * Calculates confidence score for a detected signal based on base weight, count & framework alignment.
 */
export const calculateSignalConfidence = (
  patternName,
  count,
  hasFrameworkAlignment = false,
) => {
  const meta = SIGNAL_METADATA[patternName] || {};
  let confidence = meta.weight || 0.75;

  if (hasFrameworkAlignment) {
    confidence += 0.15;
  }

  if (count > 2) {
    confidence += 0.1;
  } else if (count === 1 && !hasFrameworkAlignment) {
    confidence -= 0.05;
  }

  return parseFloat(Math.min(1.0, Math.max(0.5, confidence)).toFixed(2));
};

/**
 * Step 5: Multi-Language SignalExtractor
 * Reads sampled files, strips comments according to language syntax,
 * detects implementation signal frequencies, correlates signals with Step 2 framework evidence,
 * and assigns targeted confidence scores using relative path keying.
 */
export const extractSignals = async (
  filePaths = [],
  dependencies = {},
  repoRoot = "",
) => {
  const fileSignals = {};
  const signalTotals = {};
  const detectedSignals = {};
  const confidenceSumMap = {};
  const confidenceCountMap = {};
  const fileLevelSummary = {};

  const detectedFrameworks = dependencies.detectedFrameworks || [];

  for (const filePath of filePaths) {
    try {
      const rawContent = await fs.readFile(filePath, "utf-8");
      if (isMinifiedOrGenerated(rawContent)) {
        continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      const cleanContent = stripComments(rawContent, ext);
      const relKey = repoRoot
        ? path.relative(repoRoot, filePath).replace(/\\/g, "/")
        : filePath.replace(/\\/g, "/");
      const fileSignalDetails = [];
      const fileSignalNames = [];

      for (const [patternName, regex] of Object.entries(SIGNAL_PATTERNS)) {
        regex.lastIndex = 0;
        const matches = cleanContent.match(regex);
        if (matches && matches.length > 0) {
          const count = matches.length;
          const category = SIGNAL_CATEGORIES[patternName] || "General";
          const meta = SIGNAL_METADATA[patternName] || {};

          const hasFrameworkAlignment = isFrameworkAligned(
            meta.framework,
            detectedFrameworks,
          );

          const confidence = calculateSignalConfidence(
            patternName,
            count,
            hasFrameworkAlignment,
          );

          fileSignalNames.push(patternName);
          fileSignalDetails.push({
            signal: patternName,
            category,
            count,
            confidence,
            frameworkAlignment: hasFrameworkAlignment,
          });
          // add count,confidence,1 into pattern to get these 3 variable result
          signalTotals[patternName] = (signalTotals[patternName] || 0) + count;
          confidenceSumMap[patternName] =
            (confidenceSumMap[patternName] || 0) + confidence;
          confidenceCountMap[patternName] =
            (confidenceCountMap[patternName] || 0) + 1;
        }
      }
      // loop ends for one pattern here,after this we are collecting the info for whole file not for any one pattern
      if (fileSignalNames.length > 0) {
        fileSignals[relKey] = fileSignalNames;
        detectedSignals[relKey] = fileSignalDetails;
        //categoryCounts is having category of each file for for all files category list would be saved here
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

        const totalHits = fileSignalDetails.reduce((sum, detail) => {
          return sum + detail.count;
        }, 0);
        const semanticConfidence = totalHits
          ? fileSignalDetails.reduce(
              (sum, detail) => sum + detail.confidence * detail.count,
              0,
            ) / totalHits
          : 0;

        fileLevelSummary[relKey] = {
          signalsCount: fileSignalNames.length,
          primaryCategory: primaryCat,
          categoryCounts,
          totalHits,
          // The semantic confidence belongs to signal extraction. Step 6 may
          // adjust it with structural evidence, but must not recompute it.
          confidence: parseFloat(semanticConfidence.toFixed(2)),
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
