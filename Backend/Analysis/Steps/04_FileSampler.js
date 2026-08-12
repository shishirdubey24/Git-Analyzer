import path from "path";
import {
  CRITICAL_FILES,
  ENTRY_POINT_CANDIDATES,
  COMMON_SOURCE_DIRS,
  GENERATED_OR_VENDOR_PATTERNS,
  TEST_FILE_PATTERNS,
} from "../Registries/FilePatterns.js";
import { EXTENSION_MAP } from "../Registries/TechStackRules.js";

const DEFAULT_MAX_SAMPLES = 30;

/**
 * Flattens the hierarchical directory tree into a flat array of file objects.
 */
export const flattenTree = (nodes, fileList = []) => {
  for (const node of nodes || []) {
    if (node.type === "file") {
      fileList.push(node);
    } else if (node.type === "folder" && node.children) {
      flattenTree(node.children, fileList);
    }
  }
  return fileList;
};

/**
 * Checks if a file is generated, minified, or a vendor dependency asset.
 */
export const isGeneratedOrVendor = (file) => {
  const relPath = (file.path || "").replace(/\\/g, "/");
  return GENERATED_OR_VENDOR_PATTERNS.some(
    (pattern) => pattern.test(relPath) || pattern.test(file.name),
  );
};

/**
 * Checks if a file is a test/spec asset.
 */
export const isTestFile = (file) => {
  const relPath = (file.path || "").replace(/\\/g, "/");
  return TEST_FILE_PATTERNS.some(
    (pattern) => pattern.test(relPath) || pattern.test(file.name),
  );
};

/**
 * Scores a file using multi-signal heuristics.
 */
export const scoreFile = (file, context = {}, structure = {}) => {
  let score = 0;
  const fileNameLower = (file.name || "").toLowerCase();
  const ext = path.extname(file.name || "").toLowerCase();
  const rootDir = structure.root || "";
  const relativePath = file.path.startsWith(rootDir)
    ? file.path.slice(rootDir.length).replace(/^[\/\\]/, "")
    : file.path;
  const pathSegments = relativePath.split(/[\/\\]/).filter(Boolean);
  const depth = pathSegments.length;

  // 1. Critical Manifests & Configuration Files (+80)
  const isCritical = CRITICAL_FILES.has(fileNameLower);
  if (isCritical) {
    score += 80;
  }

  // 2. Application Entry Points (+70)
  const entryPaths = new Set(structure.entryPoints || []);
  const isEntry =
    entryPaths.has(file.path) || ENTRY_POINT_CANDIDATES.has(fileNameLower);
  if (isEntry) {
    score += 70;
  }

  // 3. Supported Language Extension (+20 if valid, +10 if primary language)
  const validExts = new Set(Object.keys(EXTENSION_MAP));
  if (validExts.has(ext)) {
    score += 20;
    const fileLang = EXTENSION_MAP[ext];
    if (context.primaryLanguage && fileLang === context.primaryLanguage) {
      score += 10;
    }
  }

  // 4. Source Directory Presence (+15)
  const isInSourceDir = pathSegments.some((seg) =>
    COMMON_SOURCE_DIRS.includes(seg.toLowerCase()),
  );
  if (isInSourceDir) {
    score += 15;
  }

  // 5. Depth Scoring (prefer depth 1 to 4; penalize depth > 5)
  if (depth <= 3) {
    score += 15;
  } else if (depth <= 5) {
    score += 5;
  } else {
    score -= (depth - 5) * 5;
  }

  // 6. File Size Filtering & Penalties
  if (file.size !== undefined) {
    if (file.size < 50) {
      score -= 35;
    } else if (file.size > 300 * 1024) {
      score -= 30;
    } else if (file.size > 500 && file.size < 50 * 1024) {
      score += 10;
    }
  }

  // 7. Penalties
  if (isGeneratedOrVendor(file)) {
    score -= 100;
  }

  if (isTestFile(file)) {
    score -= 25;
  }

  return {
    ...file,
    score,
    isCritical,
    isEntry,
    relativePath,
    parentFolder:
      pathSegments.length > 1 ? pathSegments.slice(0, -1).join("/") : "root",
  };
};

/**
 * Enforces diversity sampling so no single directory dominates the selection.
 */
export const selectDiverseFiles = (scoredFiles, maxSamples) => {
  const sorted = [...scoredFiles].sort((a, b) => b.score - a.score);

  const folderBuckets = {};
  for (const file of sorted) {
    const bucketKey = file.parentFolder || "root";
    if (!folderBuckets[bucketKey]) folderBuckets[bucketKey] = [];
    //place the file inside the parent folder bucket so that we can select files from different folders

    folderBuckets[bucketKey].push(file);
  }

  const selected = [];
  const selectedPaths = new Set();

  // Always force-include top critical and entry point files first
  for (const file of sorted) {
    if ((file.isCritical || file.isEntry) && file.score > 40) {
      if (!selectedPaths.has(file.path)) {
        selected.push(file);
        selectedPaths.add(file.path);
      }
    }
  }

  // Round-robin selection across folder buckets to guarantee repository representation
  const bucketKeys = Object.keys(folderBuckets);
  const maxBucketSize = Math.max(
    ...bucketKeys.map((k) => folderBuckets[k].length),
    0,
  );

  const maxPerFolder = Math.max(
    3,
    Math.ceil(maxSamples / Math.max(1, bucketKeys.length)),
  );

  const folderCounts = {};

  for (let i = 0; i < maxBucketSize; i++) {
    for (const key of bucketKeys) {
      if (selected.length >= maxSamples) break;
      const file = folderBuckets[key][i];
      if (file && !selectedPaths.has(file.path) && file.score > -20) {
        const count = folderCounts[key] || 0;
        if (
          count < maxPerFolder ||
          selected.length + (bucketKeys.length - selected.length) >= maxSamples
        ) {
          selected.push(file);
          selectedPaths.add(file.path);
          folderCounts[key] = count + 1;
        }
      }
    }
    if (selected.length >= maxSamples) break;
  }

  // Backfill if below maxSamples with any remaining scored files above threshold
  if (selected.length < maxSamples) {
    for (const file of sorted) {
      if (selected.length >= maxSamples) break;
      if (!selectedPaths.has(file.path) && file.score > -20) {
        selected.push(file);
        selectedPaths.add(file.path);
      }
    }
  }

  return selected;
};

/**
 * Step 4: Intelligent FileSampler
 * Technology-agnostic, multi-signal scoring and representative sampling engine.
 */
export const sampleFiles = (structure, context = {}, options = {}) => {
  const maxSamples = options.maxSamples || DEFAULT_MAX_SAMPLES;
  const allFiles = flattenTree(structure?.tree || []);
  if (!allFiles.length) return [];

  const scoredFiles = allFiles.map((f) => scoreFile(f, context, structure));
  const selected = selectDiverseFiles(scoredFiles, maxSamples);
  return {
    paths: selected.map((f) => f.path),
    details: selected
  };
};
