import fs from "fs/promises";
import path from "path";

const EXTENSION_MAP = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".py": "Python",
  ".java": "Java",
  ".html": "HTML",
  ".css": "CSS",
  ".json": "Config",
};

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vscode",
]);

export const detectContext = async (repoPath) => {
  const context = {
    totalFiles: 0, // Fixed: We will increment this properly now
    primaryLanguage: "Unknown",
    frameworkHints: [],
    sourceRoot: "",
    projectType: "Mixed",
    // REMOVED: repoSize (It was redundant)
  };

  const languageCounts = {};
  let packageJsonPath = null;

  // 1. WALK THE FILESYSTEM
  async function quickWalk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;

        // Heuristic: Source Root Detection
        if (entry.name === "src" && !context.sourceRoot) {
          context.sourceRoot = "src";
        }
        await quickWalk(fullPath);
      } else {
        // --- FIX IS HERE ---
        context.totalFiles++;
        // -------------------

        const ext = path.extname(entry.name).toLowerCase();
        const lang = EXTENSION_MAP[ext];
        if (lang) {
          languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        }

        if (entry.name === "package.json") packageJsonPath = fullPath;
      }
    }
  }

  await quickWalk(repoPath);

  // 2. DETERMINE PRIMARY LANGUAGE
  let maxCount = 0;
  for (const [lang, count] of Object.entries(languageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      context.primaryLanguage = lang;
    }
  }

  // 3. READ PACKAGE.JSON
  if (packageJsonPath) {
    try {
      const data = await fs.readFile(packageJsonPath, "utf-8");
      const pkg = JSON.parse(data);

      // Merge dependencies to search everywhere
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      console.log(
        "[ContextAnalyzer] Found Dependencies:",
        Object.keys(allDeps),
      ); // Debug Log

      // Hints Logic
      if (allDeps["react"]) context.frameworkHints.push("React");
      if (allDeps["express"]) context.frameworkHints.push("Express");
      if (allDeps["mongoose"]) context.frameworkHints.push("MongoDB");
      if (allDeps["next"]) context.frameworkHints.push("Next.js");

      // Project Type Logic
      const isReact = context.frameworkHints.some((h) =>
        ["React", "Next.js"].includes(h),
      );
      const isBackend = context.frameworkHints.some((h) =>
        ["Express", "NestJS"].includes(h),
      );

      if (isReact && isBackend) context.projectType = "Fullstack";
      else if (isReact) context.projectType = "Frontend";
      else if (isBackend) context.projectType = "Backend";
    } catch (e) {
      console.error("Failed to parse package.json:", e.message);
    }
  }

  if (!context.sourceRoot) context.sourceRoot = "/";

  return context;
};
