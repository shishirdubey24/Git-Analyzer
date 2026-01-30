import fs from "fs/promises";
import path from "path";

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vscode",
  ".next",
]);

// Bootstrappers usually live near the top
const ENTRY_POINT_CANDIDATES = new Set([
  "index.js",
  "main.js",
  "server.js",
  "app.js",
  "index.jsx",
  "main.jsx",
  "app.jsx",
  "index.ts",
  "main.ts",
  "app.ts",
  "index.tsx",
  "main.tsx",
  "app.tsx",
  "layout.js",
  "layout.tsx",
  "page.js",
  "page.tsx",
  "index.html",
]);

export const mapStructure = async (rootDir) => {
  const structure = {
    root: rootDir,
    tree: [],
    entryPoints: [],
  };

  async function buildTree(currentPath, depth = 0) {
    const name = path.basename(currentPath);
    const stats = await fs.stat(currentPath);

    if (stats.isDirectory()) {
      if (IGNORED_DIRS.has(name)) return null;

      const childrenEntries = await fs.readdir(currentPath);
      const children = [];

      for (const childName of childrenEntries) {
        const childPath = path.join(currentPath, childName);
        const childNode = await buildTree(childPath, depth + 1);
        if (childNode) children.push(childNode);
      }

      return { name, type: "folder", path: currentPath, children };
    } else {
      // Rule: Only count as "App Entry Point" if it's in the top 2 levels (root or src/)

      const isCandidate = ENTRY_POINT_CANDIDATES.has(name.toLowerCase());
      const isTopLevel = depth <= 2;
      const isNextEntry =
        (name.startsWith("page.") || name.startsWith("layout.")) && depth < 5;

      if (isCandidate && (isTopLevel || isNextEntry)) {
        structure.entryPoints.push(currentPath);
      }

      return { name, type: "file", path: currentPath, size: stats.size };
    }
  }

  const rootNode = await buildTree(rootDir);
  structure.tree = rootNode ? rootNode.children : [];
  return structure;
};
