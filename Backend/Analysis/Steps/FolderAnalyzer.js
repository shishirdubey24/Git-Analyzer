import path from "path";

export const analyzeFolderCoherence = (fileRoles, sampledFilePaths) => {
  const folderStats = {};

  // 1. Group files by their parent folder
  // Note: We need the full paths from 'sampledFilePaths' to know the folder,
  // but we match them with 'fileRoles' using the filename.

  sampledFilePaths.forEach((fullPath) => {
    const fileName = path.basename(fullPath);
    const parentFolder = path.dirname(fullPath).split(path.sep).pop(); // Get just the folder name (e.g. "components")

    // Skip if we didn't classify this file (e.g. README.md was sampled but had no signals)
    const role = fileRoles[fileName];
    if (!role) return;

    if (!folderStats[parentFolder]) {
      folderStats[parentFolder] = { types: {}, total: 0 };
    }

    // Tally the roles
    // If role is "Mixed (UI + Database)", treat it as "Mixed"
    const simplifiedRole = role.startsWith("Mixed") ? "Mixed" : role;

    folderStats[parentFolder].types[simplifiedRole] =
      (folderStats[parentFolder].types[simplifiedRole] || 0) + 1;
    folderStats[parentFolder].total++;
  });

  // 2. Calculate Coherence (How "focused" is this folder?)
  const folderIntent = {};

  for (const [folder, stats] of Object.entries(folderStats)) {
    let dominantType = "None";
    let maxCount = 0;

    for (const [type, count] of Object.entries(stats.types)) {
      if (count > maxCount) {
        maxCount = count;
        dominantType = type;
      }
    }

    const coherenceScore = (maxCount / stats.total).toFixed(2); // 1.00 = Perfect, 0.50 = Messy

    folderIntent[folder] = {
      dominantType: dominantType,
      coherence: coherenceScore, // 1.0 means the folder does ONE thing.
      filesAnalyzed: stats.total,
    };
  }

  return folderIntent;
};
