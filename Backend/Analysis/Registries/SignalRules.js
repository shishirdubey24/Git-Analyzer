/**
 * SignalRules.js
 * Multi-language regex rules for code signal detection.
 */

export const SIGNAL_PATTERNS = {
  // --- UI & FRONTEND ---
  useState: /useState\s*\(/g,
  useEffect: /useEffect\s*\(/g,
  Redux: /useSelector|useDispatch|createStore/g,
  "Vue Composition": /ref\(|reactive\(|computed\(/g,
  "Angular Component": /@Component\s*\(/g,
  Tailwind: /className=["'].*["']/g,

  // --- API & ROUTING ---
  "Express Route": /router\.(get|post|put|delete|patch)\s*\(/g,
  "Python API Route": /@(app|router)\.(get|post|put|delete|patch)\s*\(/g,
  "Django View": /def\s+(get|post|put|delete)\s*\(self,\s*request/g,
  "Spring Controller Route": /@(Get|Post|Put|Delete|Request)Mapping\s*\(/g,
  "Go Route": /\.(GET|POST|PUT|DELETE|Handle|HandleFunc)\s*\(/g,
  "Rust Actix Route": /#\[(get|post|put|delete)\s*\(.*\)\]/g,
  "PHP Route": /Route::(get|post|put|delete)\s*\(/g,

  // --- DATABASE & DATA ---
  "Mongoose Schema": /new\s+Schema\s*\(/g,
  "Django Model": /models\.(CharField|IntegerField|ForeignKey|DateTimeField|Model)/g,
  "SQLAlchemy Model": /Column\(|declarative_base\(\)/g,
  "Spring Entity": /@Entity|@Table/g,
  "Go GORM Model": /gorm\.Model/g,
  "SQL Query": /\b(SELECT|INSERT INTO|UPDATE|DELETE FROM)\b/gi,
  "Prisma Query": /prisma\.[a-zA-Z]+\.(findMany|findUnique|create|update)/g,

  // --- AUTHENTICATION & SECURITY ---
  Authentication: /passport\.authenticate|bcrypt\.compare|jwt\.sign|jwt\.verify|flask_login|SecurityContextHolder/g,
  "Hardcoded Secrets": /(api_key|secret|password|private_key)\s*[:=]\s*['"][^'"]{6,}['"]/gi,

  // --- LOGGING & CODE QUALITY ---
  "Console Log": /console\.log\s*\(/g,
  "Python Print": /\bprint\s*\(/g,
  "Java System Output": /System\.out\.print(ln)?\s*\(/g,
  "Go Print": /fmt\.Print(ln|f)?\s*\(/g,
  TODO: /\/\/\s*TODO|\#\s*TODO|\/\*\s*TODO/g,
};

export const SIGNAL_CATEGORIES = {
  useState: "UI",
  useEffect: "UI",
  Redux: "State Management",
  "Vue Composition": "UI",
  "Angular Component": "UI",
  Tailwind: "UI",

  "Express Route": "API Logic",
  "Python API Route": "API Logic",
  "Django View": "API Logic",
  "Spring Controller Route": "API Logic",
  "Go Route": "API Logic",
  "Rust Actix Route": "API Logic",
  "PHP Route": "API Logic",

  "Mongoose Schema": "Database",
  "Django Model": "Database",
  "SQLAlchemy Model": "Database",
  "Spring Entity": "Database",
  "Go GORM Model": "Database",
  "SQL Query": "Database",
  "Prisma Query": "Database",

  Authentication: "Security",
  "Console Log": "Debug",
  "Python Print": "Debug",
  "Java System Output": "Debug",
  "Go Print": "Debug",
  "Hardcoded Secrets": "Risk",
  TODO: "Maintenance",
};
