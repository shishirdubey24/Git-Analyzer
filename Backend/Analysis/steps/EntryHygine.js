import fs from "fs/promises";
import path from "path";

export const checkEntryHygiene = async (entryPaths) => {
  const report = {};

  for (const filePath of entryPaths) {
    const fileName = path.basename(filePath);
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const issues = [];

      // 1. Check Size (Entry points should be small)
      if (lines.length > 80) {
        issues.push("Too Fat: Entry file exceeds 80 lines.");
      }

      // 2. Check Logic Leakage (Should not have complex logic)
      if (content.includes("fetch(") || content.includes("axios.")) {
        issues.push("Logic Leak: Network calls found in entry point.");
      }
      if (content.includes("useEffect") && !content.includes("<App")) {
        issues.push("Logic Leak: React Hooks found in entry point.");
      }

      // 3. Check Import Clutter
      const importCount = lines.filter((l) =>
        l.trim().startsWith("import "),
      ).length;
      if (importCount > 15) {
        issues.push(
          "Import Clutter: Too many imports (>15). Move providers to a separate file.",
        );
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
