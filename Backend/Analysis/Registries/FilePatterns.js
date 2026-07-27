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
];
