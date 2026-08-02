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
  const strengths = [];
  const technicalDebt = [];

  if (structure.entryPoints && structure.entryPoints.length > 0) {
    strengths.push(`Identified ${structure.entryPoints.length} clear execution entry point(s).`);
  }
  if (testing.hasTests) {
    strengths.push(`Automated test suite detected (${testing.testFiles.length} test file(s)).`);
  }
  if (testing.hasCICD) {
    strengths.push(`CI/CD automated pipeline integration detected (${testing.cicdTools.join(", ")}).`);
  }
  if (security.riskLevel === "LOW") {
    strengths.push("No critical security credential leaks detected.");
  }

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
