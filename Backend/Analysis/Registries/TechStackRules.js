/**
 * TechStackRules.js
 * Central registry mapping file extensions, manifest dependencies,
 * and key files to technologies, frameworks, and project types.
 */

export const EXTENSION_MAP = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".py": "Python",
  ".java": "Java",
  ".kt": "Kotlin",
  ".go": "Go",
  ".rs": "Rust",
  ".php": "PHP",
  ".rb": "Ruby",
  ".cs": "C#",
  ".cpp": "C++",
  ".c": "C",
  ".html": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".json": "JSON Config",
  ".yaml": "YAML Config",
  ".yml": "YAML Config",
  ".sql": "SQL",
  ".sh": "Shell Script",
  ".dockerfile": "Docker",
  ".proto": "Protocol Buffers",
};

export const FRAMEWORK_RULES = [
  // Node / JS / TS
  { name: "React", key: "react", category: "Frontend", type: "Frontend" },
  { name: "Next.js", key: "next", category: "Fullstack Framework", type: "Fullstack" },
  { name: "Vue.js", key: "vue", category: "Frontend", type: "Frontend" },
  { name: "Angular", key: "@angular/core", category: "Frontend", type: "Frontend" },
  { name: "Svelte", key: "svelte", category: "Frontend", type: "Frontend" },
  { name: "Express", key: "express", category: "Backend Web Framework", type: "Backend" },
  { name: "NestJS", key: "@nestjs/core", category: "Backend Web Framework", type: "Backend" },
  { name: "Fastify", key: "fastify", category: "Backend Web Framework", type: "Backend" },
  { name: "MongoDB / Mongoose", key: "mongoose", category: "Database ORM", type: "Backend" },
  { name: "Prisma", key: "prisma", category: "Database ORM", type: "Backend" },
  { name: "TypeORM", key: "typeorm", category: "Database ORM", type: "Backend" },
  { name: "Tailwind CSS", key: "tailwindcss", category: "Styling", type: "Frontend" },

  // Python
  { name: "Django", key: "django", category: "Backend Web Framework", type: "Backend" },
  { name: "FastAPI", key: "fastapi", category: "Backend Web Framework", type: "Backend" },
  { name: "Flask", key: "flask", category: "Backend Web Framework", type: "Backend" },
  { name: "PyTorch", key: "torch", category: "Machine Learning", type: "Data Science / ML" },
  { name: "TensorFlow", key: "tensorflow", category: "Machine Learning", type: "Data Science / ML" },
  { name: "SQLAlchemy", key: "sqlalchemy", category: "Database ORM", type: "Backend" },
  { name: "Pandas", key: "pandas", category: "Data Analysis", type: "Data Science / ML" },

  // Java / Kotlin
  { name: "Spring Boot", key: "spring-boot", category: "Backend Web Framework", type: "Backend" },
  { name: "Hibernate", key: "hibernate", category: "Database ORM", type: "Backend" },
  { name: "Quarkus", key: "quarkus", category: "Backend Framework", type: "Backend" },

  // Go
  { name: "Gin", key: "gin-gonic/gin", category: "Backend Web Framework", type: "Backend" },
  { name: "Fiber", key: "gofiber/fiber", category: "Backend Web Framework", type: "Backend" },
  { name: "Echo", key: "labstack/echo", category: "Backend Web Framework", type: "Backend" },
  { name: "GORM", key: "gorm.io/gorm", category: "Database ORM", type: "Backend" },

  // Rust
  { name: "Actix Web", key: "actix-web", category: "Backend Web Framework", type: "Backend" },
  { name: "Axum", key: "axum", category: "Backend Web Framework", type: "Backend" },
  { name: "Rocket", key: "rocket", category: "Backend Web Framework", type: "Backend" },
  { name: "Tokio", key: "tokio", category: "Async Runtime", type: "Backend" },

  // PHP
  { name: "Laravel", key: "laravel/framework", category: "Backend Web Framework", type: "Backend" },
  { name: "Symfony", key: "symfony/framework-bundle", category: "Backend Web Framework", type: "Backend" },

  // Ruby
  { name: "Ruby on Rails", key: "rails", category: "Backend Web Framework", type: "Fullstack" },
  { name: "Sinatra", key: "sinatra", category: "Backend Web Framework", type: "Backend" },
];

export const MANIFEST_FILES = [
  { name: "package.json", ecosystem: "Node.js" },
  { name: "requirements.txt", ecosystem: "Python" },
  { name: "pyproject.toml", ecosystem: "Python" },
  { name: "Pipfile", ecosystem: "Python" },
  { name: "pom.xml", ecosystem: "Java (Maven)" },
  { name: "build.gradle", ecosystem: "Java/Kotlin (Gradle)" },
  { name: "go.mod", ecosystem: "Go" },
  { name: "Cargo.toml", ecosystem: "Rust" },
  { name: "composer.json", ecosystem: "PHP" },
  { name: "Gemfile", ecosystem: "Ruby" },
  { name: "Dockerfile", ecosystem: "Docker" },
  { name: "docker-compose.yml", ecosystem: "Docker Compose" },
];

export const FRAMEWORK_ALIASES = {
  react: ["react", "next.js", "next", "remix"],
  express: ["express", "nestjs", "@nestjs/core", "fastify"],
  fastapi: ["fastapi", "flask", "python"],
  django: ["django"],
  "spring boot": ["spring-boot", "spring", "quarkus", "micronaut"],
  gin: ["gin-gonic/gin", "gin", "fiber", "echo"],
  "actix web": ["actix-web", "actix", "axum"],
  laravel: ["laravel", "symfony"],
  "ruby on rails": ["rails", "sinatra"],
  "asp.net": ["asp.net", "c#", "dotnet", "microsoft.aspnetcore"],
  "mongodb / mongoose": ["mongoose", "mongodb"],
  sqlalchemy: ["sqlalchemy"],
  hibernate: ["hibernate", "spring"],
  gorm: ["gorm"],
  prisma: ["prisma"],
  "entity framework": ["entity framework", "entityframework", "efcore"],
  "vue.js": ["vue", "nuxt"],
  angular: ["angular", "@angular/core"],
  "tailwind css": ["tailwindcss", "tailwind"],
};

