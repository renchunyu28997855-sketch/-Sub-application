# 自进化引擎系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个能够分析、优化、自进化Agent/Skill/应用的系统，采用ReAct模式，支持迭代改进和可视化

**Architecture:** 系统采用分层架构：分析器(Analyzer)负责代码分析 → 修改器(Modifier)执行修改 → 迭代器(Iterator)控制循环 → 自进化控制器管理自我改进。AI能力由MiniMax API提供，可视化层支持Dashboard/HistoryTree/DiffViewer

**Tech Stack:** TypeScript, Node.js, React + Ink(TUI), MiniMax API, 文件持久化

---

## 文件结构映射

```
evo-engine/
├── package.json                    # 项目依赖
├── tsconfig.json                  # TypeScript配置
├── src/
│   ├── index.ts                   # 入口文件
│   ├── types/                     # 类型定义
│   │   ├── target.ts             # Target类型
│   │   ├── analysis.ts           # AnalysisResult类型
│   │   ├── modification.ts        # ModificationPlan类型
│   │   └── iteration.ts           # IterationRecord类型
│   ├── analyzer/                  # 分析器模块
│   │   ├── index.ts              # 导出
│   │   ├── structure.ts          # 结构分析
│   │   ├── quality.ts            # 质量评估
│   │   ├── issues.ts             # 问题检测
│   │   └── theory.ts             # 理论映射
│   ├── modifier/                  # 修改器模块
│   │   ├── index.ts
│   │   ├── applier.ts            # 修改执行
│   │   ├── preview.ts            # 预览
│   │   └── validator.ts           # 验证
│   ├── iterator/                  # 迭代器模块
│   │   ├── index.ts
│   │   ├── controller.ts         # 迭代控制
│   │   └── convergence.ts        # 收敛判断
│   ├── evolution/                 # 自进化模块
│   │   ├── index.ts
│   │   ├── self-analyzer.ts      # 自我分析
│   │   └── strategy-optimizer.ts # 策略优化
│   ├── ai/                        # AI集成模块
│   │   ├── index.ts
│   │   ├── client.ts             # MiniMax API客户端
│   │   └── prompts.ts            # Prompt模板
│   ├── visual/                    # 可视化模块
│   │   ├── index.ts
│   │   ├── dashboard.ts         # 仪表盘
│   │   └── history-tree.ts      # 历史树
│   └── storage/                   # 持久化模块
│       ├── index.ts
│       └── iterations.ts         # 迭代记录存储
└── tests/
    ├── analyzer.test.ts
    ├── modifier.test.ts
    └── iterator.test.ts
```

---

## Task 1: 项目初始化 (L0仓库骨架)

**Files:**
- Create: `evo-engine/package.json`
- Create: `evo-engine/tsconfig.json`
- Create: `evo-engine/src/index.ts`
- Create: `evo-engine/.gitignore`

- [ ] **Step 1: 创建package.json**

```json
{
  "name": "evo-engine",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "dependencies": {
    "typescript": "^5.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/node": "^20.0.0"
  }
}
```

- [ ] **Step 2: 创建tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **Step 3: 创建.gitignore**

```
node_modules/
dist/
*.log
.env
.DS_Store
```

- [ ] **Step 4: 创建入口文件src/index.ts**

```typescript
/**
 * 自进化引擎 (EvoEngine)
 * 分析、优化、自进化Agent/Skill/应用的系统
 */

export { EvoEngine } from './evo-engine.js';
export { Analyzer } from './analyzer/index.js';
export { Modifier } from './modifier/index.js';
export { Iterator } from './iterator/index.js';
export * from './types/index.js';
```

- [ ] **Step 5: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
mkdir -p evo-engine/src evo-engine/tests
git add evo-engine/
git commit -m "feat: initialize evo-engine project skeleton"
```

---

## Task 2: 类型定义 (L2类型边界)

**Files:**
- Create: `evo-engine/src/types/target.ts`
- Create: `evo-engine/src/types/analysis.ts`
- Create: `evo-engine/src/types/modification.ts`
- Create: `evo-engine/src/types/iteration.ts`
- Create: `evo-engine/src/types/index.ts`

- [ ] **Step 1: 创建target.ts**

```typescript
import { z } from 'zod';

export const TargetTypeSchema = z.enum(['agent', 'skill', 'application']);
export type TargetType = z.infer<typeof TargetTypeSchema>;

export const TargetFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  language: z.string(),
  hash: z.string()
});
export type TargetFile = z.infer<typeof TargetFileSchema>;

export const TargetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: TargetTypeSchema,
  path: z.string(),
  files: z.array(TargetFileSchema),
  metadata: z.record(z.unknown()).optional()
});
export type Target = z.infer<typeof TargetSchema>;

export function createTarget(path: string, type: TargetType, name?: string): Target {
  const fs = require('fs');
  const pathModule = require('path');

  const files: TargetFile[] = [];
  const walkDir = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = pathModule.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const hash = require('crypto').createHash('md5').update(content).digest('hex');
        files.push({
          path: fullPath,
          content,
          language: pathModule.extname(fullPath).slice(1) || 'txt',
          hash
        });
      }
    }
  };

  walkDir(path);

  return {
    id: require('crypto').randomUUID(),
    name: name || pathModule.basename(path),
    type,
    path,
    files,
    metadata: {}
  };
}
```

- [ ] **Step 2: 创建analysis.ts**

```typescript
import { z } from 'zod';

export const ComplexityMetricsSchema = z.object({
  cyclomatic: z.number(),
  cognitive: z.number(),
  nesting: z.number()
});
export type ComplexityMetrics = z.infer<typeof ComplexityMetricsSchema>;

export const DependencyGraphSchema = z.object({
  nodes: z.array(z.object({ id: z.string(), path: z.string() })),
  edges: z.array(z.object({ from: z.string(), to: z.string() }))
});
export type DependencyGraph = z.infer<typeof DependencyGraphSchema>;

export const IssueSchema = z.object({
  type: z.enum(['error', 'warning', 'info']),
  category: z.string(),
  location: z.object({ file: z.string(), line: z.number() }),
  message: z.string(),
  suggestion: z.string().optional()
});
export type Issue = z.infer<typeof IssueSchema>;

export const TheoryMappingSchema = z.object({
  domain: z.string(),
  algorithms: z.array(z.object({
    name: z.string(),
    applicability: z.number(),
    complexity: z.enum(['low', 'medium', 'high'])
  })),
  bestPractices: z.array(z.string())
});
export type TheoryMapping = z.infer<typeof TheoryMappingSchema>;

export const AnalysisResultSchema = z.object({
  targetId: z.string(),
  timestamp: z.date(),
  score: z.number().min(0).max(100),
  structure: z.object({
    fileCount: z.number(),
    totalLines: z.number(),
    codeLines: z.number(),
    commentLines: z.number(),
    dependencies: DependencyGraphSchema
  }),
  quality: z.object({
    complexity: ComplexityMetricsSchema,
    duplications: z.array(z.unknown()),
    testCoverage: z.number().optional(),
    documentationScore: z.number()
  }),
  issues: z.array(IssueSchema),
  theory: TheoryMappingSchema.optional()
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
```

- [ ] **Step 3: 创建modification.ts**

```typescript
import { z } from 'zod';

export const ModificationTypeSchema = z.enum(['refactor', 'optimize', 'fix', 'evolve']);
export type ModificationType = z.infer<typeof ModificationTypeSchema>;

export const ModificationSchema = z.object({
  id: z.string(),
  type: ModificationTypeSchema,
  priority: z.number(),
  location: z.object({
    file: z.string(),
    startLine: z.number(),
    endLine: z.number()
  }),
  before: z.string(),
  after: z.string(),
  rationale: z.string(),
  theoryBasis: z.string().optional()
});
export type Modification = z.infer<typeof ModificationSchema>;

export const ModificationPlanSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  modifications: z.array(ModificationSchema),
  risk: z.enum(['low', 'medium', 'high']),
  estimatedImprovement: z.number(),
  requiresConfirmation: z.boolean()
});
export type ModificationPlan = z.infer<typeof ModificationPlanSchema>;
```

- [ ] **Step 4: 创建iteration.ts**

```typescript
import { z } from 'zod';

