/**
 * SignalRules.js
 * Multi-language regex rules for code signal detection.
 */

export const SIGNAL_PATTERNS = {
  // --- UI & FRONTEND ---
  useState: /useState\s*\(/g,
  useEffect: /useEffect\s*\(/g,
  "React Import": /import\s+.*from\s+['"]react['"]/g,
  Redux: /(useSelector|useDispatch|createStore|configureStore)/g,
  "Vue Composition": /(ref\(|reactive\(|computed\(|defineComponent)/g,
  "Angular Component": /@Component\s*\(/g,
  Tailwind: /(className=["'].*["']|@apply\s+)/g,

  // --- API & ROUTING ---
  "Express Route": /(router\.(get|post|put|delete|patch)|app\.(get|post|put|delete|patch))\s*\(/g,
  "Express Import": /require\(['"]express['"]\)|import\s+.*from\s+['"]express['"]/g,
  "Python API Route": /@(app|router|api_view)\.(get|post|put|delete|patch|route)\s*\(/g,
  "FastAPI/Flask Import": /(from\s+fastapi\s+import|from\s+flask\s+import|import\s+fastapi|import\s+flask)/g,
  "Django View": /(def\s+(get|post|put|delete)\s*\(self,\s*request|class\s+\w+\((APIView|View|ViewSet)\))/g,
  "Spring Controller Route": /@(Get|Post|Put|Delete|Request)Mapping|@RestController|@Controller/g,
  "Go Route": /\.(GET|POST|PUT|DELETE|Handle|HandleFunc|Group)\s*\(/g,
  "Gin/Echo Import": /(github\.com\/gin-gonic\/gin|labstack\/echo|gofiber\/fiber)/g,
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
  "React Import": "UI",
  Redux: "State Management",
  "Vue Composition": "UI",
  "Angular Component": "UI",
  Tailwind: "UI",

  "Express Route": "API Logic",
  "Express Import": "API Logic",
  "Python API Route": "API Logic",
  "FastAPI/Flask Import": "API Logic",
  "Django View": "API Logic",
  "Spring Controller Route": "API Logic",
  "Go Route": "API Logic",
  "Gin/Echo Import": "API Logic",
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
  "Express Import": { isImport: true, framework: "Express", weight: 0.9 },
  "FastAPI/Flask Import": { isImport: true, framework: "FastAPI / Flask", weight: 0.9 },
  "Gin/Echo Import": { isImport: true, framework: "Gin / Echo", weight: 0.9 },
  "React Import": { isImport: true, framework: "React", weight: 0.9 },
  "Express Route": { isImport: false, weight: 0.85 },
  "Python API Route": { isImport: false, weight: 0.85 },
  "Django View": { isImport: false, weight: 0.85 },
  "Spring Controller Route": { isImport: false, weight: 0.85 },
  "Go Route": { isImport: false, weight: 0.85 },
  "Mongoose Schema": { isImport: false, weight: 0.85 },
  "Django Model": { isImport: false, weight: 0.85 },
  "SQLAlchemy Model": { isImport: false, weight: 0.85 },
  "Spring Entity": { isImport: false, weight: 0.85 },
};

