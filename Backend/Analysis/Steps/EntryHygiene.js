import fs from "fs/promises";
import path from "path";

/**
 * Step 7: EntryHygiene
 * Checks main entry points for clean initialization patterns, logic leakage
 * (raw database queries, HTTP calls), fat file anti-patterns, and import clutter.
 */
export const checkEntryHygiene = async (entryPaths) => {
  const report = {};

  for (const filePath of entryPaths) {
    const fileName = path.basename(filePath);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const issues = [];

      // 1. File Length Audit
      if (lines.length > 120) {
        issues.push(`Fat Entry File: ${fileName} exceeds 120 lines (${lines.length} lines).`);
      }

      // 2. Logic Leakage Checks across languages
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

      // 3. Import / Dependency Clutter Check
      const importCount = lines.filter((l) => {
        const trimmed = l.trim();
        return (
          trimmed.startsWith("import ") ||
          trimmed.startsWith("from ") ||
          trimmed.startsWith("#include") ||
          trimmed.startsWith("require(") ||
          trimmed.startsWith("use ")
        );
      }).length;

      if (importCount > 18) {
        issues.push(`Import Clutter: High number of imports (${importCount}). Consider modularizing.`);
      }

      report[fileName] = {
        status: issues.length === 0 ? "Clean" : "Concern",
        issues: issues,
      };
    } catch (e) {
      report[fileName] = { status: "Error", issues: ["Could not read file"] };
    }
  }

  return report;
};