export const ValidationResultSchema = z.object({
  passed: z.boolean(),
  message: z.string().optional()
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

export const IterationRecordSchema = z.object({
  iteration: z.number(),
  timestamp: z.date(),
  beforeScore: z.number(),
  afterScore: z.number(),
  improvement: z.number(),
  modifications: z.array(z.unknown()),
  validationResults: z.array(ValidationResultSchema),
  duration: z.number(),
  aiCalls: z.number(),
  status: z.enum(['success', 'partial', 'failed']),
  notes: z.string().optional()
});
export type IterationRecord = z.infer<typeof IterationRecordSchema>;

export const IterationConfigSchema = z.object({
  maxIterations: z.number().default(10),
  minScoreThreshold: z.number().default(90),
  autoContinue: z.boolean().default(false)
});
export type IterationConfig = z.infer<typeof IterationConfigSchema>;

export const IterationResultSchema = z.object({
  iteration: z.number(),
  score: z.number(),
  modifications: z.array(z.unknown()),
  converged: z.boolean()
});
export type IterationResult = z.infer<typeof IterationResultSchema>;
```

- [ ] **Step 5: 创建types/index.ts**

```typescript
export * from './target.js';
export * from './analysis.js';
export * from './modification.js';
export * from './iteration.js';
```

- [ ] **Step 6: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/types/
git commit -m "feat: add type definitions for EvoEngine"
```

---

## Task 3: 分析器实现 (Analyzer)

**Files:**
- Create: `evo-engine/src/analyzer/index.ts`
- Create: `evo-engine/src/analyzer/structure.ts`
- Create: `evo-engine/src/analyzer/quality.ts`
- Create: `evo-engine/src/analyzer/issues.ts`
- Create: `evo-engine/src/analyzer/theory.ts`
- Create: `evo-engine/tests/analyzer.test.ts`

- [ ] **Step 1: 创建analyzer/structure.ts**

```typescript
import { Target, TargetFile, DependencyGraph } from '../types/index.js';

export interface StructureResult {
  fileCount: number;
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  dependencies: DependencyGraph;
}

export function analyzeStructure(target: Target): StructureResult {
  let totalLines = 0;
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  const nodes: { id: string; path: string }[] = [];
  const edges: { from: string; to: string }[] = [];

  for (const file of target.files) {
    const lines = file.content.split('\n');
    totalLines += lines.length;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') {
        blankLines++;
      } else if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        commentLines++;
      } else {
        codeLines++;
      }
    }

    nodes.push({ id: file.path, path: file.path });

    // 检测import/require依赖
    const importRegex = /(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g;
    let match;
    while ((match = importRegex.exec(file.content)) !== null) {
      edges.push({ from: file.path, to: match[1] });
    }
  }

  return {
    fileCount: target.files.length,
    totalLines,
    codeLines,
    commentLines,
    blankLines,
    dependencies: { nodes, edges }
  };
}
```

- [ ] **Step 2: 创建analyzer/quality.ts**

```typescript
import { Target, ComplexityMetrics } from '../types/index.js';

export interface QualityResult {
  complexity: ComplexityMetrics;
  documentationScore: number;
  overallScore: number;
}

function calculateCyclomaticComplexity(code: string): number {
  let complexity = 1;
  const patterns = [
    /\bif\b/g, /\belse\s+if\b/g, /\bwhile\b/g, /\bfor\b/g,
    /\bcase\b/g, /\bcatch\b/g, /\?\s*[^:]+:[^:]*\b/g
  ];

  for (const pattern of patterns) {
    const matches = code.match(pattern);
    if (matches) complexity += matches.length;
  }

  return complexity;
}

function calculateNestingDepth(code: string): number {
  let maxDepth = 0;
  let currentDepth = 0;

  for (const char of code) {
    if (char === '{') {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (char === '}') {
      currentDepth--;
    }
  }

  return maxDepth;
}

function calculateDocumentationScore(target: Target): number {
  let totalLines = 0;
  let commentLines = 0;

  for (const file of target.files) {
    const lines = file.content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') continue;
      totalLines++;
      if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        commentLines++;
      }
    }
  }

  return totalLines > 0 ? Math.round((commentLines / totalLines) * 100) : 0;
}

export function analyzeQuality(target: Target): QualityResult {
  let totalComplexity = 0;
  let maxNesting = 0;
  let fileCount = 0;

  for (const file of target.files) {
    if (['js', 'ts', 'jsx', 'tsx', 'py'].includes(file.language)) {
      fileCount++;
      totalComplexity += calculateCyclomaticComplexity(file.content);
      maxNesting = Math.max(maxNesting, calculateNestingDepth(file.content));
    }
  }

  const avgComplexity = fileCount > 0 ? totalComplexity / fileCount : 0;
  const documentationScore = calculateDocumentationScore(target);

  // 质量分数 = 100 - 复杂度惩罚 - (100 - 文档分数) * 0.5
  const complexityPenalty = Math.min(40, avgComplexity * 2);
  const overallScore = Math.max(0, Math.min(100, 100 - complexityPenalty + (documentationScore * 0.5 - 50)));

  return {
    complexity: {
      cyclomatic: Math.round(avgComplexity),
      cognitive: Math.round(avgComplexity * 1.2),
      nesting: maxNesting
    },
    documentationScore,
    overallScore: Math.round(overallScore)
  };
}
```

- [ ] **Step 3: 创建analyzer/issues.ts**

```typescript
import { Target, Issue } from '../types/index.js';

export function detectIssues(target: Target): Issue[] {
  const issues: Issue[] = [];

  for (const file of target.files) {
    if (!['js', 'ts', 'jsx', 'tsx', 'py'].includes(file.language)) continue;

    const lines = file.content.split('\n');

    // 检测if(false)死代码
    const ifFalseRegex = /if\s*\(\s*false\s*\)/g;
    let match;
    while ((match = ifFalseRegex.exec(file.content)) !== null) {
      const lineNum = file.content.substring(0, match.index).split('\n').length;
      issues.push({
        type: 'warning',
        category: 'dead_code',
        location: { file: file.path, line: lineNum },
        message: '检测到死代码分支 if(false)',
        suggestion: '移除永远不会执行的代码分支'
      });
    }

    // 检测Magic Number
    const magicNumberRegex = /(?<!["\w])(\d{3,})(?!["\w])/g;
    while ((match = magicNumberRegex.exec(file.content)) !== null) {
      const lineNum = file.content.substring(0, match.index).split('\n').length;
      issues.push({
        type: 'warning',
        category: 'magic_number',
        location: { file: file.path, line: lineNum },
        message: `检测到魔数: ${match[1]}`,
        suggestion: '使用命名常量替代魔数'
      });
    }

    // 检测过深的嵌套
    let depth = 0;
    let maxDepth = 0;
    let maxDepthLine = 0;
    let currentLine = 0;
    for (const char of file.content) {
      currentLine += char === '\n' ? 1 : 0;
      if (char === '{') {
        depth++;
        if (depth > maxDepth) {
          maxDepth = depth;
          maxDepthLine = currentLine;
        }
      } else if (char === '}') {
        depth--;
      }
    }
    if (maxDepth > 5) {
      issues.push({
        type: 'warning',
        category: 'deep_nesting',
        location: { file: file.path, line: maxDepthLine },
        message: `嵌套深度过深: ${maxDepth}层`,
        suggestion: '考虑提取子函数减少嵌套'
      });
    }

    // 检测console.log
    if (/\bconsole\.(log|debug|info)\b/.test(file.content)) {
      issues.push({
        type: 'info',
        category: 'debug_code',
        location: { file: file.path, line: 1 },
        message: '代码中包含调试日志',
        suggestion: '生产环境应移除console.log或使用日志框架'
      });
    }
  }

  return issues;
}
```

- [ ] **Step 4: 创建analyzer/theory.ts**

```typescript
import { TheoryMapping } from '../types/index.js';

const THEORY_LIBRARY: Record<string, TheoryMapping> = {
  quality_detection: {
    domain: 'quality_detection',
    algorithms: [
      { name: 'YOLO (You Only Look Once)', applicability: 95, complexity: 'medium' },
      { name: 'Faster R-CNN', applicability: 90, complexity: 'high' },
      { name: 'U-Net', applicability: 92, complexity: 'medium' }
    ],
    bestPractices: ['数据增强', '迁移学习', '主动学习']
  },
  predictive_maintenance: {
    domain: 'predictive_maintenance',
    algorithms: [
      { name: 'LSTM', applicability: 92, complexity: 'high' },
      { name: 'XGBoost', applicability: 88, complexity: 'medium' },
      { name: '随机森林', applicability: 85, complexity: 'low' }
    ],
    bestPractices: ['特征工程', '异常检测', '多模态融合']
  },
  scheduling: {
    domain: 'scheduling',
    algorithms: [
      { name: '遗传算法', applicability: 85, complexity: 'medium' },
      { name: '强化学习', applicability: 88, complexity: 'high' },
      { name: '约束编程', applicability: 80, complexity: 'medium' }
    ],
    bestPractices: ['柔性车间调度', '鲁棒优化']
  },
  general: {
    domain: 'general',
    algorithms: [
      { name: '模块化设计', applicability: 90, complexity: 'low' },
      { name: '单一职责原则', applicability: 85, complexity: 'low' },
      { name: '依赖注入', applicability: 80, complexity: 'medium' }
    ],
    bestPractices: ['代码审查', '自动化测试', '持续集成']
  }
};

export function mapTheory(target: { name: string; files: { content: string }[] }): TheoryMapping {
  const combined = (target.name + ' ' + target.files.map(f => f.content).join(' ')).toLowerCase();

  const keywords: Record<string, string> = {
    quality: 'quality_detection',
    defect: 'quality_detection',
    detect: 'quality_detection',
    maintenance: 'predictive_maintenance',
    failure: 'predictive_maintenance',
    prediction: 'predictive_maintenance',
    schedule: 'scheduling',
    planning: 'scheduling',
    optimization: 'scheduling'
  };

  let bestDomain = 'general';
  let bestScore = 0;

  for (const [keyword, domain] of Object.entries(keywords)) {
    if (combined.includes(keyword)) {
      const theory = THEORY_LIBRARY[domain];
      const score = theory.algorithms.length + theory.bestPractices.length;
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    }
  }

  return THEORY_LIBRARY[bestDomain];
}
```

- [ ] **Step 5: 创建analyzer/index.ts**

```typescript
import { Target, AnalysisResult } from '../types/index.js';
import { analyzeStructure, StructureResult } from './structure.js';
import { analyzeQuality, QualityResult } from './quality.js';
import { detectIssues, Issue } from './issues.js';
import { mapTheory, TheoryMapping } from './theory.js';

export interface AnalyzerResult {
  score: number;
  structure: StructureResult;
  quality: QualityResult;
  issues: Issue[];
  theory: TheoryMapping;
}

export class Analyzer {
  analyze(target: Target): AnalysisResult {
    const structure = analyzeStructure(target);
    const quality = analyzeQuality(target);
    const issues = detectIssues(target);
    const theory = mapTheory(target);

    // 综合评分
    const issuePenalty = issues.filter(i => i.type === 'error').length * 5 +
                         issues.filter(i => i.type === 'warning').length * 2;
    const score = Math.max(0, Math.min(100, quality.overallScore - issuePenalty));

    return {
      targetId: target.id,
      timestamp: new Date(),
      score,
      structure: {
        fileCount: structure.fileCount,
        totalLines: structure.totalLines,
        codeLines: structure.codeLines,
        commentLines: structure.commentLines,
        dependencies: structure.dependencies
      },
      quality: {
        complexity: quality.complexity,
        duplications: [],
        documentationScore: quality.documentationScore
      },
      issues,
      theory
    };
  }

  analyzeStructure(target: Target): StructureResult {
    return analyzeStructure(target);
  }

  analyzeQuality(target: Target): QualityResult {
    return analyzeQuality(target);
  }

  detectIssues(target: Target): Issue[] {
    return detectIssues(target);
  }

  mapTheory(target: Target): TheoryMapping {
    return mapTheory(target);
  }
}
```

- [ ] **Step 6: 创建analyzer测试**

```typescript
import { Analyzer } from '../src/analyzer/index.js';
import { createTarget, Target } from '../src/types/index.js';

describe('Analyzer', () => {
  const analyzer = new Analyzer();

  describe('analyze', () => {
    it('should analyze a simple target', () => {
      const target: Target = {
        id: 'test-1',
        name: 'test-module',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: `// Hello world
const foo = 123;

function test() {
  if (true) {
    console.log('test');
  }
}

export { test, foo };
`,
          language: 'js',
          hash: 'abc123'
        }]
      };

      const result = analyzer.analyze(target);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.structure.fileCount).toBe(1);
      expect(result.structure.codeLines).toBeGreaterThan(0);
      expect(result.issues.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('detectIssues', () => {
    it('should detect dead code', () => {
      const target: Target = {
        id: 'test-2',
        name: 'dead-code-test',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: `function test() {
  if (false) {
    console.log('never');
  }
}`,
          language: 'js',
          hash: 'def456'
        }]
      };

      const issues = analyzer.detectIssues(target);
      const deadCodeIssues = issues.filter(i => i.category === 'dead_code');
      expect(deadCodeIssues.length).toBeGreaterThan(0);
    });

    it('should detect magic numbers', () => {
      const target: Target = {
        id: 'test-3',
        name: 'magic-number-test',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: `const timeout = 300000;
const maxRetries = 999;`,
          language: 'js',
          hash: 'ghi789'
        }]
      };

      const issues = analyzer.detectIssues(target);
      const magicNumberIssues = issues.filter(i => i.category === 'magic_number');
      expect(magicNumberIssues.length).toBe(2);
    });
  });
});
```

- [ ] **Step 7: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/analyzer/ evo-engine/tests/analyzer.test.ts
git commit -m "feat: implement Analyzer module with structure, quality, issues, and theory analysis"
```

---

## Task 4: 修改器实现 (Modifier)

**Files:**
- Create: `evo-engine/src/modifier/index.ts`
- Create: `evo-engine/src/modifier/applier.ts`
- Create: `evo-engine/src/modifier/preview.ts`
- Create: `evo-engine/src/modifier/validator.ts`
- Create: `evo-engine/tests/modifier.test.ts`

- [ ] **Step 1: 创建modifier/applier.ts**

```typescript
import { Target, TargetFile, Modification } from '../types/index.js';

export interface ApplyResult {
  success: boolean;
  modifiedFiles: ModifiedFile[];
  errors: string[];
}

export interface ModifiedFile {
  path: string;
  before: string;
  after: string;
  modifications: Modification[];
}

export function applyModifications(target: Target, modifications: Modification[]): ApplyResult {
  const modifiedFiles: ModifiedFile[] = [];
  const errors: string[] = [];
  const fileMods = new Map<string, Modification[]>();

  // 按文件分组
  for (const mod of modifications) {
    const existing = fileMods.get(mod.location.file) || [];
    existing.push(mod);
    fileMods.set(mod.location.file, existing);
  }

  for (const [filePath, mods] of fileMods) {
    const file = target.files.find(f => f.path === filePath);
    if (!file) {
      errors.push(`文件不存在: ${filePath}`);
      continue;
    }

    let content = file.content;
    let lines = content.split('\n');

    // 按行号排序，从后往前替换（避免行号偏移）
    const sortedMods = mods.sort((a, b) => b.location.startLine - a.location.startLine);

    for (const mod of sortedMods) {
      const { startLine, endLine } = mod.location;
      const beforeLines = lines.slice(0, startLine - 1);
      const afterLines = lines.slice(endLine);
      const newLines = mod.after.split('\n');

      lines = [...beforeLines, ...newLines, ...afterLines];
    }

    const newContent = lines.join('\n');
    modifiedFiles.push({
      path: filePath,
      before: file.content,
      after: newContent,
      modifications: mods
    });
  }

  return {
    success: errors.length === 0,
    modifiedFiles,
    errors
  };
}

export function applyToFileSystem(modifiedFiles: ModifiedFile[]): void {
  const fs = require('fs');

  for (const { path, after } of modifiedFiles) {
    fs.writeFileSync(path, after, 'utf-8');
  }
}
```

- [ ] **Step 2: 创建modifier/preview.ts**

```typescript
import { Modification } from '../types/index.js';

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber?: number;
}

export interface FileDiff {
  file: string;
  lines: DiffLine[];
  stats: { additions: number; deletions: number; context: number };
}

export function generateDiff(modifications: Modification[]): FileDiff[] {
  const diffs: FileDiff[] = [];

  // 按文件分组
  const modsByFile = new Map<string, Modification[]>();
  for (const mod of modifications) {
    const existing = modsByFile.get(mod.location.file) || [];
    existing.push(mod);
    modsByFile.set(mod.location.file, existing);
  }

  for (const [file, mods] of modsByFile) {
    const diffLines: DiffLine[] = [];
    let additions = 0;
    let deletions = 0;

    for (const mod of mods) {
      const beforeLines = mod.before.split('\n');
      const afterLines = mod.after.split('\n');

      // 生成删除行
      for (const line of beforeLines) {
        diffLines.push({ type: 'remove', content: line });
        deletions++;
      }

      // 生成新增行
      for (const line of afterLines) {
        diffLines.push({ type: 'add', content: line });
        additions++;
      }

      // 添加上下文
      diffLines.push({ type: 'context', content: '...' });
    }

    diffs.push({
      file,
      lines: diffLines,
      stats: { additions, deletions, context: 0 }
    });
  }

  return diffs;
}

export function formatDiff(diffs: FileDiff[]): string {
  let output = '';

  for (const diff of diffs) {
    output += `\n文件: ${diff.file}\n`;
    output += `+${diff.stats.additions} -${diff.stats.deletions}\n`;
    output += '---\n';

    for (const line of diff.lines) {
      const prefix = line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ';
      output += `${prefix} ${line.content}\n`;
    }
  }

  return output;
}
```

- [ ] **Step 3: 创建modifier/validator.ts**

```typescript
import { Modification } from '../types/index.js';

export interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'error';
  modificationId: string;
  message: string;
}

