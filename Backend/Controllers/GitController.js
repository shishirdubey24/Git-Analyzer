//import { Url } from "url";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import util from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execPromise = util.promisify(exec);
export const Gitclone = async (req, res) => {
  let { repoUrl } = req.body;

  // Check if url exist or not
  if (!repoUrl) {
    return res.status(400).json({ error: "Repo Url is missing" });
  }
  // remove the white spaces from url
  repoUrl = repoUrl.trim();

  //Check for domain and protocol
  // if (!repoUrl.includes("github.com")) {
  //  repoUrl = `htpps://github.com/${repoUrl}`;
  //}
  if (!repoUrl.startsWith("http")) {
    repoUrl = `https://${repoUrl}`;
  }

  //extract the pathname
  try {
    const data = new URL(repoUrl);
    const repoPath = data.pathname;
    console.log("repo path is", repoPath);
    //Build the full url
    const fullUrl = `https://github.com${repoPath}`;

    // Now we need to clone the git repo.
    const uniqueID = Date.now();
    const repoName = repoPath.split("/").pop();
    const LocalPath = path.join(
      __dirname,
      "..",
      "temp",
      `${uniqueID}-${repoName}`,
    );
    console.log("Cloning from:", fullUrl);
    console.log("the local repo is", LocalPath);

    await execPromise(`git clone --depth 1 ${fullUrl} ${LocalPath}`);
    //send a response back to the client at current for testing pusrp[ose]

    res.status(200).json({
      Success: "True",
      receivedURL: req.body,
      ProcessedURL: fullUrl,
      LocalPath: LocalPath,
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid URL provided" });
    console.log(error);
  }
};
