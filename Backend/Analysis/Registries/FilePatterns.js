/**
 * FilePatterns.js
 * Entry points, ignored directories, and critical files registry.
 */

export const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vscode",
  ".next",
  ".idea",
  "__pycache__",
  "venv",
  ".venv",
  "env",
  "target",
  "vendor",
  "bin",
  "obj",
]);

export const ENTRY_POINT_CANDIDATES = new Set([
  // Node / Web
  "index.js",
  "main.js",
  "server.js",
  "app.js",
  "index.jsx",
  "main.jsx",
  "app.jsx",
  "index.ts",
  "main.ts",
  "app.ts",
  "index.tsx",
  "main.tsx",
  "app.tsx",
  "layout.js",
  "layout.tsx",
  "page.js",
  "page.tsx",
  "index.html",

  // Python
  "main.py",
  "app.py",
  "manage.py",
  "wsgi.py",
  "asgi.py",
  "run.py",

  // Go
  "main.go",

  // Rust
  "main.rs",
  "lib.rs",

  // Java / Kotlin
  "application.java",
  "main.java",
  "application.kt",

  // PHP
  "index.php",
  "server.php",

  // Ruby
  "config.ru",
  "application.rb",

  // C#
  "program.cs",
  "startup.cs",
]);

export const CRITICAL_FILES = new Set([
  "package.json",
  "tsconfig.json",
  "requirements.txt",
  "pyproject.toml",
  "pipfile",
  "pom.xml",
  "build.gradle",
  "go.mod",
  "cargo.toml",
  "composer.json",
  "gemfile",
  "dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  ".env.example",
  "readme.md",
  ".gitignore",
]);

export const COMMON_SOURCE_DIRS = [
  "src",
  "app",
  "lib",
  "source",
  "controllers",
  "routes",
  "views",
  "models",
  "api",
  "components",
  "pages",
  "utils",
  "services",
  "hooks",
  "cmd",
  "pkg",
  "internal",
  "blueprints",
  "schemas",
  "entities",
  "domain",
  "repository",
  "repositories",
  "handlers",
  "middleware",
  "modules",
  "packages",
  "crates",
];

export const GENERATED_OR_VENDOR_PATTERNS = [
  /\.min\.(js|css)$/i,
  /\.bundle\.(js|css)$/i,
  /\.g\.(dart|go|ts|js)$/i,
  /_pb2?\.py$/i,
  /_pb\.go$/i,
  /\.generated\./i,
  /\bdist[\/\\]/i,
  /\bbuild[\/\\]/i,
  /\bvendor[\/\\]/i,
  /\b\.next[\/\\]/i,
  /\btarget[\/\\]/i,
  /\b__pycache__[\/\\]/i,
  /package-lock\.json$/i,
  /yarn\.lock$/i,
  /pnpm-lock\.yaml$/i,
  /Cargo\.lock$/i,
  /Composer\.lock$/i,
];

export const TEST_FILE_PATTERNS = [
  /\.(test|spec)\.[a-z0-9]+$/i,
  /_test\.go$/i,
  /test_[a-z0-9_]+\.py$/i,
  /[a-z0-9_]+_test\.py$/i,
  /Test[A-Z][a-zA-Z0-9]*\.java$/i,
  /Spec\.[a-z0-9]+$/i,
  /[\/\\](__tests__|tests|test|spec|specs|fixtures|mocks)[\/\\]/i,
];

export const FOLDER_INTENT_MAP = {
  controllers: "API Logic",
  routes: "API Logic",
  api: "API Logic",
  handlers: "API Logic",
  endpoints: "API Logic",
  views: "UI",
  components: "UI",
  pages: "UI",
  ui: "UI",
  styles: "Styling",
  css: "Styling",
  models: "Database",
  entities: "Database",
  schemas: "Database",
  repository: "Database",
  repositories: "Database",
  db: "Database",
  database: "Database",
  services: "Business Logic",
  domain: "Business Logic",
  usecases: "Business Logic",
  core: "Business Logic",
  middleware: "Security / Middleware",
  auth: "Security",
  security: "Security",
  utils: "Utility",
  helpers: "Utility",
  common: "Utility",
  config: "Config",
  configs: "Config",
  settings: "Config",
};

