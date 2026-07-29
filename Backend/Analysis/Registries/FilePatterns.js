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

