import fs from "fs/promises";
import path from "path";

/**
 * Step 7: Maintainability & Complexity Analyzer
 * Evaluates repository complexity across multi-language files using size distribution,
 * function density, class counts, comment ratios, nesting depth, and maintainability scoring.
 */
export const calculateComplexity = async (filePaths = [], repoRoot = "") => {
  const metrics = {
    totalFilesAnalyzed: 0,
    totalLinesAnalyzed: 0,
    averageLinesPerFile: 0,
    sizeDistribution: {
      small: 0,
      medium: 0,
      large: 0,
      veryLarge: 0,
    },
    totalFunctions: 0,
    averageFunctionsPerFile: 0,
    totalClasses: 0,
    totalImports: 0,
    averageImportsPerFile: 0,
    averageNestingDepth: 0,
    averageCommentRatio: 0,
    maintainabilityScore: 85,
    complexityLevel: "Low",
    largeFiles: [],
    fileLineCounts: {},
    importCounts: {},
    functionCounts: {},
    classCounts: {},
    fileMetrics: {},
    topHotspots: [],
  };

  if (!filePaths || filePaths.length === 0) {
    return metrics;
  }

  let totalLines = 0;
  let totalCodeLines = 0;
  let totalCommentLines = 0;
  let totalFunctions = 0;
  let totalClasses = 0;
  let totalImports = 0;
  let sumNesting = 0;
  let fileCount = 0;

  const fileSummaries = [];

  const getRelKey = (fp) => {
    if (!fp) return "";
    const normFp = fp.replace(/\\/g, "/");
    const normRoot = repoRoot ? repoRoot.replace(/\\/g, "/") : "";
    if (normRoot && normFp.toLowerCase().startsWith(normRoot.toLowerCase())) {
      const rel = normFp.slice(normRoot.length).replace(/^\//, "");
      return rel || normFp;
    }
    return normFp;
  };

  for (const filePath of filePaths) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const relKey = getRelKey(filePath);
      const ext = path.extname(filePath).toLowerCase();

      const lineCount = lines.length;
      totalLines += lineCount;
      fileCount++;

      // 1. Comment & Code Line Breakdown
      let commentLines = 0;
      let blankLines = 0;
      let maxNestingInFile = 1;

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
          blankLines++;
          return;
        }

        if (
          [".py", ".rb", ".sh", ".yml", ".yaml", ".toml"].includes(ext) &&
          trimmed.startsWith("#")
        ) {
          commentLines++;
        } else if (ext === ".sql" && (trimmed.startsWith("--") || trimmed.startsWith("/*"))) {
          commentLines++;
        } else if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
          commentLines++;
        }

        // Nesting depth estimate using indentation level & control flow keywords
        if (/^(if|else|for|while|switch|try|catch|except|match|select|case)\b/.test(trimmed)) {
          const indent = line.search(/\S/);
          const depth = Math.min(8, Math.floor(indent / 2) + 1);
          if (depth > maxNestingInFile) {
            maxNestingInFile = depth;
          }
        }
      });

      const codeLines = Math.max(1, lineCount - commentLines - blankLines);
      totalCodeLines += codeLines;
      totalCommentLines += commentLines;
      sumNesting += maxNestingInFile;

      const commentRatio = parseFloat(
        (commentLines / Math.max(1, lineCount - blankLines)).toFixed(2),
      );

      // 2. File Size Categorization
      let category = "Small";
      if (lineCount > 500) {
        category = "Very Large";
        metrics.sizeDistribution.veryLarge++;
      } else if (lineCount > 250) {
        category = "Large";
        metrics.sizeDistribution.large++;
      } else if (lineCount > 100) {
        category = "Medium";
        metrics.sizeDistribution.medium++;
      } else {
        metrics.sizeDistribution.small++;
      }

      // 3. Multi-Language Function Detection
      const funcMatches = content.match(
        /\b(function\s+\w+|const\s+\w+\s*=\s*(\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|def\s+\w+|func\s+(\([^)]+\)\s*)?\w+|fn\s+\w+|(public|private|protected|static|async|fun)\s+[\w<>,\[\]]+\s+\w+\s*\()/gi,
      ) || [];
      const functionCount = funcMatches.length;
      totalFunctions += functionCount;

      // 4. Multi-Language Class / Struct / Interface Detection
      const classMatches = content.match(
        /\b(class|struct|interface|trait|type\s+\w+\s+struct)\s+[A-Z]\w*/g,
      ) || [];
      const classCount = classMatches.length;
      totalClasses += classCount;

      // 5. Import Detection
      const importMatches = lines.filter((l) => {
        const trimmed = l.trim();
        return (
          trimmed.startsWith("import ") ||
          trimmed.startsWith("from ") ||
          trimmed.startsWith("require(") ||
          trimmed.startsWith("#include") ||
          trimmed.startsWith("use ") ||
          trimmed.startsWith("using ")
        );
      }).length;
      totalImports += importMatches;

      const avgFuncSize = Math.round(codeLines / Math.max(1, functionCount));

      // Calculate individual file complexity penalty score (0-100)
      let fileComplexityPenalty = 0;
      if (lineCount > 500) fileComplexityPenalty += 35;
      else if (lineCount > 250) fileComplexityPenalty += 20;

      if (maxNestingInFile > 4) fileComplexityPenalty += 25;
      else if (maxNestingInFile > 2) fileComplexityPenalty += 10;

      if (avgFuncSize > 60) fileComplexityPenalty += 20;

      if (commentRatio < 0.05 && lineCount > 100) fileComplexityPenalty += 15;

      const fileComplexityScore = Math.min(100, fileComplexityPenalty);

      fileSummaries.push({
        file: relKey,
        lines: lineCount,
        codeLines,
        commentLines,
        commentRatio,
        category,
        functions: functionCount,
        classes: classCount,
        imports: importMatches,
        avgFunctionSize: avgFuncSize,
        maxNesting: maxNestingInFile,
        complexityPenalty: fileComplexityScore,
      });

      // Backward-compatible structures
      metrics.fileLineCounts[relKey] = lineCount;
      metrics.importCounts[relKey] = importMatches;
      metrics.functionCounts[relKey] = functionCount;
      metrics.classCounts[relKey] = classCount;

      if (lineCount > 300) {
        metrics.largeFiles.push({
          file: relKey,
          lines: lineCount,
          category,
          recommendation:
            lineCount > 500
              ? "Very large file. Strongly recommend splitting into modular sub-files."
              : "Large file. Consider refactoring complex functions into helper utilities.",
        });
      }
    } catch (e) {
      console.error(
        `[ComplexityMetrics] Error analyzing ${filePath}: ${e.message}`,
      );
    }
  }

  metrics.totalFilesAnalyzed = fileCount;
  metrics.totalLinesAnalyzed = totalLines;
  metrics.averageLinesPerFile = Math.round(totalLines / Math.max(1, fileCount));
  metrics.totalFunctions = totalFunctions;
  metrics.averageFunctionsPerFile = parseFloat(
    (totalFunctions / Math.max(1, fileCount)).toFixed(1),
  );
  metrics.totalClasses = totalClasses;
  metrics.totalImports = totalImports;
  metrics.averageImportsPerFile = parseFloat(
    (totalImports / Math.max(1, fileCount)).toFixed(1),
  );
  metrics.averageNestingDepth = parseFloat(
    (sumNesting / Math.max(1, fileCount)).toFixed(1),
  );
  metrics.averageCommentRatio = parseFloat(
    (totalCommentLines / Math.max(1, totalLines)).toFixed(2),
  );

  // Overall Maintainability Score Calculation (100 - average penalties)
  const avgFilePenalty =
    fileSummaries.length > 0
      ? fileSummaries.reduce((a, b) => a + b.complexityPenalty, 0) /
        fileSummaries.length
      : 15;

  const maintainabilityScore = Math.max(
    0,
    Math.min(100, Math.round(100 - avgFilePenalty)),
  );
  metrics.maintainabilityScore = maintainabilityScore;

  if (maintainabilityScore >= 80) {
    metrics.complexityLevel = "Low";
  } else if (maintainabilityScore >= 60) {
    metrics.complexityLevel = "Medium";
  } else {
    metrics.complexityLevel = "High";
  }

  // Top Complexity Hotspots (top 3-5 files sorted by highest complexity penalty)
  metrics.topHotspots = fileSummaries
    .sort((a, b) => b.complexityPenalty - a.complexityPenalty)
    .slice(0, 5)
    .filter((f) => f.complexityPenalty > 15)
    .map((f) => ({
      file: f.file,
      lines: f.lines,
      functions: f.functions,
      maxNesting: f.maxNesting,
      category: f.category,
      complexityPenalty: f.complexityPenalty,
      recommendation: `High complexity score (${f.complexityPenalty}/100). Review function lengths and nesting depth.`,
    }));

  return metrics;
};
