import path from "path";
import {
  FOLDER_INTENT_MAP,
  FILENAME_ROLE_PATTERNS,
  ROLE_EVIDENCE_WEIGHTS,
  ARCHITECTURAL_PATTERN_RULES,
} from "../Registries/FilePatterns.js";

/**
 * Normalizes Step 5 output to its per-file semantic summaries.
 *
 * The production handoff uses `fileLevelSummary`, so category mapping is
 * performed once in Step 5. Older complete Step 5 payloads with only
 * `detectedSignals` are also accepted because they already contain categories.
 */
export const normalizeFileSummaries = (signalsInput) => {
  if (!signalsInput) return {};
  if (signalsInput.fileLevelSummary) return signalsInput.fileLevelSummary;

  const detectedSignals = signalsInput.detectedSignals || {};
  const summaries = {};
  for (const [fileKey, details] of Object.entries(detectedSignals)) {
    const categoryCounts = {};
    let totalHits = 0;
    let weightedConfidence = 0;
    (details || []).forEach((detail) => {
      const count = detail.count || 0;
      categoryCounts[detail.category] =
        (categoryCounts[detail.category] || 0) + count;
      totalHits += count;
      weightedConfidence += (detail.confidence || 0) * count;
    });

    const categories = Object.entries(categoryCounts);
    const primaryCategory =
      categories.sort(([, a], [, b]) => b - a)[0]?.[0] || "Utility";
    summaries[fileKey] = {
      primaryCategory,
      categoryCounts,
      confidence: totalHits ? weightedConfidence / totalHits : 0,
      details,
    };
  }
  return summaries;
};

/**
 * Infers folder intent from path segments using registry rules.
 */
export const inferPathRole = (filePath) => {
  const normalized = (filePath || "").replace(/\\/g, "/");
  const segments = normalized.split("/").map((s) => s.toLowerCase());

  for (const seg of segments) {
    if (FOLDER_INTENT_MAP[seg]) {
      return FOLDER_INTENT_MAP[seg];
    }
  }

  return null;
};

/**
 * Infers file role from filename naming conventions across multi-language registries.
 */
export const inferFilenameRole = (fileName) => {
  if (!fileName) return null;
  for (const { pattern, role } of FILENAME_ROLE_PATTERNS) {
    if (pattern.test(fileName)) {
      return role;
    }
  }
  return null;
};

/**
 * Infers file role from filename extension.
 */
export const inferExtensionRole = (fileName) => {
  if (fileName.match(/\.(js|ts|jsx|tsx|py|go|java|rs|php|rb|cs|kt|cpp|c)$/i)) {
    return "Logic / Utility";
  } else if (fileName.match(/\.(css|scss|less|sass|tailwind)$/i)) {
    return "Styling";
  } else if (fileName.match(/\.(json|yaml|yml|toml|xml|env)$/i)) {
    return "Config / Static";
  } else if (fileName.match(/\.(md|txt|rst|adoc)$/i)) {
    return "Documentation";
  }
  return "Resource / Static";
};

/**
 * Combines code signals, path intent, filename patterns, and extension heuristics to classify a file role with an evidence-weighted confidence score.
 */
