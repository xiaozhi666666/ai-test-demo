# 架构设计文档

本文档详细说明项目的架构设计和实现细节。

## 设计目标

### 核心原则

1. **关注点分离**: AI 配置与业务代码完全解耦
2. **可扩展性**: 易于添加新的 AI 提供商或审查流程
3. **可维护性**: 清晰的目录结构和文档
4. **自动化**: 最小化人工干预，最大化效率

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub Repository                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │   ai-config/ │      │     tasks/   │                     │
│  │              │      │              │                     │
│  │  ├─ codex/   │      │ ├─ current.md│ (trigger)          │
│  │  └─ claude/  │      │ ├─ queue.md  │                     │
│  └──────────────┘      │ └─ completed │                     │
│                        └──────────────┘                     │
│         ↓                     ↓                              │
│  ┌─────────────────────────────────────────┐               │
│  │      GitHub Actions Workflow             │               │
│  │                                          │               │
│  │  1. Parse tasks/current.md              │               │
│  │  2. Call OpenAI API (Codex)             │               │
│  │  3. Generate code in src/problems/      │               │
│  │  4. Run tests                           │               │
│  │  5. Create Pull Request                 │               │
│  └─────────────────────────────────────────┘               │
│         ↓                                                    │
│  ┌─────────────────────────────────────────┐               │
│  │         Pull Request Created             │               │
│  │      (labeled: codex-generated)          │               │
│  └─────────────────────────────────────────┘               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │  Claude Code (Local Review)    │
         │                                │
         │  1. Checkout PR                │
         │  2. Review code quality        │
         │  3. Run tests locally          │
         │  4. Approve/Request changes    │
         │  5. Merge PR                   │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │    Update tasks/completed.md   │
         │    Select next task            │
         │    Update tasks/current.md     │
         └───────────────────────────────┘
                         ↓
                    (循环继续)
```

## 目录结构设计

### ai-config/

**目的**: 集中管理所有 AI 相关配置

```
ai-config/
├── codex/                    # Codex (OpenAI) 配置
│   ├── system-prompt.md     # 系统提示词（核心）
│   ├── workflow.md          # 工作流说明文档
│   └── pr-template.md       # PR 描述模板
└── claude/                   # Claude Code 配置
    ├── review-guide.md      # 代码审查指南（核心）
    └── commands.md          # 快捷命令参考
```

**设计考虑**:
- 提示词独立文件，便于版本控制和优化
- 支持多个 AI 提供商（未来可添加 claude-api/ 等）
- 文档化工作流程，便于团队协作

### tasks/

**目的**: 任务生命周期管理

```
tasks/
├── current.md       # 当前任务（Git 监控触发器）
├── queue.md         # 任务队列（待处理）
├── completed.md     # 已完成任务（归档）
└── template.md      # 任务模板
```

**工作流**:
1. 从 `queue.md` 选择任务
2. 填写到 `current.md`
3. Git push 触发 Codex
4. 完成后移至 `completed.md`

### src/

**目的**: 纯业务代码，与 AI 配置解耦

```
src/
├── problems/              # LeetCode 题目实现
│   ├── easy-001-two-sum.ts
│   ├── medium-015-3sum.ts
│   └── README.md
└── utils/                 # 工具函数
    └── test-runner.ts    # 测试框架
```

**设计考虑**:
- 按难度和题号命名，易于查找
- 每个文件自包含（代码 + 测试）
- 统一的测试框架

### .github/workflows/

**目的**: CI/CD 自动化

```
.github/workflows/
├── codex-worker.yml       # Codex 执行流程
└── claude-review.yml      # Claude 审查触发器
```

## 核心组件

### 1. Codex Worker (GitHub Actions)

**触发条件**:
- `tasks/current.md` 文件变更
- 手动触发 (workflow_dispatch)

**执行流程**:
```yaml
jobs:
  codex-generate:
    steps:
      - Checkout Repository
      - Setup Node.js
      - Parse Task Information (从 current.md)
      - Generate Code with OpenAI (调用 GPT-4)
      - Run Tests (验证代码)
      - Create Pull Request (自动 PR)
      - Comment on Test Failure (如果失败)
```

**关键实现**:

```bash
# 解析任务信息
PROBLEM_NUMBER=$(grep "Problem:" tasks/current.md | awk '{print $NF}')
PROBLEM_TITLE=$(grep "Title:" tasks/current.md | awk -F': ' '{print $NF}')
DIFFICULTY=$(grep "Difficulty:" tasks/current.md | awk '{print $NF}')

