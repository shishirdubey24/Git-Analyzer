import { exec } from "child_process";
import util from "util";
import fs from "fs";
import { analyzeRepo } from "../Analysis/Orchestrator.js";
import { scheduleCleanup } from "../Utils/FileCleanup.js";

const execPromise = util.promisify(exec);

export const Gitclone = async (req, res) => {
  const { fullUrl, localPath, tempDir } = req.repoContext;

  console.log(` [Controller] Processing: ${fullUrl}`);

  try {
    //Check conditions
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    if (fs.existsSync(localPath)) {
      console.log(`[Cache Hit] Using existing repo.`);
    } else {
      console.log(`[Cache Miss] Cloning new repo...`);

      try {
        //Cloning from Git
        await execPromise(`git clone --depth 1 ${fullUrl} "${localPath}"`);
      } catch (cloneError) {
        //Handle all Error types
        const msg = cloneError.message.toLowerCase();

        const isRaceCondition =
          msg.includes("already exists") ||
          msg.includes("file exists") ||
          msg.includes("destination path");

        if (!isRaceCondition) {
          throw cloneError;
        }
        console.log(
          " Race Condition ignored: Folder exists now. Proceeding...",
        );
      }
    }

    const analysisResult = await analyzeRepo(localPath);

    res.status(200).json({
      Success: "True",
      Analysis: analysisResult,
    });
  } catch (error) {
    console.error("CRITICAL ERROR:", error.message);
    res.status(500).json({ error: "Analysis Failed", details: error.message });
  } finally {
    scheduleCleanup(localPath);
  }
};
