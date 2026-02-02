import fs from "fs";
import path from "path";

export const scheduleCleanup = (folderPath, delayMs = 30000) => {
  // Don't block the main thread, just set the timer
  setTimeout(() => {
    if (fs.existsSync(folderPath)) {
      console.log(`[Cleanup] Deleting: ${path.basename(folderPath)}`);

      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          // Ignore "Resource Busy" errors (common in Windows dev)
          if (err.code !== "EBUSY" && err.code !== "EPERM") {
            console.error(
              `[Cleanup Warn] Could not delete ${folderPath}:`,
              err.message,
            );
          }
        }
      });
    }
  }, delayMs);
};
