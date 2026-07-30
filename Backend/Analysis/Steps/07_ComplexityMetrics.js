import fs from "fs/promises";
import path from "path";

/**
 * Step 7: ComplexityMetrics
 * Calculates code complexity metrics: line counts, large files (>300 lines),
 * average file size, and import density.
 */
export const calculateComplexity = async (filePaths) => {
  const metrics = {
    totalLinesAnalyzed: 0,
    averageLinesPerFile: 0,
    largeFiles: [],
    fileLineCounts: {},
    importCounts: {},
  };

  let totalLines = 0;
  let fileCount = 0;

  for (const filePath of filePaths) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const fileName = path.basename(filePath);
      const lineCount = lines.length;

      totalLines += lineCount;
      fileCount++;
      metrics.fileLineCounts[fileName] = lineCount;

      if (lineCount > 300) {
        metrics.largeFiles.push({
          file: fileName,
          lines: lineCount,
          recommendation: "Consider splitting into smaller sub-modules.",
        });
      }

      // Count Imports / Includes
      const imports = lines.filter((l) => {
        const trimmed = l.trim();
        return (
          trimmed.startsWith("import ") ||
          trimmed.startsWith("from ") ||
          trimmed.startsWith("require(") ||
          trimmed.startsWith("#include") ||
          trimmed.startsWith("use ")
        );
      }).length;

      metrics.importCounts[fileName] = imports;
    } catch (e) {
      console.error(`[ComplexityMetrics] Error analyzing ${filePath}:`, e.message);
    }
  }

  metrics.totalLinesAnalyzed = totalLines;
  metrics.averageLinesPerFile = Math.round(totalLines / (fileCount || 1));

  return metrics;
};
