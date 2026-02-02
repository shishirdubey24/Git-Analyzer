import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const validateAndPrepare = (req, res, next) => {
  try {
    let { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL is missing" });
    }

    // 1. Clean Input
    let cleanUrl = repoUrl.trim().replace(/['"]+/g, "").replace(/\/$/, "");

    // 2. Protocol Fix
    if (!cleanUrl.startsWith("http")) {
      cleanUrl = cleanUrl.includes("github.com")
        ? `https://${cleanUrl}`
        : `https://github.com/${cleanUrl}`;
    }

    // 3. Validation
    const urlObj = new URL(cleanUrl);
    if (!urlObj.hostname.includes("github.com")) {
      return res
        .status(400)
        .json({ error: "Only GitHub repositories are supported." });
    }

    // 4. Path Calculation
    const fullUrl = urlObj.href;
    const repoPath = urlObj.pathname;
    const folderName = repoPath.replace(/^\//, "").replace(/\//g, "-");

    // Resolve the full path for the temp directory
    const tempDir = path.join(__dirname, "..", "temp");
    const localPath = path.join(tempDir, folderName);

    // 5. Attach to Request Object (So Controller can use it)
    req.repoContext = {
      fullUrl,
      folderName,
      localPath,
      tempDir,
    };

    next(); // Pass control to the Controller
  } catch (error) {
    console.error("[Middleware Error]", error.message);
    return res.status(400).json({ error: "Invalid URL provided" });
  }
};