export const FILENAME_ROLE_PATTERNS = [
  { pattern: /Controller/i, role: "API Logic" },
  { pattern: /Handler/i, role: "API Logic" },
  { pattern: /Route/i, role: "API Logic" },
  { pattern: /Endpoint/i, role: "API Logic" },
  { pattern: /Resolver/i, role: "API Logic" },
  { pattern: /Service/i, role: "Business Logic" },
  { pattern: /UseCase/i, role: "Business Logic" },
  { pattern: /Manager/i, role: "Business Logic" },
  { pattern: /Provider/i, role: "Business Logic" },
  { pattern: /Interactor/i, role: "Business Logic" },
  { pattern: /Repository/i, role: "Database" },
  { pattern: /Entity/i, role: "Database" },
  { pattern: /Model/i, role: "Database" },
  { pattern: /Schema/i, role: "Database" },
  { pattern: /Dao/i, role: "Database" },
  { pattern: /Component/i, role: "UI" },
  { pattern: /View/i, role: "UI" },
  { pattern: /Page/i, role: "UI" },
  { pattern: /Screen/i, role: "UI" },
  { pattern: /Widget/i, role: "UI" },
  { pattern: /Middleware/i, role: "Security / Middleware" },
  { pattern: /Auth/i, role: "Security" },
  { pattern: /Guard/i, role: "Security" },
  { pattern: /Interceptor/i, role: "Security" },
  { pattern: /Util/i, role: "Utility" },
  { pattern: /Helper/i, role: "Utility" },
  { pattern: /Config/i, role: "Config" },
  { pattern: /Settings/i, role: "Config" },
];

export const ROLE_EVIDENCE_WEIGHTS = {
  signal: 35,
  folder: 30,
  filename: 30,
  extension: 15,
};

export const ARCHITECTURAL_PATTERN_RULES = [
  {
    name: "MVC (Model-View-Controller)",
    evaluators: [
      {
        check: ({ hasControllerFolder, hasApi }) => hasControllerFolder || hasApi,
        weight: 25,
        rationale: "Controller / API route layer present",
      },
      {
        check: ({ hasModelFolder, hasDb }) => hasModelFolder || hasDb,
        weight: 25,
        rationale: "Model / Database layer present",
      },
      {
        check: ({ hasViewFolder, hasUi }) => hasViewFolder || hasUi,
        weight: 25,
        rationale: "View / UI component layer present",
      },
      {
        check: ({ hasApi, hasDb, hasUi }) => hasApi && hasDb && hasUi,
        weight: 25,
        rationale: "Integrated Model, View, and Controller code signals present",
      },
    ],
  },
  {
    name: "Clean / Layered Architecture",
    evaluators: [
      {
        check: ({ hasDomainFolder, hasBiz }) => hasDomainFolder || hasBiz,
        weight: 30,
        rationale: "Domain / Business Logic layer present",
      },
      {
        check: ({ hasModelFolder, hasDb }) => hasModelFolder || hasDb,
        weight: 25,
        rationale: "Repository / Database Entity layer present",
      },
      {
        check: ({ hasControllerFolder, hasApi }) => hasControllerFolder || hasApi,
        weight: 25,
        rationale: "API Controller / Gateway layer present",
      },
      {
        check: ({ hasBiz, hasDb, hasApi }) => hasBiz && hasDb && hasApi,
        weight: 20,
        rationale: "Clear separation between Domain, Persistence, and Presentation layers",
      },
    ],
  },
  {
    name: "Fullstack Application",
    evaluators: [
      {
        check: ({ hasUi }) => hasUi,
        weight: 30,
        rationale: "Frontend UI component signals detected",
      },
      {
        check: ({ hasApi, hasDb }) => hasApi || hasDb,
        weight: 30,
        rationale: "Backend API or Database layer detected",
      },
      {
        check: ({ isFullstackType }) => isFullstackType,
        weight: 25,
        rationale: "Manifest dependencies indicate Fullstack frameworks",
      },
      {
        check: ({ hasUi, hasApi, hasDb }) => hasUi && (hasApi || hasDb),
        weight: 15,
        rationale: "Co-located UI and Server infrastructure",
      },
    ],
  },
  {
    name: "Component-Driven Frontend",
    evaluators: [
      {
        check: ({ hasUi }) => hasUi,
        weight: 40,
        rationale: "Dominated by UI component hierarchy",
      },
      {
        check: ({ isFrontendType }) => isFrontendType,
        weight: 30,
        rationale: "Manifest dependencies indicate Frontend framework",
      },
      {
        check: ({ hasApi, hasDb }) => !hasApi && !hasDb,
        weight: 30,
        rationale: "Absence of backend server & database persistence layers",
      },
    ],
  },
  {
    name: "API Service / REST API",
    evaluators: [
      {
        check: ({ hasApi, hasControllerFolder }) => hasApi || hasControllerFolder,
        weight: 40,
        rationale: "API controllers / HTTP route handlers present",
      },
      {
        check: ({ isBackendType }) => isBackendType,
        weight: 30,
        rationale: "Manifest dependencies indicate Backend web framework",
      },
      {
        check: ({ hasDb }) => hasDb,
        weight: 20,
        rationale: "Database ORM / data storage present",
      },
      {
        check: ({ hasUi }) => !hasUi,
        weight: 10,
        rationale: "No frontend UI components present",
      },
    ],
  },
];