export const classifyFile = (
  fileName,
  fileSignalSummary = {},
  fullPath = "",
  extraContext = {},
) => {
  // Step 5 owns signal-to-category mapping and semantic confidence.
  const categoryCounts = fileSignalSummary.categoryCounts || {};
  const signalCategories = new Set();
  const primaryCategory = fileSignalSummary.primaryCategory;
  if (
    primaryCategory &&
    primaryCategory !== "Utility" &&
    primaryCategory !== "Debug" &&
    primaryCategory !== "Risk" &&
    primaryCategory !== "Maintenance"
  ) {
    signalCategories.add(primaryCategory);
  }
  Object.keys(categoryCounts).forEach((cat) => {
    if (cat !== "Debug" && cat !== "Risk" && cat !== "Maintenance") {
      signalCategories.add(cat);
    }
  });

  const pathRole = fullPath ? inferPathRole(fullPath) : null;
  const filenameRole = inferFilenameRole(fileName);
  const extRole = inferExtensionRole(fileName);

  const roleScores = {};
  const evidenceMap = {};

  const addRoleEvidence = (role, points, description) => {
    if (!role) return;
    roleScores[role] = (roleScores[role] || 0) + points;
    if (!evidenceMap[role]) evidenceMap[role] = [];
    evidenceMap[role].push(description);
  };

  // 1. Signal evidence
  signalCategories.forEach((cat) => {
    addRoleEvidence(
      cat,
      ROLE_EVIDENCE_WEIGHTS.signal,
      `Code signal detected (${cat})`,
    );
  });

  // 2. Folder intent evidence
  if (pathRole) {
    addRoleEvidence(
      pathRole,
      ROLE_EVIDENCE_WEIGHTS.folder,
      `Folder location intent matches (${pathRole})`,
    );
  }

  // 3. Filename pattern evidence
  if (filenameRole) {
    addRoleEvidence(
      filenameRole,
      ROLE_EVIDENCE_WEIGHTS.filename,
      `Filename naming pattern matches (${filenameRole})`,
    );
  }

  // 4. Extension baseline
  addRoleEvidence(
    extRole,
    ROLE_EVIDENCE_WEIGHTS.extension,
    `Extension baseline (${extRole})`,
  );

  let primaryRole = "Logic / Utility";
  let maxScore = 0;

  for (const [role, score] of Object.entries(roleScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryRole = role;
    }
  }

  // Check if secondary strong roles exist (within 15 points and >= 75% of winner score, excluding default extension baseline)
  const secondaryRoles = Object.entries(roleScores)
    .filter(
      ([role, score]) =>
        role !== primaryRole &&
        role !== extRole &&
        score >= maxScore * 0.75 &&
        score >= maxScore - 15,
    )
    .map(([role]) => role);

  if (secondaryRoles.length > 0 && !signalCategories.has(primaryRole)) {
    const allMixed = [primaryRole, ...secondaryRoles].sort();
    primaryRole = `Mixed (${allMixed.join(" + ")})`;
  }

  const roleEvidence = evidenceMap[primaryRole] || evidenceMap[extRole] || [];

  // Structural confidence adjusts Step 5's semantic confidence; it does not
  // replace it with a second independent confidence model.
  let structuralConfidence = 0.4;
  if (maxScore >= 65) {
    structuralConfidence = 0.95;
  } else if (maxScore >= 50) {
    structuralConfidence = 0.85;
  } else if (maxScore >= 30) {
    structuralConfidence = 0.7;
  } else if (maxScore >= 15) {
    structuralConfidence = 0.5;
  }

  const semanticConfidence = Number(fileSignalSummary.confidence);
  const confidence =
    Number.isFinite(semanticConfidence) && semanticConfidence > 0
      ? semanticConfidence * 0.6 + structuralConfidence * 0.4
      : structuralConfidence;

  return {
    fileName,
    role: primaryRole,
    confidence: parseFloat(confidence.toFixed(2)),
    evidence: roleEvidence,
    detectedSignalCategories: Array.from(signalCategories),
    semanticConfidence:
      Number.isFinite(semanticConfidence) && semanticConfidence > 0
        ? parseFloat(semanticConfidence.toFixed(2))
        : null,
  };
};

/**
 * Evaluates evidence for candidate architectural patterns using registry rules (ARCHITECTURAL_PATTERN_RULES).
 * Derives folder roles cleanly from folderStructureIntent to avoid duplicate regexes.
 */
export const inferArchitecturalPattern = (
  layerDistribution,
  folderStructureIntent,
  extraContext = {},
) => {
  const layers = Object.keys(layerDistribution || {});
  const hasApi = layers.some((l) => l.includes("API Logic"));
  const hasDb = layers.some((l) => l.includes("Database"));
  const hasUi = layers.some((l) => l.includes("UI") || l.includes("Styling"));
  const hasBiz = layers.some((l) => l.includes("Business Logic"));

  // Derive folder intents directly from folderStructureIntent without inline regexes
  const dominantFolderRoles = new Set(
    Object.values(folderStructureIntent || {}).map((s) => s.dominantType),
  );

  const hasControllerFolder = dominantFolderRoles.has("API Logic");
  const hasModelFolder = dominantFolderRoles.has("Database");
  const hasViewFolder = dominantFolderRoles.has("UI");
  const hasDomainFolder = dominantFolderRoles.has("Business Logic");

  const deps = extraContext.dependencies || {};
  const isFullstackType = deps.projectType === "Fullstack";
  const isBackendType = deps.projectType === "Backend";
  const isFrontendType = deps.projectType === "Frontend";

  const contextFacts = {
    hasApi,
    hasDb,
    hasUi,
    hasBiz,
    hasControllerFolder,
    hasModelFolder,
    hasViewFolder,
    hasDomainFolder,
    isFullstackType,
    isBackendType,
    isFrontendType,
  };

  const patternScores = {};
  const patternRationale = {};

  for (const rule of ARCHITECTURAL_PATTERN_RULES) {
    let score = 0;
    const rationaleList = [];

    for (const evaluator of rule.evaluators) {
      if (evaluator.check(contextFacts)) {
        score += evaluator.weight;
        rationaleList.push(evaluator.rationale);
      }
    }

    patternScores[rule.name] = score;
    patternRationale[rule.name] = rationaleList;
  }

  // Find top candidate pattern
  let primaryPattern = "Modular Architecture";
  let maxScore = 0;

  for (const [pattern, score] of Object.entries(patternScores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryPattern = pattern;
    }
  }

  // Calculate folder coherence average
  const coherenceValues = Object.values(folderStructureIntent || {}).map(
    (s) => parseFloat(s.coherence) || 0,
  );
  const avgCoherence =
    coherenceValues.length > 0
      ? coherenceValues.reduce((a, b) => a + b, 0) / coherenceValues.length
      : 0.7;

  // Threshold check for overconfident claims
  let confidence = 0.5;
  let rationale = patternRationale[primaryPattern] || [];

  if (maxScore < 50) {
    primaryPattern = "Modular Architecture";
    confidence = 0.55;
    rationale = [
      "Insufficient distinct architectural layer evidence for enterprise pattern classification",
      "Defaulting conservatively to Modular Architecture",
    ];
  } else {
    // Derived explainable confidence
    const scoreFactor = maxScore / 100;
    const coherenceFactor = 0.7 + avgCoherence * 0.3;
    confidence = Math.min(0.95, Math.max(0.5, scoreFactor * coherenceFactor));
  }

  return {
    primaryPattern,
    confidence: parseFloat(confidence.toFixed(2)),
    evidenceScore: maxScore,
    rationale,
  };
};

