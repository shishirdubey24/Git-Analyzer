import fs from "fs/promises";
import path from "path";
import {
  IGNORED_DIRS,
  ENTRY_POINT_CANDIDATES,
} from "../Registries/FilePatterns.js";

/**
 * Step 3: StructureMapper
 * Builds a complete hierarchical tree of the repository and detects
 * application entry points across multi-language frameworks and monorepos.
 */
export const mapStructure = async (rootDir) => {
  const structure = {
    root: rootDir,
    tree: [],
    entryPoints: [],
    folderCount: 0,
    fileCount: 0,
  };

  async function buildTree(currentPath, depth = 0) {
    const name = path.basename(currentPath);
    let stats;
    try {
      stats = await fs.stat(currentPath);
    } catch {
      return null;
    }

    if (stats.isDirectory()) {
      if (IGNORED_DIRS.has(name.toLowerCase())) return null;
      structure.folderCount++;
      // childrenEntries would be used to store the child of hte root dir .
      let childrenEntries = [];
      try {
        childrenEntries = await fs.readdir(currentPath);
      } catch {
        return null;
      }

      const children = [];
      for (const childName of childrenEntries) {
        const childPath = path.join(currentPath, childName);
        const childNode = await buildTree(childPath, depth + 1);
        if (childNode) children.push(childNode);
      }

      return { name, type: "folder", path: currentPath, children };
    } else {
      structure.fileCount++;
      const lowerName = name.toLowerCase();
      const isCandidate = ENTRY_POINT_CANDIDATES.has(lowerName);
      const isTopLevel = depth <= 3;
      const isFrameworkEntry =
        (lowerName.startsWith("page.") ||
          lowerName.startsWith("layout.") ||
          lowerName.startsWith("main.") ||
          lowerName.startsWith("app.") ||
          lowerName.startsWith("server.") ||
          lowerName.startsWith("manage.")) &&
        depth <= 5;

      if (isCandidate && (isTopLevel || isFrameworkEntry)) {
        structure.entryPoints.push(currentPath);
      }

      return { name, type: "file", path: currentPath, size: stats.size };
    }
  }

  const rootNode = await buildTree(rootDir);
  structure.tree = rootNode ? rootNode.children : [];
  return structure;
};
