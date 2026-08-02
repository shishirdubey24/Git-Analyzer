/**
 * Step 11: RedFlagDetector
 * Aggregates architectural, security, code hygiene, and complexity issues
 * into a categorized list of red flags with severity levels.
 */
export const detectRedFlags = (
  structure,
  signals = {},
  archResult = {},
  securityReport = {},
  docReport = {},
  testReport = {},
) => {
  const flags = [];

  // 1. Security Red Flags
  (securityReport.findings || []).forEach((finding) => {
    flags.push({
      severity: finding.severity,
      category: "Security",
      message: finding.message,
    });
  });

  // 2. Testing Red Flags
  if (!testReport.hasTests) {
    flags.push({
      severity: "MEDIUM",
      category: "Testing",
      message: "No test suite detected in repository. Consider adding unit tests.",
    });
  }

  // 3. Documentation Red Flags
  if (!docReport.hasReadme) {
    flags.push({
      severity: "LOW",
      category: "Documentation",
      message: "Missing README.md file. Project documentation is absent.",
    });
  }
  if (!docReport.hasGitignore) {
    flags.push({
      severity: "HIGH",
      category: "Hygiene",
      message: "Missing .gitignore file. Risk of committing temporary or sensitive files.",
    });
  }

  // 4. Entry Point Hygiene Red Flags
  Object.entries(docReport.entryPointHygiene || {}).forEach(([file, data]) => {
    (data.issues || []).forEach((issue) => {
      flags.push({
        severity: "MEDIUM",
        category: "Entry Point Quality",
        message: `${file}: ${issue}`,
      });
    });
  });

  // 5. Architecture Coherence Red Flags
  Object.entries(archResult.folderStructureIntent || {}).forEach(([folder, stats]) => {
    if (parseFloat(stats.coherence) < 0.4 && stats.filesAnalyzed >= 3) {
      flags.push({
        severity: "MEDIUM",
        category: "Architecture",
        message: `Folder '${folder}' has low coherence (${stats.coherence}). Mixes multiple architectural responsibilities.`,
      });
    }
  });

  return flags;
};
