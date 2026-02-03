import { detectContext } from "./Steps/ContextAnalyzer.js";
import { mapStructure } from "./Steps/StructureMapper.js";
import { sampleFiles } from "./Steps/FileSampler.js";
import { extractSignals } from "./Steps/SignalExtractor.js";
import { classifyResponsibility } from "./Steps/ResponsibiltyClassifier.js";
import { analyzeFolderCoherence } from "./Steps/FolderAnalyzer.js";
import { checkEntryHygiene } from "./Steps/EntryHygine.js";
import { detectRedFlags } from "./Steps/RedFlagDetector.js";
// PHASE 12 IMPORT
import { generateSummary } from "./Steps/SummeryGenerator.js";
export const analyzeRepo = async (repoPath) => {
  console.log(`[Orchestrator] Starting analysis for: ${repoPath}`);

  const context = await detectContext(repoPath);
  console.log("[Orchestrator] Phase 4 Complete: Context Detected");

  console.log("[Orchestrator] Starting Phase 5: Structure Mapping...");
  const structure = await mapStructure(repoPath);
  console.log(
    `[Orchestrator] Phase 5 Complete. Found ${structure.entryPoints.length} potential entry points.`,
  );

  // PHASE 6: File Sampling (The Bouncer)
  console.log("[Orchestrator] Sampling files...");
  const importantFiles = sampleFiles(structure, context);
  console.log(
    `[Orchestrator] Selected ${importantFiles.length} files for deep scan.`,
  );

  // PHASE 7: Signal Extraction (The Reader)
  console.log("[Orchestrator] Extracting signals...");
  const signals = await extractSignals(importantFiles);

  // PHASE 8: Responsibility Classification
  const fileRoles = classifyResponsibility(signals);

  // PHASE 9: Folder Coherence
  const folderIntent = analyzeFolderCoherence(fileRoles, importantFiles);

  // PHASE 10: Entry Hygiene
  console.log("[Orchestrator] Checking Entry Point Hygiene...");
  const hygieneReport = await checkEntryHygiene(structure.entryPoints);

  // PHASE 11: Red Flags
  console.log("[Orchestrator] Scanning for Red Flags...");
  const redFlags = detectRedFlags(structure, signals, folderIntent);

  // --- CONSTRUCT RAW ANALYSIS OBJECT ---
  // We build this first so we can pass it to Phase 12
  const rawAnalysis = {
    meta: {
      analyzedAt: new Date().toISOString(),
      repoPath: repoPath,
    },
    context: context,
    structure: structure,

    codeQuality: {
      sampling: {
        totalFilesScanned: importantFiles.length,
        files: importantFiles.map((f) =>
          f.replace(repoPath, "").replace(/^[\/\\]/, ""),
        ),
      },
      signals: signals,
      entryPointHealth: hygieneReport,
    },

    architecture: {
      fileResponsibilities: fileRoles,
      folderStructureIntent: folderIntent,
    },

    critique: {
      redFlags: redFlags,
    },
  };

  // PHASE 12: THE SCORECARD (The "Product" Layer)
  console.log("[Orchestrator] Generating Final Scorecard...");
  const summary = generateSummary(rawAnalysis);

  // --- RETURN FINAL RESPONSE ---
  return {
    ...rawAnalysis,
    summary: summary,
  };
};
