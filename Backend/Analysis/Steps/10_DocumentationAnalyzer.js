import fs from "fs/promises";
import path from "path";

/**
 * Step 10: DocumentationAnalyzer
 * Evaluates repository documentation hygiene: README completeness,
 * LICENSE presence, .gitignore quality, and entry point hygiene.
 */
export const auditDocumentation = async (structure, entryPaths = []) => {
  const report = {
    hasReadme: false,
    readmeLength: 0,
    hasLicense: false,
    hasGitignore: false,
    entryPointHygiene: {},
    documentationGrade: "C",
  };

  const flatten = (nodes) => {
    let list = [];
    for (const node of nodes) {
      list.push(node);
      if (node.children) list = list.concat(flatten(node.children));
    }
    return list;
  };
  const allFiles = flatten(structure.tree || []);

  for (const file of allFiles) {
    const lowerName = file.name.toLowerCase();
    if (lowerName.startsWith("readme")) {
      report.hasReadme = true;
      try {
        const content = await fs.readFile(file.path, "utf-8");
        report.readmeLength = content.split("\n").length;
      } catch {}
    }
    if (lowerName.startsWith("license") || lowerName.startsWith("licence")) {
      report.hasLicense = true;
    }
    if (lowerName === ".gitignore") {
      report.hasGitignore = true;
    }
  }

  // Entry Point Hygiene Audit
  for (const entryPath of entryPaths) {
    const fileName = path.basename(entryPath);
    try {
      const content = await fs.readFile(entryPath, "utf-8");
      const lines = content.split("\n");
      const issues = [];

      if (lines.length > 120) {
        issues.push(`Fat Entry File: ${fileName} exceeds 120 lines (${lines.length} lines).`);
      }

      if (
        content.includes("fetch(") ||
        content.includes("axios.") ||
        content.includes("requests.get") ||
        content.includes("http.Get")
      ) {
        issues.push("Logic Leak: Direct network calls found in entry point.");
      }

      if (
        content.includes("SELECT ") ||
        content.includes("INSERT INTO") ||
        content.includes("db.query")
      ) {
        issues.push("Logic Leak: Raw database queries executed directly inside entry point.");
      }

      report.entryPointHygiene[fileName] = {
        status: issues.length === 0 ? "Clean" : "Concern",
        issues: issues,
      };
    } catch {
      report.entryPointHygiene[fileName] = { status: "Error", issues: ["Could not read file"] };
    }
  }

  // Grade
  let score = 0;
  if (report.hasReadme) score += 40;
  if (report.readmeLength > 30) score += 20;
  if (report.hasLicense) score += 20;
  if (report.hasGitignore) score += 20;

  if (score >= 90) report.documentationGrade = "A";
  else if (score >= 70) report.documentationGrade = "B";
  else if (score >= 50) report.documentationGrade = "C";
  else report.documentationGrade = "D";

  return report;
};
