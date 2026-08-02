/**
 * Step 9: SummaryGenerator
 * Computes health score, generates headline, overview framing,
 * highlights, limitations, and summary statistics.
 */
export const generateSummary = (analysis) => {
  const { context, structure, architecture, critique, codeQuality } = analysis;

  // 1. REPOSITORY INTENT & FRAMEWORK DETECTED
  let intent = "project";
  const fileCount = context.totalFiles || 0;

  if (fileCount < 15) intent = "prototype or small project";
  else if (fileCount < 60) intent = "medium-scale application";
  else intent = "production-scale repository";

  const primaryLang = context.primaryLanguage || "Multi-Language";
  const frameworks =
    context.frameworkHints && context.frameworkHints.length > 0
      ? context.frameworkHints.join(", ")
      : "Standard Library / Native";

  const overview = `This repository is a ${intent} built with ${primaryLang} using ${frameworks}, focusing primarily on ${context.projectType || "General"} architecture.`;

  // 2. HEALTH SCORE CALCULATION
  let score = 85;

  if (critique.redFlags && critique.redFlags.length > 0) {
    score -= critique.redFlags.length * 8;
  }

  const hygiene = Object.values(codeQuality.entryPointHealth || {})[0];
  if (hygiene && hygiene.status === "Clean") {
    score += 5;
  }

  if (structure.entryPoints && structure.entryPoints.length === 0) {
    score -= 5;
  }

  const folders = Object.entries(architecture.folderStructureIntent || {});
  const avgCoherence =
    folders.reduce((acc, [_, s]) => acc + (parseFloat(s.coherence) || 0), 0) /
    (folders.length || 1);

  if (avgCoherence > 0.8) score += 10;
  else if (avgCoherence < 0.4) score -= 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // 3. HEADLINE
  let headline = "Standard Architecture";
  if (score > 90) headline = "Exceptional Structure & Organization";
  else if (score > 75) headline = "Solid & Modular Architecture";
  else if (score > 50) headline = "Work in Progress";
  else headline = "Architectural Review Recommended";

  // 4. HIGHLIGHTS
  const highlights = [];

  if (folders.length > 0) {
    const sortedFolders = [...folders].sort(
      (a, b) => b[1].coherence - a[1].coherence,
    );
    const topFolder = sortedFolders[0];

    if (parseFloat(topFolder[1].coherence) > 0.7) {
      highlights.push(
        `High structural focus observed in '${topFolder[0]}' directory (${topFolder[1].dominantType} logic).`,
      );
    }
  }

  const entryCount = structure.entryPoints ? structure.entryPoints.length : 0;
  if (entryCount === 1) {
    highlights.push(
      "Features a single, clear entry point making execution flow easy to trace.",
    );
  } else if (entryCount > 1) {
    highlights.push(
      `Detected ${entryCount} entry points, indicating a modular or monorepo structure.`,
    );
  }

  if (critique.redFlags && critique.redFlags.length === 0) {
    highlights.push("No architectural or security red flags detected during scan.");
  } else if (critique.redFlags) {
    highlights.push(
      `Found ${critique.redFlags.length} security or code quality signal(s) requiring review.`,
    );
  }

  // 5. LIMITATIONS
  const limitations = [
    "Runtime execution state and dynamic API connectivity",
    "Third-party external service health",
    "Deep cryptographical vulnerability analysis",
  ];

  return {
    score: score,
    headline: headline,
    overview: overview,
    whatStandsOut: highlights,
    whatWasNotAnalyzed: limitations,
    stats: {
      fileCount,
      entryCount,
      primaryLanguage: primaryLang,
      frameworks: context.frameworkHints || [],
      ecosystems: context.ecosystemsDetected || [],
      avgCoherence: (avgCoherence * 100).toFixed(1) + "%",
    },
  };
};

export const generateScorecard = (analysis) => {
  return generateSummary(analysis);
};
