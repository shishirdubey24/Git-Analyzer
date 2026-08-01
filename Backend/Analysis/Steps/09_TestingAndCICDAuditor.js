import path from "path";

/**
 * Step 9: TestingAndCICDAuditor
 * Detects unit/integration test suites, test file counts, test frameworks,
 * Docker containers, and CI/CD pipelines (GitHub Actions, GitLab CI).
 */
export const auditTestingAndCICD = (structure, context = {}) => {
  const report = {
    hasTests: false,
    testFiles: [],
    testFrameworksDetected: [],
    hasCICD: false,
    cicdTools: [],
    hasDocker: false,
    testCoverageStatus: "Needs Improvement",
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

  allFiles.forEach((file) => {
    const lowerName = file.name.toLowerCase();
    const fullPathLower = (file.path || "").toLowerCase();

    // Test File Detection (.test.js, .spec.js, test_*.py, *_test.go, *Test.java)
    if (
      lowerName.includes("test") ||
      lowerName.includes("spec") ||
      fullPathLower.includes("/tests/") ||
      fullPathLower.includes("/__tests__/")
    ) {
      report.testFiles.push(file.name);
    }

    // CI/CD Detection (.github/workflows, .gitlab-ci.yml, Jenkinsfile)
    if (
      fullPathLower.includes(".github/workflows") ||
      lowerName === ".gitlab-ci.yml" ||
      lowerName === "jenkinsfile"
    ) {
      report.hasCICD = true;
      if (!report.cicdTools.includes("GitHub Actions / CI")) {
        report.cicdTools.push("GitHub Actions / CI");
      }
    }

    // Docker Detection
    if (lowerName === "dockerfile" || lowerName.startsWith("docker-compose")) {
      report.hasDocker = true;
      if (!report.cicdTools.includes("Docker")) {
        report.cicdTools.push("Docker Containerization");
      }
    }
  });

  report.hasTests = report.testFiles.length > 0;
  if (report.testFiles.length > 10) {
    report.testCoverageStatus = "Extensive Test Suite";
  } else if (report.testFiles.length > 0) {
    report.testCoverageStatus = "Basic Test Suite Present";
  } else {
    report.testCoverageStatus = "No Test Suite Detected";
  }

  return report;
};
