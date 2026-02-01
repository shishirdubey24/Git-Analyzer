export const generateSummary = (analysis) => {
  const { context, structure, architecture, critique, codeQuality } = analysis;

  // --- STEP 1: IDENTIFY REPOSITORY INTENT ---
  let intent = "project";
  const fileCount = context.totalFiles || 0;

  if (fileCount < 15) intent = "learning resource or prototype";
  else if (fileCount < 50) intent = "personal project";
  else intent = "production-scale application";

  const framework =
    context.frameworkHints.length > 0
      ? context.frameworkHints[0]
      : "Vanilla JS";

  const overview = `This repository appears to be a ${intent} built with ${framework}, primarily focused on ${context.projectType} logic.`;

  // --- STEP 2: CALCULATE HEALTH SCORE ---
  let score = 85; // Base score

  // Deduct for red flags
  if (critique.redFlags.length > 0) {
    score -= critique.redFlags.length * 10;
  }

  // Bonus for clean entry point
  const hygiene = Object.values(codeQuality.entryPointHealth || {})[0];
  if (hygiene && hygiene.status === "Clean") {
    score += 5;
  }

  // Deduct for no entry point if not a library
  if (structure.entryPoints.length === 0) {
    score -= 5;
  }

  // Coherence bonus
  const folders = Object.entries(architecture.folderStructureIntent || {});
  const avgCoherence = folders.reduce((acc, [_, s]) => acc + (parseFloat(s.coherence) || 0), 0) / (folders.length || 1);
  if (avgCoherence > 0.8) score += 10;
  else if (avgCoherence < 0.4) score -= 10;

  score = Math.max(0, Math.min(100, score));

  // --- STEP 3: GENERATE HEADLINE ---
  let headline = "Standard Architecture";
  if (score > 90) headline = "Exceptional Structure";
  else if (score > 75) headline = "Solid Organization";
  else if (score > 50) headline = "Work in Progress";
  else headline = "Architectural Review Recommended";

  // --- STEP 4: GENERATE HIGHLIGHTS ---
  const highlights = [];

  // Insight A: Structural Focus
  folders.sort((a, b) => b[1].coherence - a[1].coherence);

  if (folders.length > 0) {
    const interestingFolders = folders.filter(
      ([_, stats]) =>
        !stats.dominantType.includes("Unknown") &&
        !stats.dominantType.includes("Static"),
    );

    const [name, stats] =
      interestingFolders.length > 0 ? interestingFolders[0] : folders[0];

    if (parseFloat(stats.coherence) > 0.7) {
      highlights.push(
        `The project is structurally organized, with a strong focus on ${stats.dominantType} logic in the '${name}' directory.`,
      );
    } else {
      highlights.push(
        "The folder structure shows some mixing of concerns, which is acceptable for a project of this scale.",
      );
    }
  }

  // Insight B: Entry Point Clarity
  const entryCount = structure.entryPoints.length;
  if (entryCount === 1) {
    highlights.push(
      "It features a single, clear entry point, making the execution flow easy to trace.",
    );
  } else if (entryCount === 0) {
    highlights.push(
      "No obvious entry point was detected, suggesting this might be a library or a collection of scripts.",
    );
  } else {
    highlights.push(
      `Multiple entry points were detected (${entryCount}), which is typical for multi-page or microservice architectures.`,
    );
  }

  // Insight C: Code Hygiene
  if (hygiene && hygiene.status === "Clean") {
    highlights.push(
      "The initialization logic is clean and concise, avoiding 'fat entry file' anti-patterns.",
    );
  }

  // Insight D: Risk Assessment
  if (critique.redFlags.length === 0) {
    highlights.push(
      "No architectural or security red flags were detected during the static scan.",
    );
  } else {
    highlights.push(
      `Detected ${critique.redFlags.length} architectural signal(s) that may require attention.`,
    );
  }

  // --- STEP 5: LIMITATIONS ---
  const limitations = [
    "Runtime behavior and API connectivity",
    "State management complexity (Redux/Context flow)",
    "Deep security vulnerability scanning",
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
      avgCoherence: (avgCoherence * 100).toFixed(1) + "%",
      framework,
    }
  };
};

export const generateScorecard = (analysis) => {
  return generateSummary(analysis);
};
