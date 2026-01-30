import path from "path";

const MAX_FILES = 15;

// Files we MUST read if they exist
const CRITICAL_FILES = new Set([
  "package.json",
  "tsconfig.json",
  "dockerfile",
  "docker-compose.yml",
  ".env.example",
  "README.md",
]);

// Helper to flatten the tree into a simple list of files
const flattenTree = (nodes, fileList = []) => {
  for (const node of nodes) {
    if (node.type === "file") {
      fileList.push(node);
    } else if (node.type === "folder" && node.children) {
      flattenTree(node.children, fileList);
    }
  }
  return fileList;
};

export const sampleFiles = (structure, context = {}) => {
  const allFiles = flattenTree(structure.tree);
  const selectedFiles = [];
  const sourceRoot = context.sourceRoot || "src";

  // 1. Priority: Critical Config Files
  const critical = allFiles.filter((f) =>
    CRITICAL_FILES.has(f.name.toLowerCase()),
  );
  selectedFiles.push(...critical);

  // 2. Priority: Entry Points (Detected in Phase 5)
  const entryPaths = new Set(structure.entryPoints);
  const entries = allFiles.filter((f) => entryPaths.has(f.path));
  selectedFiles.push(...entries);

  // 3. Priority: Source Code
  const commonCodeDirs = ["controllers", "routes", "models", "api", "components", "pages", "utils", "hooks"];

  const sourceFiles = allFiles.filter((f) => {
    // Skip already added
    if (CRITICAL_FILES.has(f.name.toLowerCase()) || entryPaths.has(f.path)) return false;

    // Extensions check
    const isCode = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".html", ".css"].some(ext => f.name.toLowerCase().endsWith(ext));
    if (!isCode) return false;

    const relPath = f.path.replace(structure.root, "").toLowerCase();

    // Check if it's in a known source root or common folder
    const isInSourceRoot = sourceRoot !== "/" && relPath.includes(sourceRoot.toLowerCase());
    const isInCommonDir = commonCodeDirs.some(dir => relPath.includes(dir));

    // If sourceRoot is "/", we accept files that are not too deep or look important
    const isTopLevelSource = sourceRoot === "/" && relPath.split(path.sep).length <= 2;

    return isInSourceRoot || isInCommonDir || isTopLevelSource;
  });

  // Take the first 10 source files to get a "vibe check"
  selectedFiles.push(...sourceFiles.slice(0, 10));

  // Deduplicate and return paths
  const uniquePaths = [...new Set(selectedFiles.map((f) => f.path))];

  return uniquePaths.slice(0, MAX_FILES);
};
