import { exec } from "child_process";
import util from "util";
import fs from "fs";
import { analyzeRepo } from "../Analysis/Orchestrator.js";
import { scheduleCleanup } from "../Utils/FileCleanup.js";

const execPromise = util.promisify(exec);

export const Gitclone = async (req, res) => {
  // 1. Get prepared data from Middleware
  const { fullUrl, localPath, tempDir } = req.repoContext;

  console.log(`>>> [Controller] Processing: ${fullUrl}`);

  try {
    // 2. Ensure Temp Directory Exists
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // 3. Clone Logic (With Robust Race Condition Handling)
    if (fs.existsSync(localPath)) {
      console.log(`[Cache Hit] Using existing repo.`);
    } else {
      console.log(`[Cache Miss] Cloning new repo...`);
      try {
        await execPromise(`git clone --depth 1 ${fullUrl} "${localPath}"`);
      } catch (cloneError) {
        // --- THE FIX ---
        // Normalize error to lowercase and check for ALL variations of "Folder Exists"
        const msg = cloneError.message.toLowerCase();

        const isRaceCondition =
          msg.includes("already exists") ||
          msg.includes("file exists") || // <--- Handles your specific error
          msg.includes("destination path");

        if (!isRaceCondition) {
          throw cloneError; // It's a real error (e.g. GitHub down), so crash.
        }
        console.log(
          "⚠️ Race Condition ignored: Folder exists now. Proceeding...",
        );
      }
    }

    // 4. Run Analysis
    const analysisResult = await analyzeRepo(localPath);

    // 5. Send Success Response
    res.status(200).json({
      Success: "True",
      Analysis: analysisResult,
    });
  } catch (error) {
    console.error("CRITICAL ERROR:", error.message);
    res.status(500).json({ error: "Analysis Failed", details: error.message });
  } finally {
    // 6. Trigger Cleanup
    scheduleCleanup(localPath);
  }
};
