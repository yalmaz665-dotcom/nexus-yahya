/**
 * Nexus Yahya - Platform Features & Capabilities
 * Şirket: Yahya Almaz Teknoloji
 * Açıklama: AI-destekli tam yığın uygulama geliştirme platformu
 */

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  priority: Priority;
  estimatedHours: number;
  technologies: string[];
}

export enum FeatureCategory {
  // Arayüz Üretimi
  UI_GENERATION = "UI_GENERATION",
  DESIGN_SYSTEM = "DESIGN_SYSTEM",
  STYLING = "STYLING",

  // Full-Stack Geliştirme
  BACKEND = "BACKEND",
  DATABASE = "DATABASE",
  AUTHENTICATION = "AUTHENTICATION",

  // Yapay Zeka
  AI_ENGINE = "AI_ENGINE",
  NLP = "NLP",
  CODE_GENERATION = "CODE_GENERATION",

  // Deployment & Integration
  DEPLOYMENT = "DEPLOYMENT",
  INTEGRATION = "INTEGRATION",
  VERSION_CONTROL = "VERSION_CONTROL",

  // Diğer
  ANALYTICS = "ANALYTICS",
  DOCUMENTATION = "DOCUMENTATION",
}

export enum FeatureStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  PLANNED = "PLANNED",
  BLOCKED = "BLOCKED",
}

