import { detectContext } from "./Steps/01_ContextDetector.js";
import { analyzeDependencies } from "./Steps/02_DependencyAnalyzer.js";
import { mapStructure } from "./Steps/03_StructureMapper.js";
import { sampleFiles } from "./Steps/04_FileSampler.js";
import { extractSignals } from "./Steps/05_SignalExtractor.js";
import { classifyArchitecture } from "./Steps/06_ArchitectureClassifier.js";
import { calculateComplexity } from "./Steps/07_ComplexityMetrics.js";
import { auditSecurity } from "./Steps/08_SecurityAuditor.js";
import { auditTestingAndCICD } from "./Steps/09_TestingAndCICDAuditor.js";
import { auditDocumentation } from "./Steps/10_DocumentationAnalyzer.js";
import { detectRedFlags } from "./Steps/11_RedFlagDetector.js";
import { generateExecutiveSummary } from "./Steps/12_ExecutiveSummaryGenerator.js";

/**
 * Universal Analysis Orchestrator Engine
 * Coordinates a 12-step static analysis pipeline to evaluate any software repository.
 */
export const analyzeRepo = async (repoPath) => {
  console.log(`[Orchestrator] Starting 12-Step Universal Analysis for: ${repoPath}`);

  // Step 1: Ecosystem & Language Context
  let context = {};
  try {
    context = await detectContext(repoPath);
    console.log("[Orchestrator] Step 1 Complete: Ecosystem Context Detected.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 1 failed:", err.message);
  }

  // Step 2: Dependency & Framework Analysis
  let dependencies = {};
  try {
    dependencies = await analyzeDependencies(context);
    console.log("[Orchestrator] Step 2 Complete: Dependencies & Frameworks Analyzed.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 2 failed:", err.message);
  }

  // Step 3: Hierarchical Structure Mapping
  let structure = { tree: [], entryPoints: [], root: repoPath };
  try {
    structure = await mapStructure(repoPath);
    console.log(`[Orchestrator] Step 3 Complete: Structure Mapped (${structure.entryPoints.length} entry points).`);
  } catch (err) {
    console.error("[Orchestrator Warning] Step 3 failed:", err.message);
  }

  // Step 4: Intelligent File Sampling
  let sampledFiles = [];
  try {
    sampledFiles = sampleFiles(structure, context);
    console.log(`[Orchestrator] Step 4 Complete: Sampled ${sampledFiles.length} files.`);
  } catch (err) {
    console.error("[Orchestrator Warning] Step 4 failed:", err.message);
  }

  // Step 5: Multi-Language Signal Extraction
  let signals = { fileSignals: {}, signalTotals: {} };
  try {
    signals = await extractSignals(sampledFiles, dependencies, repoPath);
    console.log("[Orchestrator] Step 5 Complete: Code Signals Extracted.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 5 failed:", err.message);
  }

  // Step 6: Architecture Layer Classification
  let architecture = {};
  try {
    architecture = classifyArchitecture(signals, sampledFiles, {
      dependencies,
      context,
      repoRoot: repoPath,
    });
    console.log("[Orchestrator] Step 6 Complete: Architectural Layers Classified.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 6 failed:", err.message);
  }

  // Step 7: Complexity Metrics
  let complexity = {};
  try {
    complexity = await calculateComplexity(sampledFiles, repoPath);
    console.log("[Orchestrator] Step 7 Complete: Complexity Metrics Calculated.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 7 failed:", err.message);
  }

  // Step 8: Security Audit
  let security = {};
  try {
    security = auditSecurity(structure, signals);
    console.log("[Orchestrator] Step 8 Complete: Security Risk Audit Completed.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 8 failed:", err.message);
  }

  // Step 9: Testing & CI/CD Audit
  let testing = {};
  try {
    testing = auditTestingAndCICD(structure, context);
    console.log("[Orchestrator] Step 9 Complete: Testing & CI/CD Pipeline Audited.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 9 failed:", err.message);
  }

  // Step 10: Documentation & Entry Hygiene Audit
  let documentation = {};
  try {
    documentation = await auditDocumentation(structure, structure.entryPoints);
    console.log("[Orchestrator] Step 10 Complete: Documentation & Entry Hygiene Audited.");
  } catch (err) {
    console.error("[Orchestrator Warning] Step 10 failed:", err.message);
  }

  // Step 11: Priority Red Flag Detection
  let redFlags = [];
  try {
    redFlags = detectRedFlags(structure, signals, architecture, security, documentation, testing);
    console.log(`[Orchestrator] Step 11 Complete: Detected ${redFlags.length} Red Flags.`);
  } catch (err) {
    console.error("[Orchestrator Warning] Step 11 failed:", err.message);
  }

  // Assemble Payload
  const rawPayload = {
    meta: {
      analyzedAt: new Date().toISOString(),
      repoPath: repoPath,
    },
    context,
    dependencies,
    structure,
    codeQuality: {
      sampling: {
        totalFilesScanned: sampledFiles.length,
        files: sampledFiles.map((f) => f.replace(repoPath, "").replace(/^[\/\\]/, "")),
      },
      signals: signals.fileSignals,
      complexity,
      entryPointHealth: documentation.entryPointHygiene || {},
    },
    architecture: {
      fileResponsibilities: architecture.fileRoles || {},
      layerDistribution: architecture.layerDistribution || {},
      folderStructureIntent: architecture.folderStructureIntent || {},
      patternInference: architecture.patternInference || {},
      repositoryArchitectureSummary: architecture.repositoryArchitectureSummary || {},
    },
    security,
    testing,
    documentation,
    critique: {
      redFlags,
    },
  };

  // Step 12: Executive Summary & Scorecard Generation
  console.log("[Orchestrator] Step 12: Generating Final Executive Scorecard...");
  const summary = generateExecutiveSummary(rawPayload);

  return {
    ...rawPayload,
    summary,
  };
};