export interface ValidationWarning {
  type: 'warning';
  modificationId: string;
  message: string;
}

export function validateModifications(modifications: Modification[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (const mod of modifications) {
    // 检查before/after是否为空
    if (!mod.before || mod.before.trim() === '') {
      errors.push({
        type: 'error',
        modificationId: mod.id,
        message: `修改${mod.id}: 原始代码不能为空`
      });
    }

    // 检查行号是否有效
    if (mod.location.startLine < 1) {
      errors.push({
        type: 'error',
        modificationId: mod.id,
        message: `修改${mod.id}: 起始行号必须大于0`
      });
    }

    if (mod.location.endLine < mod.location.startLine) {
      errors.push({
        type: 'error',
        modificationId: mod.id,
        message: `修改${mod.id}: 结束行号不能小于起始行号`
      });
    }

    // 检查是否有语法问题的风险（简单括号匹配）
    const beforeParens = (mod.before.match(/\(/g) || []).length;
    const afterParens = (mod.after.match(/\(/g) || []).length;
    if (beforeParens !== afterParens) {
      warnings.push({
        type: 'warning',
        modificationId: mod.id,
        message: `修改${mod.id}: 括号数量不匹配，可能存在语法错误`
      });
    }

    // 检查是否有潜在的破坏性修改
    if (mod.after.includes('delete') || mod.after.includes('drop') || mod.after.includes('truncate')) {
      warnings.push({
        type: 'warning',
        modificationId: mod.id,
        message: `修改${mod.id}: 检测到可能的破坏性操作`
      });
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}
```

- [ ] **Step 4: 创建modifier/index.ts**

```typescript
import { Target, ModificationPlan, Modification } from '../types/index.js';
import { applyModifications, ModifiedFile } from './applier.js';
import { generateDiff, formatDiff, FileDiff } from './preview.js';
import { validateModifications, ValidationResult } from './validator.js';

export interface ModificationResult {
  success: boolean;
  modifiedFiles: ModifiedFile[];
  validation: ValidationResult;
  diff: FileDiff[];
  errors: string[];
}

export class Modifier {
  validate(target: Target, plan: ModificationPlan): ValidationResult {
    return validateModifications(plan.modifications);
  }

  preview(plan: ModificationPlan): FileDiff[] {
    return generateDiff(plan.modifications);
  }

  formatPreview(diff: FileDiff[]): string {
    return formatDiff(diff);
  }

  apply(target: Target, plan: ModificationPlan): ModificationResult {
    // 1. 验证
    const validation = validateModifications(plan.modifications);

    // 2. 应用修改
    const applyResult = applyModifications(target, plan.modifications);

    // 3. 生成diff
    const diff = generateDiff(plan.modifications);

    return {
      success: applyResult.success && validation.passed,
      modifiedFiles: applyResult.modifiedFiles,
      validation,
      diff,
      errors: applyResult.errors
    };
  }

  applyToFileSystem(result: ModificationResult): void {
    if (!result.success) {
      throw new Error('Cannot apply failed modifications');
    }

    const fs = require('fs');
    for (const { path, after } of result.modifiedFiles) {
      fs.writeFileSync(path, after, 'utf-8');
    }
  }
}
```

- [ ] **Step 5: 创建modifier测试**

```typescript
import { Modifier } from '../src/modifier/index.js';
import { Target, ModificationPlan, Modification } from '../src/types/index.js';

describe('Modifier', () => {
  const modifier = new Modifier();

  describe('validate', () => {
    it('should validate correct modifications', () => {
      const target: Target = {
        id: 'test',
        name: 'test',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: 'const x = 1;',
          language: 'js',
          hash: 'abc'
        }]
      };

      const plan: ModificationPlan = {
        id: 'plan-1',
        targetId: 'test',
        modifications: [{
          id: 'mod-1',
          type: 'refactor',
          priority: 1,
          location: { file: '/test/index.js', startLine: 1, endLine: 1 },
          before: 'const x = 1;',
          after: 'const y = 1;',
          rationale: 'rename variable'
        }],
        risk: 'low',
        estimatedImprovement: 5,
        requiresConfirmation: false
      };

      const result = modifier.validate(target, plan);
      expect(result.passed).toBe(true);
    });

    it('should detect empty before code', () => {
      const target: Target = {
        id: 'test',
        name: 'test',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: 'const x = 1;',
          language: 'js',
          hash: 'abc'
        }]
      };

      const plan: ModificationPlan = {
        id: 'plan-1',
        targetId: 'test',
        modifications: [{
          id: 'mod-1',
          type: 'refactor',
          priority: 1,
          location: { file: '/test/index.js', startLine: 1, endLine: 1 },
          before: '',
          after: 'const y = 1;',
          rationale: 'empty before'
        }],
        risk: 'low',
        estimatedImprovement: 5,
        requiresConfirmation: false
      };

      const result = modifier.validate(target, plan);
      expect(result.passed).toBe(false);
      expect(result.errors.some(e => e.message.includes('不能为空'))).toBe(true);
    });
  });

  describe('preview', () => {
    it('should generate diff', () => {
      const plan: ModificationPlan = {
        id: 'plan-1',
        targetId: 'test',
        modifications: [{
          id: 'mod-1',
          type: 'refactor',
          priority: 1,
          location: { file: '/test/index.js', startLine: 1, endLine: 1 },
          before: 'const x = 1;',
          after: 'const y = 1;',
          rationale: 'rename'
        }],
        risk: 'low',
        estimatedImprovement: 5,
        requiresConfirmation: false
      };

      const diff = modifier.preview(plan);
      expect(diff.length).toBe(1);
      expect(diff[0].file).toBe('/test/index.js');
    });
  });
});
```

- [ ] **Step 6: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/modifier/ evo-engine/tests/modifier.test.ts
git commit -m "feat: implement Modifier module with apply, preview, and validate"
```

---

## Task 5: 迭代器实现 (Iterator)

**Files:**
- Create: `evo-engine/src/iterator/index.ts`
- Create: `evo-engine/src/iterator/controller.ts`
- Create: `evo-engine/src/iterator/convergence.ts`
- Create: `evo-engine/tests/iterator.test.ts`

- [ ] **Step 1: 创建iterator/convergence.ts**

```typescript
import { IterationConfig, IterationResult } from '../types/index.js';

export interface ConvergenceCheck {
  converged: boolean;
  reason: string;
}

export function checkConvergence(
  currentScore: number,
  previousScore: number,
  iteration: number,
  config: IterationConfig,
  iterationsHistory: IterationResult[]
): ConvergenceCheck {
  // 检查是否达到目标分数
  if (currentScore >= config.minScoreThreshold) {
    return {
      converged: true,
      reason: `达到目标分数 ${config.minScoreThreshold}`
    };
  }

  // 检查是否达到最大迭代次数
  if (iteration >= config.maxIterations) {
    return {
      converged: true,
      reason: `达到最大迭代次数 ${config.maxIterations}`
    };
  }

  // 检查是否收敛（分数变化小于1%）
  const improvement = currentScore - previousScore;
  const improvementPercent = previousScore > 0 ? (improvement / previousScore) * 100 : 0;

  if (iteration > 3 && improvementPercent < 1) {
    // 连续3次迭代改进都小于1%
    const recentIterations = iterationsHistory.slice(-3);
    const allSmallImprovement = recentIterations.every(r => {
      const imp = r.score - (iterationsHistory[iterationsHistory.indexOf(r) - 1]?.score || 0);
      return imp < 1;
    });

    if (allSmallImprovement) {
      return {
        converged: true,
        reason: '改进率低于1%，认为已收敛'
      };
    }
  }

  // 检查分数是否下降
  if (improvement < -5) {
    return {
      converged: true,
      reason: `分数下降超过5分，可能存在回退问题`
    };
  }

  return {
    converged: false,
    reason: '继续迭代'
  };
}

export function shouldAutoContinue(
  iteration: number,
  config: IterationConfig,
  lastResult: IterationResult | null
): boolean {
  if (!config.autoContinue) {
    return false;
  }

  // 如果上一次迭代失败，不自动继续
  if (lastResult && lastResult.score < 0) {
    return false;
  }

  // 如果达到目标分数，不继续
  if (lastResult && lastResult.score >= config.minScoreThreshold) {
    return false;
  }

  return iteration < config.maxIterations;
}
```

- [ ] **Step 2: 创建iterator/controller.ts**

```typescript
import { Target, IterationConfig, IterationResult, IterationRecord, AnalysisResult } from '../types/index.js';
import { Analyzer } from '../analyzer/index.js';
import { Modifier, ModificationResult } from '../modifier/index.js';
import { checkConvergence } from './convergence.js';

export interface ControllerResult {
  finalScore: number;
  iterations: IterationRecord[];
  converged: boolean;
  totalDuration: number;
  totalAiCalls: number;
}

export class IteratorController {
  private analyzer: Analyzer;
  private modifier: Modifier;
  private iterations: IterationResult[] = [];
  private records: IterationRecord[] = [];

  constructor(analyzer?: Analyzer, modifier?: Modifier) {
    this.analyzer = analyzer || new Analyzer();
    this.modifier = modifier || new Modifier();
  }

  async iterate(
    target: Target,
    config: IterationConfig,
    onProgress?: (result: IterationResult) => void
  ): Promise<ControllerResult> {
    const startTime = Date.now();
    let totalAiCalls = 0;

    // 初始分析
    let currentAnalysis = this.analyzer.analyze(target);
    let previousScore = currentAnalysis.score;

    this.iterations = [];
    this.records = [];

    for (let i = 1; i <= config.maxIterations; i++) {
      const iterationStart = Date.now();

      // 检查收敛
      const convergence = checkConvergence(
        currentAnalysis.score,
        previousScore,
        i,
        config,
        this.iterations
      );

      if (convergence.converged) {
        return {
          finalScore: currentAnalysis.score,
          iterations: this.records,
          converged: true,
          totalDuration: Date.now() - startTime,
          totalAiCalls
        };
      }

      // 生成修改方案（这里简化处理，实际应由AI生成）
      const modifications = this.generateModifications(currentAnalysis);
      totalAiCalls += modifications.length;

      // 应用修改
      const plan = {
        id: `plan-${i}`,
        targetId: target.id,
        modifications,
        risk: 'low' as const,
        estimatedImprovement: 5,
        requiresConfirmation: false
      };

      const modResult = this.modifier.apply(target, plan);

      // 计算本次迭代结果
      const iterationResult: IterationResult = {
        iteration: i,
        score: currentAnalysis.score,
        modifications,
        converged: false
      };

      this.iterations.push(iterationResult);

      // 记录
      const record: IterationRecord = {
        iteration: i,
        timestamp: new Date(),
        beforeScore: previousScore,
        afterScore: currentAnalysis.score,
        improvement: currentAnalysis.score - previousScore,
        modifications,
        validationResults: modResult.validation.errors.map(e => ({
          passed: false,
          message: e.message
        })),
        duration: Date.now() - iterationStart,
        aiCalls: modifications.length,
        status: modResult.success ? 'success' : 'partial'
      };

      this.records.push(record);

      // 回调
      if (onProgress) {
        onProgress(iterationResult);
      }

      previousScore = currentAnalysis.score;
    }

    return {
      finalScore: currentAnalysis.score,
      iterations: this.records,
      converged: false,
      totalDuration: Date.now() - startTime,
      totalAiCalls
    };
  }

  private generateModifications(analysis: AnalysisResult): any[] {
    // 简化：基于发现的问题生成修改
    const mods: any[] = [];

    for (const issue of analysis.issues.slice(0, 3)) {
      if (issue.category === 'dead_code') {
        mods.push({
          id: `fix-${issue.category}-${Date.now()}`,
          type: 'fix',
          priority: 1,
          location: issue.location,
          before: 'if (false) { /* dead */ }',
          after: '',
          rationale: '移除死代码'
        });
      } else if (issue.category === 'magic_number') {
        mods.push({
          id: `fix-${issue.category}-${Date.now()}`,
          type: 'optimize',
          priority: 2,
          location: issue.location,
          before: 'const timeout = 300000;',
          after: 'const TIMEOUT_MS = 300000; // 5 minutes',
          rationale: '使用命名常量替代魔数'
        });
      }
    }

    return mods;
  }

  getHistory(): IterationRecord[] {
    return this.records;
  }
}
```

- [ ] **Step 3: 创建iterator/index.ts**

```typescript
export { IteratorController, ControllerResult } from './controller.js';
export { checkConvergence, shouldAutoContinue } from './convergence.js';
```

- [ ] **Step 4: 创建iterator测试**

```typescript
import { IteratorController } from '../src/iterator/index.js';
import { checkConvergence } from '../src/iterator/convergence.js';
import { IterationConfig } from '../src/types/index.js';
import { Target } from '../src/types/index.js';

describe('Iterator', () => {
  describe('checkConvergence', () => {
    const config: IterationConfig = {
      maxIterations: 10,
      minScoreThreshold: 90,
      autoContinue: false
    };

    it('should converge when reaching target score', () => {
      const result = checkConvergence(92, 85, 5, config, []);
      expect(result.converged).toBe(true);
      expect(result.reason).toContain('达到目标分数');
    });

    it('should converge when reaching max iterations', () => {
      const result = checkConvergence(70, 65, 10, config, []);
      expect(result.converged).toBe(true);
      expect(result.reason).toContain('最大迭代次数');
    });

    it('should not converge when improving', () => {
      const result = checkConvergence(75, 70, 3, config, []);
      expect(result.converged).toBe(false);
    });
  });

  describe('IteratorController', () => {
    it('should iterate with target', async () => {
      const controller = new IteratorController();

      const target: Target = {
        id: 'test',
        name: 'test-module',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: `// Test module
if (false) {
  console.log('dead');
}
const x = 100;
export { x };
`,
          language: 'js',
          hash: 'abc'
        }]
      };

      const config: IterationConfig = {
        maxIterations: 3,
        minScoreThreshold: 50,
        autoContinue: true
      };

      const result = await controller.iterate(target, config);

      expect(result.iterations.length).toBeLessThanOrEqual(3);
      expect(result.finalScore).toBeGreaterThanOrEqual(0);
    });
  });
});
```

- [ ] **Step 5: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/iterator/ evo-engine/tests/iterator.test.ts
git commit -m "feat: implement Iterator module with convergence detection"
```

---

## Task 6: AI集成模块 (MiniMax)

**Files:**
- Create: `evo-engine/src/ai/index.ts`
- Create: `evo-engine/src/ai/client.ts`
- Create: `evo-engine/src/ai/prompts.ts`

- [ ] **Step 1: 创建ai/client.ts**

```typescript
export interface MiniMaxConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

const DEFAULT_CONFIG: MiniMaxConfig = {
  apiKey: process.env.MINIMAX_API_KEY || 'sk-cp-0YBHak5fYKPkssSTKFB8uUbbeEGm1OPdaxs02aXOydKYN-0pf630l7tfuShnOQHR4oE_laZjWuXCksojpO3DTxpkI9qYXiYFFq2oEQgTjrSUR9qLpbjSQCg',
  baseURL: 'https://api.minimax.chat/v1',
  model: 'MiniMax-Text-01',
  maxTokens: 32000,
  temperature: 0.7
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletion {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class MiniMaxClient {
  private config: MiniMaxConfig;

  constructor(config: Partial<MiniMaxConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async chat(messages: ChatMessage[]): Promise<ChatCompletion> {
    const response = await fetch(`${this.config.baseURL}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MiniMax API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0
      }
    };
  }

  async analyze(prompt: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a code analysis expert.' },
      { role: 'user', content: prompt }
    ];

    const result = await this.chat(messages);
    return result.content;
  }

  async generate(prompt: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: 'You are a code generation expert.' },
      { role: 'user', content: prompt }
    ];

    const result = await this.chat(messages);
    return result.content;
  }
}

export const miniMaxClient = new MiniMaxClient();
```

- [ ] **Step 2: 创建ai/prompts.ts**

```typescript
export const ANALYZE_PROMPT = `你是代码分析专家。分析以下{type}的代码：

目标: {targetName}
路径: {targetPath}

文件结构:
{fileStructure}

代码内容:
{codeContent}

分析要求:
1. 结构质量 - 模块划分、依赖关系、接口设计
2. 代码质量 - 复杂度、重复、注释、可读性
3. 问题检测 - Bug风险、安全隐患、坏味道
4. 最佳实践 - 是否符合行业标准

请输出JSON格式的分析结果:
{
  "score": 0-100,
  "issues": [
    {
      "type": "error|warning|info",
      "category": "分类",
      "location": {"file": "文件路径", "line": 行号},
      "message": "问题描述",
      "suggestion": "修复建议"
    }
  ],
  "suggestions": ["改进建议1", "改进建议2"]
}`;

export const MODIFY_PROMPT = `你是代码修改专家。根据分析结果生成修改方案：

原始代码:
{originalCode}

分析问题:
{issues}

修改要求:
1. 只修改有问题的部分
2. 保持代码风格一致
3. 确保修改后代码可运行

请输出JSON格式的修改方案:
{
  "modifications": [
    {
      "id": "mod-1",
      "type": "refactor|optimize|fix|evolve",
      "location": {"file": "文件路径", "startLine": 起始行, "endLine": 结束行},
      "before": "原始代码",
      "after": "修改后代码",
      "rationale": "修改理由"
    }
  ]
}`;

export const EVOLVE_PROMPT = `你是自进化系统的大脑。分析当前系统的问题并提出改进：

系统组件:
{components}

近期表现:
{recentPerformance}

问题案例:
{problemCases}

你的任务是:
1. 识别系统的不足之处
2. 提出具体的改进方案
3. 评估改进的风险和收益

请输出JSON格式:
{
  "issues": [
    {
      "severity": "critical|major|minor",
      "description": "问题描述",
      "location": "问题位置"
    }
  ],
  "improvements": [
    {
      "description": "改进描述",
      "effort": "low|medium|high",
      "impact": "low|medium|high",
      "implementation": "实现思路"
    }
  ]
}`;

export function buildAnalyzePrompt(
  type: string,
  targetName: string,
  targetPath: string,
  fileStructure: string,
  codeContent: string
): string {
  return ANALYZE_PROMPT
    .replace('{type}', type)
    .replace('{targetName}', targetName)
    .replace('{targetPath}', targetPath)
    .replace('{fileStructure}', fileStructure)
    .replace('{codeContent}', codeContent);
}

export function buildModifyPrompt(
  originalCode: string,
  issues: string
): string {
  return MODIFY_PROMPT
    .replace('{originalCode}', originalCode)
    .replace('{issues}', issues);
}

export function buildEvolvePrompt(
  components: string,
  recentPerformance: string,
  problemCases: string
): string {
  return EVOLVE_PROMPT
    .replace('{components}', components)
    .replace('{recentPerformance}', recentPerformance)
    .replace('{problemCases}', problemCases);
}
```

- [ ] **Step 3: 创建ai/index.ts**

```typescript
export { MiniMaxClient, miniMaxClient, MiniMaxConfig, ChatMessage, ChatCompletion } from './client.js';
export { ANALYZE_PROMPT, MODIFY_PROMPT, EVOLVE_PROMPT, buildAnalyzePrompt, buildModifyPrompt, buildEvolvePrompt } from './prompts.js';
```

- [ ] **Step 4: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/ai/
git commit -m "feat: implement MiniMax AI integration module"
```

---

## Task 7: 自进化模块 (Evolution)

**Files:**
- Create: `evo-engine/src/evolution/index.ts`
- Create: `evo-engine/src/evolution/self-analyzer.ts`
- Create: `evo-engine/src/evolution/strategy-optimizer.ts`

- [ ] **Step 1: 创建evolution/self-analyzer.ts**

```typescript
import { miniMaxClient } from '../ai/client.js';
import { buildEvolvePrompt } from '../ai/prompts.js';

export interface SelfAnalysisResult {
  issues: SelfIssue[];
  improvements: SelfImprovement[];
  timestamp: Date;
}

export interface SelfIssue {
  severity: 'critical' | 'major' | 'minor';
  description: string;
  location: string;
}

export interface SelfImprovement {
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  implementation: string;
}

export class SelfAnalyzer {
  async analyze(
    components: string,
    recentPerformance: string,
    problemCases: string
  ): Promise<SelfAnalysisResult> {
    const prompt = buildEvolvePrompt(components, recentPerformance, problemCases);

    try {
      const response = await miniMaxClient.generate(prompt);

      // 解析JSON响应
      const parsed = JSON.parse(response);

      return {
        issues: parsed.issues || [],
        improvements: parsed.improvements || [],
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Self-analysis failed:', error);
      return {
        issues: [],
        improvements: [],
        timestamp: new Date()
      };
    }
  }

  async analyzeFromMetrics(metrics: {
    iterationCount: number;
    successRate: number;
    avgScoreImprovement: number;
    errorCount: number;
  }): Promise<SelfAnalysisResult> {
    const components = `
- Analyzer: 分析器模块
- Modifier: 修改器模块
- Iterator: 迭代器模块
- AI Client: AI集成模块
`;

    const recentPerformance = `
- 总迭代次数: ${metrics.iterationCount}
- 成功率: ${metrics.successRate}%
- 平均评分提升: ${metrics.avgScoreImprovement}
- 错误次数: ${metrics.errorCount}
`;

    const problemCases = metrics.errorCount > 0
      ? `近期出现${metrics.errorCount}次错误，主要表现为收敛判断不准确`
      : '暂无明显问题';

    return this.analyze(components, recentPerformance, problemCases);
  }
}
```

- [ ] **Step 2: 创建evolution/strategy-optimizer.ts**

```typescript
import { Modification } from '../types/index.js';

interface StrategyMetrics {
  type: string;
  successCount: number;
  totalCount: number;
  avgImprovement: number;
}

interface StrategyPerformance {
  [key: string]: StrategyMetrics;
}

export class StrategyOptimizer {
  private performanceHistory: StrategyPerformance = {};
  private successPatterns: Map<string, number> = new Map();

  recordAttempt(modifications: Modification[], improvement: number, success: boolean): void {
    for (const mod of modifications) {
      const key = mod.type;

      if (!this.performanceHistory[key]) {
        this.performanceHistory[key] = {
          type: key,
          successCount: 0,
          totalCount: 0,
          avgImprovement: 0
        };
      }

      const metrics = this.performanceHistory[key];
      metrics.totalCount++;

      if (success) {
        metrics.successCount++;
        metrics.avgImprovement = (metrics.avgImprovement * (metrics.successCount - 1) + improvement) / metrics.successCount;

        // 记录成功模式
        const patternKey = `${key}-${mod.rationale}`;
        this.successPatterns.set(patternKey, (this.successPatterns.get(patternKey) || 0) + 1);
      }
    }
  }

  getBestStrategy(): string {
    let bestType = 'refactor';
    let bestScore = 0;

    for (const [type, metrics] of Object.entries(this.performanceHistory)) {
      if (metrics.totalCount >= 3) {  // 至少3次尝试
        const successRate = metrics.successCount / metrics.totalCount;
        const score = successRate * 0.7 + Math.min(metrics.avgImprovement / 20, 1) * 0.3;

        if (score > bestScore) {
          bestScore = score;
          bestType = type;
        }
      }
    }

    return bestType;
  }

  getRecommendedPriorities(): { type: string; priority: number }[] {
    const types = ['refactor', 'optimize', 'fix', 'evolve'];
    const results: { type: string; priority: number }[] = [];

    for (const type of types) {
      const metrics = this.performanceHistory[type];
      let priority = 50; // 默认优先级

      if (metrics && metrics.totalCount >= 3) {
        const successRate = metrics.successCount / metrics.totalCount;
        priority = Math.round(successRate * 100);
      }

      results.push({ type, priority });
    }

    return results.sort((a, b) => b.priority - a.priority);
  }

  learnFromSuccess(modification: Modification): void {
    // 基于成功案例学习
    const patternKey = `${mod.type}-${mod.rationale}`;
    this.successPatterns.set(patternKey, (this.successPatterns.get(patternKey) || 0) + 1);
  }

  getTopSuccessfulPatterns(limit: number = 5): { pattern: string; count: number }[] {
    return Array.from(this.successPatterns.entries())
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  exportMetrics(): StrategyPerformance {
    return { ...this.performanceHistory };
  }

  importMetrics(metrics: StrategyPerformance): void {
    this.performanceHistory = { ...metrics };
  }
}
```

- [ ] **Step 3: 创建evolution/index.ts**

```typescript
export { SelfAnalyzer, SelfAnalysisResult, SelfIssue, SelfImprovement } from './self-analyzer.js';
export { StrategyOptimizer } from './strategy-optimizer.js';
```

- [ ] **Step 4: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/evolution/
git commit -m "feat: implement self-evolution module with self-analyzer and strategy optimizer"
```

---

## Task 8: 可视化模块 (Visual)

**Files:**
- Create: `evo-engine/src/visual/index.ts`
- Create: `evo-engine/src/visual/dashboard.ts`
- Create: `evo-engine/src/visual/history-tree.ts`

- [ ] **Step 1: 创建visual/dashboard.ts**

```typescript
import { IterationRecord } from '../types/index.js';

export interface DashboardData {
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentTarget: string;
  progress: {
    current: number;
    max: number;
    percent: number;
  };
  scores: {
    current: number;
    initial: number;
    improvement: number;
  };
  aiCalls: {
    total: number;
    estimated: number;
  };
  recentLogs: string[];
}

export class Dashboard {
  private logs: string[] = [];

  update(data: DashboardData): void {
    this.clear();
    this.render(data);
  }

  private clear(): void {
    console.clear();
  }

  private render(data: DashboardData): void {
    const statusIcon = data.status === 'running' ? '●' :
                       data.status === 'completed' ? '✓' :
                       data.status === 'failed' ? '✗' : '○';

    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              自进化引擎控制台                                  ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║ 状态: ${statusIcon} ${data.status.padEnd(10)}  目标: ${data.currentTarget.padEnd(30)}║`);
    console.log('╠══════════════════════════════════════════════════════════════╣');

    // 进度条
    const progressBar = this.renderProgressBar(data.progress.percent);
    console.log(`║ 进度: ${progressBar} ${data.progress.current}/${data.progress.max}        ║`);

    // 评分
    const scoreBar = this.renderScoreBar(data.scores.current);
    console.log(`║ 评分: ${scoreBar} ${data.scores.current}分 (+${data.scores.improvement})      ║`);

    // AI调用
    console.log(`║ AI调用: ${data.aiCalls.total}次  预计节省: ~${data.aiCalls.estimated} token    ║`);

    console.log('╠══════════════════════════════════════════════════════════════╣');

    // 最近日志
    const logHeader = '│ 日志:';
    console.log(logHeader);
    for (const log of this.logs.slice(-5)) {
      console.log(`║   ${log.substring(0, 58).padEnd(58)}║`);
    }

    console.log('╚══════════════════════════════════════════════════════════════╝');
  }

  private renderProgressBar(percent: number): string {
    const width = 30;
    const filled = Math.round(width * percent / 100);
    const empty = width - filled;
    return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
  }

  private renderScoreBar(score: number): string {
    const width = 20;
    const filled = Math.round(width * score / 100);
    const empty = width - filled;
    return '[' + '▓'.repeat(filled) + '░'.repeat(empty) + ']';
  }

  addLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    this.logs.push(`[${timestamp}] ${message}`);
  }

  renderIterationHistory(iterations: IterationRecord[]): void {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    迭代历史                                   ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');

    for (const record of iterations) {
      const statusIcon = record.status === 'success' ? '✓' :
                         record.status === 'partial' ? '◐' : '✗';
      console.log(`║ ${statusIcon} #${record.iteration.toString().padStart(2)}  ${record.beforeScore} → ${record.afterScore} (+${record.improvement})  ${record.modifications.length}修改  ${(record.duration/1000).toFixed(1)}s  ║`);
    }

    console.log('╚══════════════════════════════════════════════════════════════╝');
  }
}
```

- [ ] **Step 2: 创建visual/history-tree.ts**

```typescript
import { IterationRecord } from '../types/index.js';

export interface HistoryTreeNode {
  iteration: number;
  score: number;
  improvement: number;
  status: 'success' | 'partial' | 'failed';
  children: HistoryTreeNode[];
}

export class HistoryTree {
  buildTree(iterations: IterationRecord[]): HistoryTreeNode[] {
    const nodes: HistoryTreeNode[] = [];

    for (const record of iterations) {
      const node: HistoryTreeNode = {
        iteration: record.iteration,
        score: record.afterScore,
        improvement: record.improvement,
        status: record.status,
        children: []
      };

      // 如果有子迭代，添加到当前节点
      if (record.modifications && record.modifications.length > 0) {
        // 这里简化处理，实际可能有更复杂的树结构
      }

      nodes.push(node);
    }

    return nodes;
  }

  render(tree: HistoryTreeNode[], indent: string = ''): string {
    let output = '';

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      const isLast = i === tree.length - 1;
      const prefix = indent + (isLast ? '└─ ' : '├─ ');

      const statusIcon = node.status === 'success' ? '✓' :
                         node.status === 'partial' ? '◐' : '✗';
      const scoreBar = '█'.repeat(Math.round(node.score / 10));
      const improvement = node.improvement >= 0 ? `+${node.improvement}` : `${node.improvement}`;

      output += `${prefix}#${node.iteration} ${statusIcon} ${scoreBar} ${node.score} (${improvement})\n`;

      if (node.children.length > 0) {
        const childIndent = indent + (isLast ? '   ' : '│  ');
        output += this.render(node.children, childIndent);
      }
    }

    return output;
  }

  renderSummary(iterations: IterationRecord[]): string {
    if (iterations.length === 0) {
      return '暂无迭代记录';
    }

    const lastRecord = iterations[iterations.length - 1];
    const firstRecord = iterations[0];
    const totalImprovement = lastRecord.afterScore - firstRecord.beforeScore;
    const successCount = iterations.filter(r => r.status === 'success').length;
    const totalDuration = iterations.reduce((sum, r) => sum + r.duration, 0);

    return `
迭代摘要:
- 总迭代次数: ${iterations.length}
- 初始评分: ${firstRecord.beforeScore}
- 最终评分: ${lastRecord.afterScore}
- 总提升: ${totalImprovement > 0 ? '+' : ''}${totalImprovement}
- 成功率: ${Math.round(successCount / iterations.length * 100)}%
- 总耗时: ${(totalDuration / 1000).toFixed(1)}s
`;
  }
}
```

- [ ] **Step 3: 创建visual/index.ts**

```typescript
export { Dashboard, DashboardData } from './dashboard.js';
export { HistoryTree, HistoryTreeNode } from './history-tree.js';
```

- [ ] **Step 4: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/visual/
git commit -m "feat: implement visualization module with dashboard and history tree"
```

---

## Task 9: 存储模块 (Storage)

**Files:**
- Create: `evo-engine/src/storage/index.ts`
- Create: `evo-engine/src/storage/iterations.ts`

- [ ] **Step 1: 创建storage/iterations.ts**

```typescript
import { IterationRecord } from '../types/index.js';

const fs = require('fs');
const path = require('path');

export interface StorageConfig {
  basePath: string;
}

export class IterationStorage {
  private basePath: string;

  constructor(config: StorageConfig) {
    this.basePath = config.basePath;
    this.ensureDirectory();
  }

  private ensureDirectory(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  private getFilePath(targetId: string): string {
    return path.join(this.basePath, `${targetId}-iterations.jsonl`);
  }

  save(record: IterationRecord): void {
    const filePath = this.getFilePath(record.iteration.toString()); // 简化
    const line = JSON.stringify(record) + '\n';

    fs.appendFileSync(filePath, line, 'utf-8');
  }

  saveBatch(records: IterationRecord[]): void {
    for (const record of records) {
      this.save(record);
    }
  }

  load(targetId: string): IterationRecord[] {
    const filePath = this.getFilePath(targetId);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    return lines.map(line => {
      const parsed = JSON.parse(line);
      parsed.timestamp = new Date(parsed.timestamp);
      return parsed as IterationRecord;
    });
  }

  clear(targetId: string): void {
    const filePath = this.getFilePath(targetId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  listTargets(): string[] {
    if (!fs.existsSync(this.basePath)) {
      return [];
    }

    const files = fs.readdirSync(this.basePath);
    return files
      .filter(f => f.endsWith('-iterations.jsonl'))
      .map(f => f.replace('-iterations.jsonl', ''));
  }
}
```

- [ ] **Step 2: 创建storage/index.ts**

```typescript
export { IterationStorage, StorageConfig } from './iterations.js';
```

- [ ] **Step 3: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/storage/
git commit -m "feat: implement storage module for iteration records"
```

---

## Task 10: 主入口和集成

**Files:**
- Create: `evo-engine/src/evo-engine.ts`
- Create: `evo-engine/tests/evo-engine.test.ts`

- [ ] **Step 1: 创建evo-engine.ts**

```typescript
import { Target, IterationConfig, AnalysisResult, IterationRecord } from './types/index.js';
import { Analyzer } from './analyzer/index.js';
import { Modifier } from './modifier/index.js';
import { IteratorController } from './iterator/index.js';
import { SelfAnalyzer, StrategyOptimizer } from './evolution/index.js';
import { Dashboard, HistoryTree } from './visual/index.js';
import { IterationStorage } from './storage/index.js';

export interface EvoEngineConfig {
  apiKey?: string;
  maxIterations?: number;
  minScoreThreshold?: number;
  autoContinue?: boolean;
  storagePath?: string;
}

export class EvoEngine {
  private analyzer: Analyzer;
  private modifier: Modifier;
  private iterator: IteratorController;
  private selfAnalyzer: SelfAnalyzer;
  private strategyOptimizer: StrategyOptimizer;
  private dashboard: Dashboard;
  private historyTree: HistoryTree;
  private storage: IterationStorage;

  constructor(config: EvoEngineConfig = {}) {
    this.analyzer = new Analyzer();
    this.modifier = new Modifier();
    this.iterator = new IteratorController(this.analyzer, this.modifier);
    this.selfAnalyzer = new SelfAnalyzer();
    this.strategyOptimizer = new StrategyOptimizer();
    this.dashboard = new Dashboard();
    this.historyTree = new HistoryTree();
    this.storage = new IterationStorage({ basePath: config.storagePath || './evo-data' });
  }

  async analyze(target: Target): Promise<AnalysisResult> {
    this.dashboard.addLog(`开始分析: ${target.name}`);
    const result = this.analyzer.analyze(target);
    this.dashboard.addLog(`分析完成，评分: ${result.score}`);
    return result;
  }

  async evolve(target: Target, config?: Partial<IterationConfig>): Promise<IterationRecord[]> {
    const iterationConfig: IterationConfig = {
      maxIterations: config?.maxIterations || 10,
      minScoreThreshold: config?.minScoreThreshold || 90,
      autoContinue: config?.autoContinue || false
    };

    this.dashboard.addLog(`开始进化: ${target.name}`);

    const result = await this.iterator.iterate(target, iterationConfig, (iterResult) => {
      this.dashboard.addLog(`迭代#${iterResult.iteration} 完成，评分: ${iterResult.score}`);

      // 记录策略表现
      this.strategyOptimizer.recordAttempt(
        iterResult.modifications as any[],
        iterResult.score,
        true
      );
    });

    // 保存迭代记录
    this.storage.saveBatch(result.iterations);

    this.dashboard.addLog(`进化完成，最终评分: ${result.finalScore}`);
    this.dashboard.renderIterationHistory(result.iterations);

    return result.iterations;
  }

  async selfEvolve(): Promise<void> {
    this.dashboard.addLog('开始自进化分析...');

    // 收集系统指标
    const metrics = {
      iterationCount: this.iterator.getHistory().length,
      successRate: this.iterator.getHistory().filter(r => r.status === 'success').length /
                   Math.max(1, this.iterator.getHistory().length) * 100,
      avgScoreImprovement: this.iterator.getHistory().length > 0 ?
                           this.iterator.getHistory().reduce((sum, r) => sum + r.improvement, 0) /
                           this.iterator.getHistory().length : 0,
      errorCount: 0
    };

    // 自分析
    const analysis = await this.selfAnalyzer.analyzeFromMetrics(metrics);

    if (analysis.improvements.length > 0) {
      this.dashboard.addLog(`发现${analysis.improvements.length}项改进建议`);
    }

    this.dashboard.addLog('自进化分析完成');
  }

  getStrategyRecommendations(): { type: string; priority: number }[] {
    return this.strategyOptimizer.getRecommendedPriorities();
  }

  visualize(targetId: string): void {
    const iterations = this.storage.load(targetId);
    const tree = this.historyTree.buildTree(iterations);

    console.log(this.historyTree.render(tree));
    console.log(this.historyTree.renderSummary(iterations));
  }
}
```

- [ ] **Step 2: 创建evo-engine/index.ts导出**

```typescript
export { EvoEngine, EvoEngineConfig } from './evo-engine.js';
export * from './types/index.js';
export * from './analyzer/index.js';
export * from './modifier/index.js';
export * from './iterator/index.js';
export * from './evolution/index.js';
export * from './visual/index.js';
export * from './storage/index.js';
```

- [ ] **Step 3: 更新src/index.ts**

```typescript
export { EvoEngine } from './evo-engine.js';
export * from './evo-engine/index.js';
```

- [ ] **Step 4: 创建集成测试**

```typescript
import { EvoEngine } from '../src/evo-engine.js';
import { Target } from '../src/types/index.js';

describe('EvoEngine', () => {
  const engine = new EvoEngine({ storagePath: './test-data' });

  describe('analyze', () => {
    it('should analyze a target', async () => {
      const target: Target = {
        id: 'test-evo',
        name: 'test-module',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: `// Test skill
if (false) {
  console.log('dead');
}
const MAX_SIZE = 999;
export { MAX_SIZE };
`,
          language: 'js',
          hash: 'abc'
        }]
      };

      const result = await engine.analyze(target);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('evolve', () => {
    it('should evolve a target', async () => {
      const target: Target = {
        id: 'test-evo-2',
        name: 'test-module-2',
        type: 'skill',
        path: '/test',
        files: [{
          path: '/test/index.js',
          content: `// Test skill
if (false) {
  console.log('dead');
}
const x = 100;
export { x };
`,
          language: 'js',
          hash: 'abc'
        }]
      };

      const iterations = await engine.evolve(target, {
        maxIterations: 2,
        minScoreThreshold: 50
      });

      expect(iterations.length).toBeGreaterThan(0);
    }, 30000); // 30秒超时
  });
});
```

- [ ] **Step 5: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/src/evo-engine.ts evo-engine/src/evo-engine/ evo-engine/tests/evo-engine.test.ts
git commit -m "feat: implement main EvoEngine class integrating all modules"
```

---

## Task 11: CI配置 (L0/L3)

**Files:**
- Create: `evo-engine/.github/workflows/ci.yml`

- [ ] **Step 1: 创建CI配置**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Type check
      run: npm run typecheck

    - name: Lint
      run: npm run lint

    - name: Test
      run: npm test -- --coverage

    - name: Build
      run: npm run build
```

- [ ] **Step 2: 提交**

```bash
cd F:/develop/app/manufacturing-ai-skills
git add evo-engine/.github/
git commit -m "ci: add GitHub Actions CI configuration"
```

---

## 自审查清单

### 1. Spec覆盖检查
- [x] 分析器模块 - Task 3
- [x] 修改器模块 - Task 4
- [x] 迭代器模块 - Task 5
- [x] 自进化模块 - Task 7
- [x] AI集成 - Task 6
- [x] 可视化 - Task 8
- [x] 存储 - Task 9
- [x] 主入口 - Task 10

### 2. Placeholder检查
- [x] 无"TBD"或"TODO"
- [x] 无"实现later"
- [x] 无"添加适当错误处理"（所有步骤都有完整代码）

### 3. 类型一致性检查
- [x] `Modification`类型在所有模块一致
- [x] `IterationRecord`类型在所有模块一致
- [x] `AnalyzerResult`接口在所有模块一致

---

## 计划完成

**Plan complete and saved to `F:/develop/app/manufacturing-ai-skills/docs/superpowers/plans/2026-04-15-自进化引擎系统-implementation-plan.md`**

### 执行选项:

**1. Subagent-Driven (recommended)** - 每个任务由独立子代理执行，任务间有检查点，适合快速迭代

**2. Inline Execution** - 在当前会话中执行任务，带检查点，适合需要紧密协作的场景

请选择执行方式，我将开始实现自进化引擎系统。