# 调用 OpenAI API
curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "system", "content": "'"$SYSTEM_PROMPT"'"},
      {"role": "user", "content": "'"$TASK_CONTENT"'"}
    ]
  }'
```

### 2. Claude Code Review

**触发条件**:
- PR 被标记为 `codex-generated`
- 人工在 CLI 中触发

**审查流程**:
```bash
# 1. 获取 PR 列表
gh pr list --label "codex-generated"

# 2. 检出 PR 代码
gh pr checkout {PR_NUMBER}

# 3. 运行测试
npm test

# 4. 审查代码（参考 review-guide.md）
# - 算法正确性
# - 时间复杂度
# - 代码质量
# - 测试覆盖

# 5. 批准或请求修改
gh pr review {PR_NUMBER} --approve

# 6. 合并 PR
gh pr merge {PR_NUMBER} --squash
```

### 3. Test Runner

**设计**:
```typescript
class TestRunner<T, R> {
  addTest(input: T, expected: R): void
  run(solution: (input: T) => R): void
  private deepEqual(a: any, b: any): boolean
  private printSummary(): void
}
```

**特性**:
- 泛型支持任意输入/输出类型
- 深度相等比较（支持数组、对象）
- 性能测量（执行时间）
- 美化输出（通过/失败状态）

## 数据流

### 任务创建流

```
User → tasks/current.md → Git Push
  → GitHub Actions Trigger
  → Parse Task
  → OpenAI API Call
  → Generate Code
  → Create PR
```

### 审查流

```
PR Created → GitHub Notification
  → Claude Code Checkout
  → Local Tests
  → Code Review
  → Approve/Request Changes
  → Merge → Update Completed
```

## 扩展性设计

### 添加新的 AI 提供商

1. 在 `ai-config/` 创建新目录：
   ```
   ai-config/
   └── anthropic/
       ├── system-prompt.md
       └── workflow.md
   ```

2. 创建对应的 GitHub Actions workflow:
   ```yaml
   .github/workflows/anthropic-worker.yml
   ```

3. 更新 README 和文档

### 添加新的测试框架

1. 在 `src/utils/` 创建新的测试工具：
   ```typescript
   src/utils/
   ├── test-runner.ts          # 现有
   └── performance-tester.ts   # 新增
   ```

2. 在题目文件中导入使用：
   ```typescript
   import { PerformanceTester } from '../utils/performance-tester';
   ```

### 添加新的任务类型

除了 LeetCode，还可以支持：

1. 创建新的任务目录：
   ```
   tasks/
   ├── leetcode/      # 现有任务移至此处
   │   ├── current.md
   │   └── queue.md
   └── project/       # 新任务类型
       ├── current.md
       └── queue.md
   ```

2. 更新 GitHub Actions 以支持不同路径触发

## 安全考虑

### Secrets 管理

- **OPENAI_API_KEY**: 使用 GitHub Secrets 存储
- 不在代码或日志中暴露
- 定期轮换密钥

### 权限控制

- GitHub Actions 使用最小权限
- PR 自动合并需人工审查批准
- 代码执行在沙盒环境

### Code Review

- 所有 AI 生成的代码必须经过审查
- 自动化测试验证功能正确性
- 人工审查确保代码质量和安全性

## 性能优化

### GitHub Actions

- 使用缓存减少依赖安装时间
- 并行运行独立步骤
- 合理的超时设置

### 代码生成

- 使用 GPT-4（更高质量）
- Temperature 0.3（平衡创造性和确定性）
- 限制 max_tokens 避免过长响应

### 测试执行

- 单元测试快速反馈
- 性能测试可选执行
- 失败快速返回

## 未来改进

### 短期

- [ ] 添加更多 LeetCode 题目模板
- [ ] 支持多种编程语言
- [ ] 改进错误处理和重试机制

### 中期

- [ ] 集成 LeetCode API 自动获取题目
- [ ] 添加代码质量度量（覆盖率、复杂度）
- [ ] 支持自定义测试数据生成

### 长期

- [ ] 支持协作学习（多人使用）
- [ ] 添加学习分析和进度追踪
- [ ] AI 自动优化和迭代
- [ ] 集成 IDE 插件

## 参考资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Claude Code 文档](https://docs.anthropic.com/claude/docs/claude-code)
- [LeetCode API](https://github.com/leetcode/leetcode-api)
