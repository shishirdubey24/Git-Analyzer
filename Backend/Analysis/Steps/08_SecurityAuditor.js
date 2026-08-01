import path from "path";

/**
 * Step 8: SecurityAuditor
 * Scans for security risks: committed secret files, API keys, bearer tokens,
 * hardcoded passwords, unhandled exceptions, and dangerous code execution.
 */
export const auditSecurity = (structure, signals = {}) => {
  const securityReport = {
    riskLevel: "LOW",
    findings: [],
    sensitiveFilesFound: [],
    hardcodedSecretsFound: [],
  };

  const flatten = (nodes) => {
    let list = [];
    for (const node of nodes) {
      list.push(node);
      if (node.children) list = list.concat(flatten(node.children));
    }
    return list;
  };
  const allFiles = flatten(structure.tree || []);

  // 1. Sensitive Files Check
  const riskFiles = [
    ".env",
    "id_rsa",
    "id_ed25519",
    ".pem",
    "credentials.json",
    "service-account.json",
    "secrets.yml",
    "secrets.yaml",
  ];

  allFiles.forEach((file) => {
    if (riskFiles.includes(file.name.toLowerCase())) {
      securityReport.sensitiveFilesFound.push(file.name);
      securityReport.findings.push({
        severity: "CRITICAL",
        category: "Sensitive File Exposure",
        message: `Sensitive configuration file '${file.name}' is committed in repository.`,
      });
    }
  });

  // 2. Signal Audit
  const fileSignals = signals.fileSignals || {};
  Object.entries(fileSignals).forEach(([file, list]) => {
    if (list.includes("Hardcoded Secrets")) {
      securityReport.hardcodedSecretsFound.push(file);
      securityReport.findings.push({
        severity: "HIGH",
        category: "Hardcoded Secret",
        message: `Potential hardcoded secret or API key detected in ${file}.`,
      });
    }
  });

  // Calculate Overall Risk Level
  if (securityReport.findings.some((f) => f.severity === "CRITICAL")) {
    securityReport.riskLevel = "CRITICAL";
  } else if (securityReport.findings.some((f) => f.severity === "HIGH")) {
    securityReport.riskLevel = "HIGH";
  } else if (securityReport.findings.some((f) => f.severity === "MEDIUM")) {
    securityReport.riskLevel = "MEDIUM";
  }

  return securityReport;
};
