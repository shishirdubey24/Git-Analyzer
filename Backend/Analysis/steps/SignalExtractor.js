import fs from "fs/promises";

// Patterns to look for in the code
const PATTERNS = {
  useState: /useState\s*\(/g,
  useEffect: /useEffect\s*\(/g,
  Redux: /useSelector|useDispatch|createStore/g,
  Tailwind: /className=".*wait.*"/g,

  "Express Route": /router\.(get|post|put|delete)\s*\(/g,
  "Mongoose Schema": /new\s+Schema\s*\(/g,
  "SQL Query": /SELECT\s+.*\s+FROM/gi,
  Authentication: /passport\.authenticate|bcrypt\.compare|jwt\.sign/g,

  "Console Log": /console\.log\s*\(/g,
  TODO: /\/\/\s*TODO/g,
  "Hardcoded Secrets": /(api_key|secret|password)\s*[:=]\s*['"][^'"]+['"]/gi,
};

export const extractSignals = async (filePaths) => {
  const signals = {};

  for (const filePath of filePaths) {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const fileSignals = [];

      for (const [key, regex] of Object.entries(PATTERNS)) {
        if (regex.test(content)) {
          fileSignals.push(key);
        }
      }

      if (fileSignals.length > 0) {
        const fileName = filePath.split(/[/\\]/).pop();
        signals[fileName] = fileSignals;
      }
    } catch (error) {
      console.error(`Failed to read ${filePath}: ${error.message}`);
    }
  }

  return signals;
};
