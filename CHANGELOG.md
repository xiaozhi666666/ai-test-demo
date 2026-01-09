# 更新日志

项目的所有重要更改都会记录在此文件中。

## [1.0.0] - 2026-01-09

### ✨ 新功能

#### 项目结构
- 创建清晰的目录结构，实现 AI 配置与业务代码分离
- **ai-config/**: 集中管理 Codex 和 Claude 配置
- **src/**: 纯业务代码（LeetCode 题目实现）
- **tasks/**: 独立的任务管理系统
- **docs/**: 完整的文档体系

#### AI 配置
- **Codex 配置** (`ai-config/codex/`)
  - `system-prompt.md`: 系统提示词，定义代码生成规范
  - `workflow.md`: 详细工作流说明
  - `pr-template.md`: PR 描述模板

- **Claude Code 配置** (`ai-config/claude/`)
  - `review-guide.md`: 完整的代码审查指南
  - `commands.md`: 常用命令速查表

#### 任务管理
- `tasks/current.md`: 当前任务（Git 监控触发器）
- `tasks/queue.md`: 任务队列和优先级管理
- `tasks/completed.md`: 已完成任务归档
- `tasks/template.md`: 标准任务模板

#### 自动化工作流
- **Codex Worker** (`.github/workflows/codex-worker.yml`)
  - 监控 `tasks/current.md` 变更
  - 自动调用 OpenAI API 生成代码
  - 运行测试验证
  - 自动创建 Pull Request
  - 改进：标签不存在时优雅降级

- **Claude Review Trigger** (`.github/workflows/claude-review.yml`)
  - 自动通知 PR 需要审查
  - 提供详细的审查步骤说明
  - 支持通过 PR 标题识别 Codex PR

#### 工具和脚本
- **Test Runner** (`src/utils/test-runner.ts`)
  - 泛型测试框架
  - 支持深度相等比较
  - 性能测量功能
  - 美化输出

- **Label Creator** (`.github/scripts/create-labels.sh`)
  - 一键创建所需的 GitHub 标签
  - 自动检查 gh CLI 和认证状态
  - 幂等性设计（可重复运行）

#### 文档
- **README.md**: 完整的项目说明和快速开始指南
- **docs/SETUP.md**: 详细的设置步骤和验证流程
- **docs/ARCHITECTURE.md**: 架构设计文档和扩展指南
- **docs/TROUBLESHOOTING.md**: 完整的故障排查指南

### 🔧 改进

#### GitHub Actions 工作流
- **修复标签问题**:
  - PR 创建时标签不存在不再导致失败
  - 使用 `2>/dev/null || echo` 优雅处理标签错误
  - 通过 PR 标题识别 Codex PR（不依赖标签）

- **改进错误处理**:
  - 所有步骤添加 `continue-on-error`
  - 详细的日志输出
  - 失败时自动添加评论

- **优化 PR 创建**:
  - 捕获 PR URL 和编号
  - 更好的 PR 描述格式
  - 包含测试结果和时间戳

#### 代码质量
- 添加 TypeScript 配置
- 统一的代码风格
- 完整的类型定义
- 示例代码模板

#### 用户体验
- 清晰的快速开始步骤
- 详细的故障排查文档
- 命令速查表
- 可视化的项目结构图

### 📚 文档更新

#### 新增文档
1. **TROUBLESHOOTING.md**
   - GitHub Actions 问题解决
   - 标签相关问题
   - OpenAI API 问题
   - 测试问题
   - PR 创建问题

2. **ARCHITECTURE.md**
   - 设计目标和原则
   - 完整架构图
   - 核心组件说明
   - 数据流分析
   - 扩展性设计

3. **SETUP.md**
   - 详细设置步骤
   - 验证流程
   - 常见问题

#### 更新文档
- **README.md**
  - 添加标签创建步骤
  - 添加快速故障排查
  - 添加文档链接
  - 改进快速开始流程

### 🐛 修复

#### 关键修复
1. **标签不存在导致 PR 创建失败** ✅
   - 问题: `could not add label: 'codex-generated' not found`
   - 解决: 添加标签时使用错误重定向和回退
   - 影响: PR 现在可以正常创建，无论标签是否存在

2. **工作流权限问题** ✅
   - 添加详细的权限配置说明
   - 更新 README 和 SETUP 文档

3. **测试执行问题** ✅
   - 添加 `continue-on-error: true`
   - 测试失败不影响 PR 创建
   - 失败时自动添加评论

### 🎯 功能特性

#### 核心特性
- ✅ 自动化代码生成（Codex）
- ✅ 人工代码审查（Claude Code）
- ✅ 自动化测试执行
- ✅ PR 自动创建和管理
- ✅ 任务队列管理
- ✅ 完整的文档体系

#### 可选特性
- ⚪️ GitHub 标签支持（可选）
- ⚪️ 性能测试（已实现但可选）
- ⚪️ 代码覆盖率（预留接口）

### 📦 依赖

#### 运行时依赖
- Node.js >= 18.0.0
- TypeScript 5.3.3
- ts-node 10.9.2

#### 可选依赖
- GitHub CLI (gh) - 用于 PR 管理
- OpenAI API Key - 用于代码生成

### 🚀 使用示例

#### 基本使用
```bash
# 1. 配置 Secrets
# Settings → Secrets → Actions → New secret
# Name: OPENAI_API_KEY
# Value: sk-...

# 2. 创建标签（可选）
./.github/scripts/create-labels.sh

# 3. 安装依赖
npm install

# 4. 添加任务
# 编辑 tasks/current.md

# 5. 推送触发
git add tasks/current.md
git commit -m "task: add LeetCode #1"
git push

# 6. 审查 PR（在 Claude Code CLI 中）
gh pr list
gh pr checkout 1
npm test
gh pr review 1 --approve
gh pr merge 1 --squash
```

### 🔮 未来计划

#### 短期 (v1.1)
- [ ] 添加更多 LeetCode 题目模板
- [ ] 支持多种编程语言
- [ ] 改进错误处理和重试机制
- [ ] 添加统计脚本

#### 中期 (v1.2)
- [ ] 集成 LeetCode API 自动获取题目
- [ ] 添加代码质量度量
- [ ] 支持自定义测试数据生成
- [ ] 添加性能基准测试

#### 长期 (v2.0)
- [ ] 支持协作学习模式
- [ ] 添加学习分析和进度追踪
- [ ] AI 自动优化和迭代
- [ ] IDE 插件集成

### 🙏 致谢

感谢以下项目和服务：
- [OpenAI](https://openai.com/) - Codex API
- [Anthropic](https://anthropic.com/) - Claude Code
- [LeetCode](https://leetcode.com/) - 算法题库
- [GitHub Actions](https://github.com/features/actions) - CI/CD 平台

---

## 版本说明

本项目遵循 [语义化版本](https://semver.org/) 规范：

- **主版本号**: 不兼容的 API 更改
- **次版本号**: 向后兼容的功能性新增
- **修订号**: 向后兼容的问题修正

## 贡献

欢迎贡献！请查看 [贡献指南](README.md#贡献指南)。
