/**
 * Step 12: ExecutiveSummaryGenerator
 * Generates final health score (0-100), letter grade (A+, A, B, C, D, F),
 * executive headline, overview framing, key strengths, technical debt, and recommendations.
 */
export const generateExecutiveSummary = (analysisPayload) => {
  const {
    context = {},
    dependencies = {},
    structure = {},
    architecture = {},
    security = {},
    testing = {},
    documentation = {},
    redFlags = [],
  } = analysisPayload;

  const fileCount = context.totalFiles || 0;
  let intent = "project";
  if (fileCount < 15) intent = "prototype or micro-project";
  else if (fileCount < 60) intent = "medium-scale application";
  else intent = "production-scale repository";

  const primaryLang = context.primaryLanguage || "Multi-Language";
  const frameworks =
    dependencies.detectedFrameworks && dependencies.detectedFrameworks.length > 0
      ? dependencies.detectedFrameworks.join(", ")
      : "Standard Library / Native";

  const overview = `This repository is a ${intent} built primarily with ${primaryLang} using ${frameworks}, structured as a ${dependencies.projectType || "General Software"} application.`;

  // SCORE CALCULATION
  let score = 85;

  // Red Flags Deductions
  const criticalFlags = redFlags.filter((f) => f.severity === "CRITICAL").length;
  const highFlags = redFlags.filter((f) => f.severity === "HIGH").length;
  const mediumFlags = redFlags.filter((f) => f.severity === "MEDIUM").length;

  score -= criticalFlags * 15;
  score -= highFlags * 8;
  score -= mediumFlags * 4;

  // Bonuses
  if (testing.hasTests) score += 5;
  if (testing.hasCICD) score += 5;
  if (documentation.hasReadme) score += 5;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // LETTER GRADE
  let grade = "C";
  let headline = "Standard Architecture";

  if (score >= 95) {
    grade = "A+";
    headline = "Exceptional Architecture & Engineering Hygiene";
  } else if (score >= 85) {
    grade = "A";
    headline = "Solid & Modular Architecture";
  } else if (score >= 75) {
    grade = "B";
    headline = "Well-Structured with Minor Refinements Needed";
  } else if (score >= 60) {
    grade = "C";
    headline = "Work in Progress - Refactoring Recommended";
  } else if (score >= 45) {
    grade = "D";
    headline = "Architectural Debt & Security Review Required";
  } else {
    grade = "F";
    headline = "Critical Red Flags & Restructuring Required";
  }

  // STRENGTHS & TECHNICAL DEBT
  const isFrontend = dependencies.projectType === "Frontend" || dependencies.projectType === "Fullstack";
  const isBackend = dependencies.projectType === "Backend" || dependencies.projectType === "Fullstack";
  
  const strengths = [
    {
      category: "Repository & Infrastructure",
      points: [
        `The repository is structured as a ${dependencies.projectType || "General Software"} application containing ${fileCount} files.`,
        structure.entryPoints?.length ? `Identified ${structure.entryPoints.length} clear execution entry point(s), establishing a well-defined boot sequence.` : "Standard hierarchical structure established without explicit entry bloat.",
        security.riskLevel === "LOW" ? "Clean security baseline: No critical credential leaks or hardcoded secrets detected in the root codebase." : "Standard logic flow established."
      ]
    },
    {
      category: "Frontend Architecture",
      points: [
        isFrontend ? `Powered by modern reactive frameworks or UI libraries.` : "No major frontend frameworks detected (potentially a backend-only service).",
        architecture.layerDistribution?.UI ? `Clear separation of concerns: ~${architecture.layerDistribution.UI} UI-centric components/files mapped.` : "UI components integrated directly or natively.",
        dependencies.categoriesFound?.["UI / Styling"] ? "Maintains a structured styling and UI component ecosystem." : "Utilizes native styling paradigms."
      ]
    },
    {
      category: "Backend & Logic",
      points: [
        isBackend ? `Backend architecture leverages robust logic patterns and routing paradigms.` : "No dedicated backend framework detected (potentially a static or frontend-only app).",
        architecture.layerDistribution?.API ? `API layer clearly delineated with ~${architecture.layerDistribution.API} route or controller definitions.` : "API logic distributed across modules or externalized.",
        testing.hasCICD ? `CI/CD integration (${testing.cicdTools.join(", ")}) detected for reliable deployments.` : "Manual or external deployment strategies utilized."
      ]
    },
    {
      category: "Data Layer",
      points: [
        dependencies.hasDatabaseDeps
          ? "Database infrastructure explicitly configured via dependencies (ORM or Drivers detected)."
          : "No explicit database or ORM dependencies found; project is likely stateless, API-driven, or utilizing external data layers.",
        architecture.layerDistribution?.Database ? `Data layer structure contains ~${architecture.layerDistribution.Database} models or schemas.` : "Data schemas are defined dynamically or handled externally."
      ]
    }
  ];

  const technicalDebt = [];

  if (!testing.hasTests) {
    technicalDebt.push("Absence of automated unit/integration test coverage.");
  }
  if (security.sensitiveFilesFound && security.sensitiveFilesFound.length > 0) {
    technicalDebt.push(`Committed sensitive configuration file(s): ${security.sensitiveFilesFound.join(", ")}.`);
  }
  if (security.hardcodedSecretsFound && security.hardcodedSecretsFound.length > 0) {
    technicalDebt.push(`Potential hardcoded secret(s) in: ${security.hardcodedSecretsFound.join(", ")}.`);
  }
  if (!documentation.hasReadme) {
    technicalDebt.push("Missing repository README documentation.");
  }

  return {
    score: score,
    grade: grade,
    headline: headline,
    overview: overview,
    strengths: strengths,
    technicalDebt: technicalDebt,
    redFlagsCount: {
      critical: criticalFlags,
      high: highFlags,
      medium: mediumFlags,
      total: redFlags.length,
    },
    stats: {
      totalFiles: fileCount,
      totalDirectories: structure.folderCount || 0,
      totalDependencies: dependencies.totalDependencies || 0,
      primaryLanguage: primaryLang,
      languageBreakdown: context.languageStats || {},
      frameworks: dependencies.detectedFrameworks || [],
      ecosystems: context.ecosystemsDetected || [],
      isMonorepo: context.isMonorepo || false,
    },
  };
};
