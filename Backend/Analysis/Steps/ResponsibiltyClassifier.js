// Map raw signals to high-level architectural concerns
const SIGNAL_CATEGORIES = {
  // UI
  useState: "UI",
  useEffect: "UI",
  Tailwind: "UI",
  JSX: "UI",

  // State / Data
  Redux: "State Management",
  "Mongoose Schema": "Database",
  "SQL Query": "Database",

  // Logic / API
  "Express Route": "API Logic",
  Authentication: "Security",

  // Generic
  "Console Log": "Debug",
  "Hardcoded Secrets": "Risk",
};

export const classifyResponsibility = (fileSignals) => {
  const fileRoles = {};

  for (const [fileName, signals] of Object.entries(fileSignals)) {
    const categories = new Set();

    signals.forEach((sig) => {
      const cat = SIGNAL_CATEGORIES[sig];
      if (cat && cat !== "Debug" && cat !== "Risk") categories.add(cat);
    });

    if (categories.size === 0) {
      // If no signals found, look at the file extension
      if (fileName.match(/\.(js|ts|py|go|java)$/)) {
        fileRoles[fileName] = "Logic / Utility";
      } else if (fileName.match(/\.(css|scss|less)$/)) {
        fileRoles[fileName] = "Styling";
      } else {
        fileRoles[fileName] = "Config / Static";
      }
    } else if (categories.size === 1) {
      fileRoles[fileName] = [...categories][0];
    } else {
      const cats = [...categories].join(" + ");
      fileRoles[fileName] = `Mixed (${cats})`;
    }
  }

  return fileRoles;
};
