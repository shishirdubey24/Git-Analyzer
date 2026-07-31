/**
 * SignalRules.js
 * Multi-language regex rules for code implementation signal detection.
 * Strictly focused on code constructs and usage patterns (no framework imports).
 */

export const SIGNAL_PATTERNS = {
  // --- UI & FRONTEND ---
  useState: /useState\s*\(/g,
  useEffect: /useEffect\s*\(/g,
  Redux: /(useSelector|useDispatch|createStore|configureStore)/g,
  "Vue Composition": /(ref\(|reactive\(|computed\(|defineComponent)/g,
  "Angular Component": /@Component\s*\(/g,
  Tailwind: /(className=["'].*["']|@apply\s+)/g,

  // --- API & ROUTING ---
  "Express / NestJS Route": /(router\.(get|post|put|delete|patch)|app\.(get|post|put|delete|patch)|@(Get|Post|Put|Delete|Patch|All)\s*\()/g,
  "Python API Route": /@([a-zA-Z0-9_]+\.)?(get|post|put|delete|patch|route)\s*\(/g,
  "Django View": /(def\s+(get|post|put|delete)\s*\(self,\s*request|class\s+\w+\((APIView|View|ViewSet)\))/g,
  "Spring Controller Route": /@(Get|Post|Put|Delete|Request)Mapping|@RestController|@Controller/g,
  "Go Route": /\.(GET|POST|PUT|DELETE|Handle|HandleFunc|Group)\s*\(/g,
  "Rust Actix Route": /#\[(get|post|put|delete|route)\s*\(.*\)\]/g,
  "PHP Route": /Route::(get|post|put|delete|match|resource)\s*\(/g,
  "Ruby Rails Route": /(get|post|put|delete|resources)\s+:[a-zA-Z0-9_]+/g,
  "C# Controller Route": /\[(HttpGet|HttpPost|HttpPut|HttpDelete|Route)\s*\(?.*\)\]/g,

  // --- DATABASE & DATA ---
  "Mongoose Schema": /(new\s+Schema\s*\(|mongoose\.model\s*\()/g,
  "Django Model": /models\.(CharField|IntegerField|ForeignKey|DateTimeField|Model|OneToOneField)/g,
  "SQLAlchemy Model": /(Column\(|declarative_base\(\)|relationship\()/g,
  "Spring Entity": /@Entity|@Table|@Id|@Column/g,
  "Go GORM Model": /(gorm\.Model|gorm:"[^"]+")/g,
  "SQL Query": /\b(SELECT\s+.+FROM|INSERT\s+INTO|UPDATE\s+.+SET|DELETE\s+FROM)\b/gi,
  "Prisma Query": /prisma\.[a-zA-Z]+\.(findMany|findUnique|create|update|delete)/g,
  "Entity Framework C#": /(DbSet<|DbContext|\[Table\(")/g,

  // --- AUTHENTICATION & SECURITY ---
  Authentication: /(passport\.authenticate|bcrypt\.compare|jwt\.sign|jwt\.verify|flask_login|SecurityContextHolder|Authorize|Authenticate)/g,
  "Hardcoded Secrets": /(api_key|secret|password|private_key)\s*[:=]\s*['"][^'"]{6,}['"]/gi,

  // --- LOGGING & CODE QUALITY ---
  "Console Log": /console\.(log|info|warn|error)\s*\(/g,
  "Python Print": /\bprint\s*\(/g,
  "Java System Output": /System\.out\.print(ln)?\s*\(/g,
  "Go Print": /fmt\.(Print|Println|Printf)\s*\(/g,
  TODO: /(\/\/\s*TODO|\#\s*TODO|\/\*\s*TODO)/g,
};

export const SIGNAL_CATEGORIES = {
  useState: "UI",
  useEffect: "UI",
  Redux: "State Management",
  "Vue Composition": "UI",
  "Angular Component": "UI",
  Tailwind: "UI",

  "Express / NestJS Route": "API Logic",
  "Python API Route": "API Logic",
  "Django View": "API Logic",
  "Spring Controller Route": "API Logic",
  "Go Route": "API Logic",
  "Rust Actix Route": "API Logic",
  "PHP Route": "API Logic",
  "Ruby Rails Route": "API Logic",
  "C# Controller Route": "API Logic",

  "Mongoose Schema": "Database",
  "Django Model": "Database",
  "SQLAlchemy Model": "Database",
  "Spring Entity": "Database",
  "Go GORM Model": "Database",
  "SQL Query": "Database",
  "Prisma Query": "Database",
  "Entity Framework C#": "Database",

  Authentication: "Security",
  "Console Log": "Debug",
  "Python Print": "Debug",
  "Java System Output": "Debug",
  "Go Print": "Debug",
  "Hardcoded Secrets": "Risk",
  TODO: "Maintenance",
};

export const SIGNAL_METADATA = {
  useState: { framework: "React", weight: 0.85 },
  useEffect: { framework: "React", weight: 0.85 },
  Redux: { framework: "React", weight: 0.80 },
  "Vue Composition": { framework: "Vue.js", weight: 0.85 },
  "Angular Component": { framework: "Angular", weight: 0.85 },
  Tailwind: { framework: "Tailwind CSS", weight: 0.75 },

  "Express / NestJS Route": { framework: "Express", weight: 0.85 },
  "Python API Route": { framework: "FastAPI", weight: 0.85 },
  "Django View": { framework: "Django", weight: 0.85 },
  "Spring Controller Route": { framework: "Spring Boot", weight: 0.85 },
  "Go Route": { framework: "Gin", weight: 0.85 },
  "Rust Actix Route": { framework: "Actix Web", weight: 0.85 },
  "PHP Route": { framework: "Laravel", weight: 0.85 },
  "Ruby Rails Route": { framework: "Ruby on Rails", weight: 0.85 },
  "C# Controller Route": { framework: "ASP.NET", weight: 0.85 },

  "Mongoose Schema": { framework: "MongoDB / Mongoose", weight: 0.85 },
  "Django Model": { framework: "Django", weight: 0.85 },
  "SQLAlchemy Model": { framework: "SQLAlchemy", weight: 0.85 },
  "Spring Entity": { framework: "Hibernate", weight: 0.85 },
  "Go GORM Model": { framework: "GORM", weight: 0.85 },
  "SQL Query": { weight: 0.75 },
  "Prisma Query": { framework: "Prisma", weight: 0.85 },
  "Entity Framework C#": { framework: "Entity Framework", weight: 0.85 },

  Authentication: { weight: 0.80 },
  "Hardcoded Secrets": { weight: 0.90 },
  "Console Log": { weight: 0.60 },
  "Python Print": { weight: 0.60 },
  "Java System Output": { weight: 0.60 },
  "Go Print": { weight: 0.60 },
  TODO: { weight: 0.50 },
};
