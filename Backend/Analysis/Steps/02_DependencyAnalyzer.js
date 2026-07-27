import fs from "fs/promises";
import { FRAMEWORK_RULES } from "../Registries/TechStackRules.js";

export const analyzeDependencies = async (context) => {
  const depAnalysis = {
    totalDependencies: 0,
    dependenciesList: [],
    detectedFrameworks: [],
    categoriesFound: {},
    projectType: context.projectType,
    hasSecurityDeps: false,
    hasDatabaseDeps: false,
  };

  const detectedDeps = new Set();
  const detectedFrameworks = new Set();
  const categories = new Set();
  const detectedTypes = new Set();

  for (const manifest of context.manifestFilesFound || []) {
    try {
      // Read the manifest file content
      const content = await fs.readFile(manifest.path, "utf-8");

      if (manifest.name === "package.json") {
        const pkg = JSON.parse(content);
        const allDeps = {
          ...(pkg.dependencies || {}),
          ...(pkg.devDependencies || {}),
        };

        Object.keys(allDeps).forEach((dep) => detectedDeps.add(dep));
      } else {
        const lines = content.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (
            trimmed &&
            !trimmed.startsWith("#") &&
            !trimmed.startsWith("//") &&
            !trimmed.startsWith("[")
          ) {
            const depName = trimmed.split(/==|>=|<=|~=|=|<|>| /)[0];
            if (depName) detectedDeps.add(depName);
          }
        }
      }

      for (const rule of FRAMEWORK_RULES) {
        const keyLower = rule.key.toLowerCase();
        const isMatched =
          Array.from(detectedDeps).some((dep) =>
            dep.toLowerCase().includes(keyLower),
          ) || content.toLowerCase().includes(keyLower);

        if (isMatched) {
          detectedFrameworks.add(rule.name);
          categories.add(rule.category);
          detectedTypes.add(rule.type);

          if (
            rule.category.includes("Database") ||
            rule.category.includes("ORM")
          ) {
            depAnalysis.hasDatabaseDeps = true;
          }
          if (
            rule.category.includes("Security") ||
            rule.name.includes("Auth")
          ) {
            depAnalysis.hasSecurityDeps = true;
          }
        }
      }
    } catch (e) {
      console.error(
        `[DependencyAnalyzer] Error parsing ${manifest.name}:`,
        e.message,
      );
    }
  }

  depAnalysis.dependenciesList = Array.from(detectedDeps);
  depAnalysis.totalDependencies = detectedDeps.size;
  depAnalysis.detectedFrameworks = Array.from(detectedFrameworks);

  categories.forEach((cat) => {
    depAnalysis.categoriesFound[cat] = true;
  });

  // Refine Project Type based on dependencies
  if (detectedTypes.size === 1) {
    depAnalysis.projectType = Array.from(detectedTypes)[0];
  } else if (detectedTypes.has("Frontend") && detectedTypes.has("Backend")) {
    depAnalysis.projectType = "Fullstack";
  } else if (detectedTypes.has("Data Science / ML")) {
    depAnalysis.projectType = "Data Science / ML";
  } else if (detectedTypes.has("Backend")) {
    depAnalysis.projectType = "Backend";
  } else if (detectedTypes.has("Frontend")) {
    depAnalysis.projectType = "Frontend";
  }

  return depAnalysis;
};
