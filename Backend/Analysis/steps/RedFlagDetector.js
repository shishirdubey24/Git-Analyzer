export const detectRedFlags = (structure, signals, folderIntent) => {
  const flags = [];

  //  SECURITY CHECKS (Structure-based)

  const flatten = (nodes) => {
    let list = [];
    for (const node of nodes) {
      list.push(node);
      if (node.children) list = list.concat(flatten(node.children));
    }
    return list;
  };
  const allFiles = flatten(structure.tree);

  const riskFiles = [".env", "id_rsa", ".pem", "credentials.json"];
  allFiles.forEach((file) => {
    if (riskFiles.includes(file.name.toLowerCase())) {
      flags.push({
        severity: "CRITICAL",
        message: `Security Risk: Committed sensitive file (${file.name})`,
      });
    }
  });

  //  CODE QUALITY CHECKS (Signal-based)

  Object.entries(signals).forEach(([file, list]) => {
    if (list.includes("Hardcoded Secrets")) {
      flags.push({
        severity: "HIGH",
        message: `Security Risk: Hardcoded secrets detected in ${file}`,
      });
    }

    // Check for excessive console logs (if we tracked count, logic would be here.

    if (list.includes("Console Log")) {
      flags.push({
        severity: "LOW",
        message: `Cleanup: Console logs left in production code (${file})`,
      });
    }
  });

  //  ARCHITECTURE CHECKS (Folder-based)

  Object.entries(folderIntent).forEach(([folder, stats]) => {
    if (parseFloat(stats.coherence) < 0.4) {
      flags.push({
        severity: "MEDIUM",
        message: `Architecture: '${folder}' folder is messy (Low Coherence). Splits concerns too much.`,
      });
    }
  });

  return flags;
};
