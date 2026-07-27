import fs from "fs/promises";
import path from "path";
import {
  EXTENSION_MAP,
  FRAMEWORK_RULES,
  MANIFEST_FILES,
} from "../Registries/TechStackRules.js";
import {
  IGNORED_DIRS,
  COMMON_SOURCE_DIRS,
} from "../Registries/FilePatterns.js";

export const detectContext = async (repoPath) => {
  const context = {
    totalFiles: 0,
    primaryLanguage: "Unknown",
    languageStats: {},
    languageCounts: {},
    frameworkHints: [],
    ecosystemsDetected: [],
    manifestFilesFound: [],
    isMonorepo: false,
    sourceRoot: "",
    projectType: "General Software",
  };

  const languageCounts = {};

  async function walk(currentDir, depth = 0) {
    let entries = [];
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        const lowerDir = entry.name.toLowerCase();

        if (IGNORED_DIRS.has(lowerDir)) continue;

        if (
          ["packages", "apps", "services", "modules"].includes(lowerDir) &&
          depth <= 2
        ) {
          context.isMonorepo = true;
        }

        if (COMMON_SOURCE_DIRS.includes(lowerDir) && !context.sourceRoot) {
          context.sourceRoot = entry.name;
        }

        await walk(fullPath, depth + 1);
      } else {
        context.totalFiles++;

        const ext = path.extname(entry.name).toLowerCase();
        const lang = EXTENSION_MAP[ext];
        if (lang) {
          languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        }

        const lowerName = entry.name.toLowerCase();
        const manifestMatch = MANIFEST_FILES.find(
          (m) => m.name.toLowerCase() === lowerName,
        );
        if (manifestMatch) {
          context.manifestFilesFound.push({
            name: entry.name,
            path: fullPath,
            ecosystem: manifestMatch.ecosystem,
          });
          if (!context.ecosystemsDetected.includes(manifestMatch.ecosystem)) {
            context.ecosystemsDetected.push(manifestMatch.ecosystem);
          }
        }
      }
    }
  }

  await walk(repoPath);

  let maxCount = 0;
  context.languageCounts = languageCounts;
  for (const [lang, count] of Object.entries(languageCounts)) {
    const percentage = ((count / (context.totalFiles || 1)) * 100).toFixed(1);
    context.languageStats[lang] = `${percentage}%`;

    if (count > maxCount) {
      maxCount = count;
      context.primaryLanguage = lang;
    }
  }

  if (!context.sourceRoot) context.sourceRoot = "/";

  return context;
};