export enum Priority {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

/**
 * Platform Features - Tüm Özellikler Listesi
 */
export const PLATFORM_FEATURES: Feature[] = [
  // === PHASE 1: Foundation (Tamamlandı) ===
  {
    id: "todo-app",
    name: "Todo Application",
    description: "Modern todo list uygulaması local storage ile",
    category: FeatureCategory.DESIGN_SYSTEM,
    status: FeatureStatus.COMPLETED,
    priority: Priority.HIGH,
    estimatedHours: 16,
    technologies: ["React", "TypeScript", "Tailwind CSS", "LocalStorage"],
  },

  // === PHASE 2: Core Features (Devam Ediyor) ===
  {
    id: "weather-dashboard",
    name: "Weather Dashboard",
    description: "Hava durumu verilerini gösteren interaktif dashboard",
    category: FeatureCategory.DESIGN_SYSTEM,
    status: FeatureStatus.IN_PROGRESS,
    priority: Priority.HIGH,
    estimatedHours: 24,
    technologies: ["Next.js", "Shadcn UI", "Chart.js", "Weather API"],
  },

  {
    id: "nlp-pipeline",
    name: "NLP Pipeline",
    description: "Doğal dil işleme ve anlama modülü",
    category: FeatureCategory.NLP,
    status: FeatureStatus.IN_PROGRESS,
    priority: Priority.CRITICAL,
    estimatedHours: 40,
    technologies: ["OpenAI", "LangChain", "Python", "TypeScript"],
  },

  {
    id: "database-schema",
    name: "Database Schema Design",
    description: "PostgreSQL/MongoDB için veritabanı şeması tasarımı",
    category: FeatureCategory.DATABASE,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 16,
    technologies: ["Prisma", "PostgreSQL", "MongoDB"],
  },

  // === PHASE 3: AI Engine ===
  {
    id: "code-generation",
    name: "AI Code Generation Engine",
    description: "Doğal dil komutlarından kod üretme motoru",
    category: FeatureCategory.CODE_GENERATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.CRITICAL,
    estimatedHours: 80,
    technologies: ["GPT-4", "LangChain", "AST", "Code Parser"],
  },

  {
    id: "image-to-code",
    name: "Image-to-Code",
    description: "Screenshot veya görsel tasarımdan React kodu üretme",
    category: FeatureCategory.CODE_GENERATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 48,
    technologies: ["Vision API", "OCR", "Code Generation"],
  },

  {
    id: "codebase-analyzer",
    name: "Codebase Analyzer",
    description: "Mevcut kod tabanını analiz et ve entegre et",
    category: FeatureCategory.AI_ENGINE,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 32,
    technologies: ["AST", "Code Analysis", "GitHub API"],
  },

  {
    id: "prompt-engineering",
    name: "Prompt Engineering Framework",
    description: "Optimized prompt templates ve best practices",
    category: FeatureCategory.AI_ENGINE,
    status: FeatureStatus.PLANNED,
    priority: Priority.MEDIUM,
    estimatedHours: 24,
    technologies: ["LangChain", "OpenAI", "Prompt Optimization"],
  },

  // === PHASE 4: Advanced Features ===
  {
    id: "live-preview",
    name: "Live Preview Engine",
    description: "Gerçek zamanlı kod önizleme ve interaksiyon",
    category: FeatureCategory.UI_GENERATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 40,
    technologies: ["Next.js", "WebSockets", "React", "Code Sandbox"],
  },

  {
    id: "inline-editor",
    name: "Inline Code Editor",
    description: "Doğrudan kod değiştirme ve yapı taşlarına ayırma",
    category: FeatureCategory.UI_GENERATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.MEDIUM,
    estimatedHours: 32,
    technologies: ["Monaco Editor", "React", "TypeScript"],
  },

  {
    id: "github-integration",
    name: "GitHub Integration",
    description: "GitHub repo klonlama ve otomatik push/deploy",
    category: FeatureCategory.INTEGRATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 24,
    technologies: ["GitHub API", "Octokit", "Git"],
  },

  {
    id: "vercel-deployment",
    name: "Vercel Deployment Integration",
    description: "1-click Vercel deployment ve CI/CD otomasyonu",
    category: FeatureCategory.DEPLOYMENT,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 20,
    technologies: ["Vercel API", "GitHub Actions", "Next.js"],
  },

  {
    id: "npm-publisher",
    name: "NPM Package Publisher",
    description: "Üretilen bileşenleri NPM paket olarak yayınla",
    category: FeatureCategory.DEPLOYMENT,
    status: FeatureStatus.PLANNED,
    priority: Priority.MEDIUM,
    estimatedHours: 16,
    technologies: ["NPM CLI", "Package Publishing", "Versioning"],
  },

  {
    id: "design-system-builder",
    name: "Design System Builder",
    description: "Özel tasarım sistemi ve design tokens oluşturma",
    category: FeatureCategory.DESIGN_SYSTEM,
    status: FeatureStatus.PLANNED,
    priority: Priority.MEDIUM,
    estimatedHours: 32,
    technologies: ["Tailwind CSS", "Design Tokens", "CSS-in-JS"],
  },

  // === PHASE 5: Polish & Beta ===
  {
    id: "auth-system",
    name: "Authentication System",
    description: "NextAuth/JWT/OAuth entegrasyonu ve yönetimi",
    category: FeatureCategory.AUTHENTICATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.CRITICAL,
    estimatedHours: 36,
    technologies: ["NextAuth.js", "JWT", "OAuth2", "PostgreSQL"],
  },

  {
    id: "unit-tests",
    name: "Unit & Integration Tests",
    description: "Jest, Vitest ve Cypress test suite'i",
    category: FeatureCategory.DOCUMENTATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 40,
    technologies: ["Jest", "Vitest", "Cypress", "React Testing Library"],
  },

  {
    id: "api-docs",
    name: "API Documentation",
    description: "Swagger/OpenAPI ile interaktif API belgeleri",
    category: FeatureCategory.DOCUMENTATION,
    status: FeatureStatus.PLANNED,
    priority: Priority.MEDIUM,
    estimatedHours: 16,
    technologies: ["Swagger/OpenAPI", "TypeScript", "Next.js"],
  },

  {
    id: "performance-optimization",
    name: "Performance Optimization",
    description: "Kod splitting, caching, ve bundle optimizasyonu",
    category: FeatureCategory.AI_ENGINE,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 24,
    technologies: ["Webpack", "Next.js", "Performance Monitoring"],
  },

  // === PHASE 6: Production Release ===
  {
    id: "monitoring-logging",
    name: "Monitoring & Logging",
    description: "Sentry, LogRocket ve custom analytics setup",
    category: FeatureCategory.ANALYTICS,
    status: FeatureStatus.PLANNED,
    priority: Priority.HIGH,
    estimatedHours: 20,
    technologies: ["Sentry", "LogRocket", "Analytics", "Monitoring"],
  },

  {
    id: "analytics",
    name: "Analytics Implementation",
    description: "Kullanıcı davranışı ve platform kullanım analitikleri",
    category: FeatureCategory.ANALYTICS,
    status: FeatureStatus.PLANNED,
    priority: Priority.MEDIUM,
    estimatedHours: 16,
    technologies: ["Google Analytics", "Mixpanel", "Custom Analytics"],
  },
];

/**
 * Feature Statistics
 */
export const getFeatureStats = () => {
  const stats = {
    total: PLATFORM_FEATURES.length,
    completed: PLATFORM_FEATURES.filter(
      (f) => f.status === FeatureStatus.COMPLETED
    ).length,
    inProgress: PLATFORM_FEATURES.filter(
      (f) => f.status === FeatureStatus.IN_PROGRESS
    ).length,
    planned: PLATFORM_FEATURES.filter(
      (f) => f.status === FeatureStatus.PLANNED
    ).length,
    totalHours: PLATFORM_FEATURES.reduce((sum, f) => sum + f.estimatedHours, 0),
  };

  return stats;
};

/**
 * Get features by category
 */
export const getFeaturesByCategory = (category: FeatureCategory) => {
  return PLATFORM_FEATURES.filter((f) => f.category === category);
};

/**
 * Get features by priority
 */
export const getFeaturesByPriority = (priority: Priority) => {
  return PLATFORM_FEATURES.filter((f) => f.priority === priority);
};

/**
 * Get features by status
 */
export const getFeaturesByStatus = (status: FeatureStatus) => {
  return PLATFORM_FEATURES.filter((f) => f.status === status);
};

// Export all enums ve interfaces
export {
  Feature,
  FeatureCategory,
  FeatureStatus,
  Priority,
};
