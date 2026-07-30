import path from "path";
import { SIGNAL_CATEGORIES } from "../Registries/SignalRules.js";
import { FOLDER_INTENT_MAP } from "../Registries/FilePatterns.js";

/**
 * Normalizes input signals to handle both raw fileSignals object or full Step 5 output object.
 */
export const normalizeSignals = (signalsInput) => {
  if (!signalsInput) return {};
  if (signalsInput.fileSignals) return signalsInput.fileSignals;
  return signalsInput;
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
 * Combines signals, path intent, and extension heuristics to classify a single file.
 */
export const classifyFile = (fileName, signalsList = [], fullPath = "") => {
  const signalCategories = new Set();

  (signalsList || []).forEach((sig) => {
    const cat = SIGNAL_CATEGORIES[sig];
    if (cat && cat !== "Debug" && cat !== "Risk" && cat !== "Maintenance") {
      signalCategories.add(cat);
    }
  });

  const pathRole = fullPath ? inferPathRole(fullPath) : null;
  const extRole = inferExtensionRole(fileName);

  let primaryRole = "Logic / Utility";
  let confidence = 0.6;
  const evidence = [];

  if (signalCategories.size === 1) {
    const signalRole = [...signalCategories][0];
    primaryRole = signalRole;
    if (
      pathRole &&
      (pathRole === signalRole || pathRole.includes(signalRole))
    ) {
      confidence = 0.95;
      evidence.push(`Code signals and folder intent match (${signalRole})`);
    } else {
      confidence = 0.85;
      evidence.push(`Code signal detected (${signalRole})`);
    }
  } else if (signalCategories.size > 1) {
    const catsArray = [...signalCategories].sort();
    primaryRole = `Mixed (${catsArray.join(" + ")})`;
    confidence = 0.85;
    evidence.push(
      `Multiple architectural signals detected (${catsArray.join(", ")})`,
    );
  } else if (pathRole) {
    primaryRole = pathRole;
    confidence = 0.75;
    evidence.push(`Inferred from folder location (${pathRole})`);
  } else {
    primaryRole = extRole;
    confidence = 0.5;
    evidence.push(`Default extension baseline (${extRole})`);
  }

  return {
    fileName,
    role: primaryRole,
    confidence,
    evidence,
    detectedSignalCategories: Array.from(signalCategories),
  };
};

/**
 * Infers repository-level architectural pattern (e.g. MVC, Clean Architecture, Component-Driven, Fullstack).
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

  const folders = Object.keys(folderStructureIntent || {}).map((f) =>
    f.toLowerCase(),
  );
  const hasControllers = folders.some(
    (f) => f.includes("controller") || f.includes("route") || f.includes("api"),
  );
  const hasModels = folders.some(
    (f) =>
      f.includes("model") || f.includes("entity") || f.includes("repository"),
  );
  const hasViews = folders.some(
    (f) => f.includes("view") || f.includes("component") || f.includes("page"),
  );
  const hasDomain = folders.some(
    (f) =>
      f.includes("domain") || f.includes("usecase") || f.includes("service"),
  );

  let primaryPattern = "Modular Architecture";
  let confidence = 0.7;
  const rationale = [];

  if (hasControllers && hasModels && hasViews) {
    primaryPattern = "MVC (Model-View-Controller)";
    confidence = 0.9;
    rationale.push(
      "Contains separate Model, View, and Controller folder structures and signals",
    );
  } else if (hasDomain || (hasBiz && hasDb && hasControllers)) {
    primaryPattern = "Clean / Layered Architecture";
    confidence = 0.88;
    rationale.push(
      "Separates Domain / Business Logic from API routes and Database models",
    );
  } else if (hasUi && (hasApi || hasDb)) {
    primaryPattern = "Fullstack Application";
    confidence = 0.85;
    rationale.push(
      "Integrates frontend UI components alongside backend API/Database layers",
    );
  } else if (hasUi && !hasApi && !hasDb) {
    primaryPattern = "Component-Driven Frontend";
    confidence = 0.85;
    rationale.push(
      "Dominated by UI component hierarchy and frontend state management",
    );
  } else if (hasApi || hasControllers) {
    primaryPattern = "API Service / REST API";
    confidence = 0.85;
    rationale.push(
      "Focused primarily on HTTP/gRPC endpoint controllers and API handlers",
    );
  } else {
    rationale.push("General software project structure");
  }

  return {
    primaryPattern,
    confidence,
    rationale,
  };
};

/**
 * Step 6: Multi-Evidence ArchitectureClassifier
 * Infers file roles, architectural layers, directory coherence, and top-level design patterns
 * by combining code signals, path intent, dependency context, and language extensions.
 */
export const classifyArchitecture = (
  signalsInput,
  sampledFilePaths = [],
  extraContext = {},
) => {
  const fileSignals = normalizeSignals(signalsInput);
  const fileRoles = {};
  const fileDetails = {};
  const layerDistribution = {};

  const pathMap = {};
  sampledFilePaths.forEach((fp) => {
    pathMap[path.basename(fp)] = fp;
  });

  const processedFiles = new Set();
  for (const [fileName, signals] of Object.entries(fileSignals)) {
    const fullPath = pathMap[fileName] || fileName;
    const classified = classifyFile(fileName, signals, fullPath);
    fileRoles[fileName] = classified.role;
    fileDetails[fileName] = classified;
    layerDistribution[classified.role] =
      (layerDistribution[classified.role] || 0) + 1;
    processedFiles.add(fileName);
  }

  sampledFilePaths.forEach((fullPath) => {
    const fileName = path.basename(fullPath);
    if (!processedFiles.has(fileName)) {
      const classified = classifyFile(fileName, [], fullPath);
      fileRoles[fileName] = classified.role;
      fileDetails[fileName] = classified;
      layerDistribution[classified.role] =
        (layerDistribution[classified.role] || 0) + 1;
    }
  });

  // Evaluate Folder Coherence
  const folderStats = {};
  sampledFilePaths.forEach((fullPath) => {
    const fileName = path.basename(fullPath);
    const parentFolder =
      path.dirname(fullPath).split(/[\/\\]/).pop() || "root";
    const role = fileRoles[fileName];
    if (!role) return;

    if (!folderStats[parentFolder]) {
      folderStats[parentFolder] = { types: {}, total: 0 };
    }
    const simplifiedRole = role.startsWith("Mixed") ? "Mixed" : role;
    folderStats[parentFolder].types[simplifiedRole] =
      (folderStats[parentFolder].types[simplifiedRole] || 0) + 1;
    folderStats[parentFolder].total++;
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

  // Infer repository-level architectural pattern
  const patternInference = inferArchitecturalPattern(
    layerDistribution,
    folderStructureIntent,
    extraContext,
  );

  const repositoryArchitectureSummary = {
    primaryPattern: patternInference.primaryPattern,
    confidence: patternInference.confidence,
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