/**
 * Step 6: Multi-Evidence ArchitectureClassifier
 * Infers file roles, architectural layers, directory coherence, and top-level design patterns
 * using evidence-weighted scoring across multi-language registries without basename collisions.
 */
export const classifyArchitecture = (
  signalsInput,
  sampledFilePaths = [],
  extraContext = {},
) => {
  const fileLevelSummary = normalizeFileSummaries(signalsInput);
  const fileRoles = {};
  const fileDetails = {};
  const layerDistribution = {};

  const repoRoot = extraContext.repoRoot || "";

  const getRelKey = (fp) => {
    if (!fp) return "";
    if (repoRoot && fp.startsWith(repoRoot)) {
      return path.relative(repoRoot, fp).replace(/\\/g, "/");
    }
    return fp.replace(/\\/g, "/");
  };

  // Build O(1) lookup Map for sampled file paths
  const relKeyToFullPathMap = new Map();
  sampledFilePaths.forEach((fp) => {
    const rKey = getRelKey(fp);
    relKeyToFullPathMap.set(rKey, fp);
    relKeyToFullPathMap.set(fp, fp);
  });

  const processedKeys = new Set();

  for (const [fileKey, fileSignalSummary] of Object.entries(fileLevelSummary)) {
    const fullPath = relKeyToFullPathMap.get(fileKey) || fileKey;
    const fileName = path.basename(fullPath);
    const relKey = getRelKey(fullPath);

    const classified = classifyFile(
      fileName,
      fileSignalSummary,
      fullPath,
      extraContext,
    );
    fileRoles[relKey] = classified.role;
    fileDetails[relKey] = classified;
    layerDistribution[classified.role] =
      (layerDistribution[classified.role] || 0) + 1;
    processedKeys.add(relKey);
  }

  sampledFilePaths.forEach((fullPath) => {
    const relKey = getRelKey(fullPath);
    if (!processedKeys.has(relKey)) {
      const fileName = path.basename(fullPath);
      const classified = classifyFile(fileName, {}, fullPath, extraContext);
      fileRoles[relKey] = classified.role;
      fileDetails[relKey] = classified;
      layerDistribution[classified.role] =
        (layerDistribution[classified.role] || 0) + 1;
    }
  });

  // Evaluate Folder Coherence using full relative directory path
  const folderStats = {};
  sampledFilePaths.forEach((fullPath) => {
    const relKey = getRelKey(fullPath);
    const relFolder = path.dirname(relKey).replace(/\\/g, "/") || "root";
    const role = fileRoles[relKey];
    if (!role) return;

    if (!folderStats[relFolder]) {
      folderStats[relFolder] = { types: {}, total: 0 };
    }
    const simplifiedRole = role.startsWith("Mixed") ? "Mixed" : role;
    folderStats[relFolder].types[simplifiedRole] =
      (folderStats[relFolder].types[simplifiedRole] || 0) + 1;
    folderStats[relFolder].total++;
  });

  const folderStructureIntent = {};
  for (const [folder, stats] of Object.entries(folderStats)) {
    let dominantType = "None";
    let maxCount = 0;
    for (const [type, count] of Object.entries(stats.types)) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    }
    const coherence = (maxCount / stats.total).toFixed(2);
    folderStructureIntent[folder] = {
      dominantType,
      coherence,
      filesAnalyzed: stats.total,
    };
  }

  // Infer repository-level architectural pattern using evidence scoring
  const patternInference = inferArchitecturalPattern(
    layerDistribution,
    folderStructureIntent,
    extraContext,
  );

  const repositoryArchitectureSummary = {
    primaryPattern: patternInference.primaryPattern,
    confidence: patternInference.confidence,
    evidenceScore: patternInference.evidenceScore,
    rationale: patternInference.rationale,
    layerDistribution,
    folderStructureIntent,
  };

  return {
    fileRoles,
    layerDistribution,
    folderStructureIntent,
    fileDetails,
    patternInference,
    repositoryArchitectureSummary,
  };
};
