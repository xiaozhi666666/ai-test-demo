# AI-Powered Development Workflow

这个项目演示了一个完全自动化的开发工作流，其中：
- **Claude Code** 作为项目管理者，维护 `task.md` 并进行 PR 审查
- **Codex** 作为执行者，完成 `task.md` 中的任务并提交 PR

## 工作流程

```
┌─────────────────┐
│  Claude Code    │
│  维护 task.md   │
└────────┬────────┘
         │
         │ 1. 更新 task.md，添加新任务
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ 监听 task.md    │
└────────┬────────┘
         │
         │ 2. 检测到变化，触发 workflow
         │
         ▼
┌─────────────────┐
│     Codex       │
│   执行任务      │
└────────┬────────┘
         │
         │ 3. 完成代码，创建 PR
         │
         ▼
┌─────────────────┐
│  Claude Code    │
│   Review PR     │
└────────┬────────┘
         │
         ├─ 4a. 通过 ──→ 合并 PR，添加新任务到 task.md ──┐
         │                                              │
         └─ 4b. 不通过 ──→ 更新 task.md，添加反馈 ────┘
                                                        │
                                                        └──→ 回到步骤 2
```

## 设置步骤

### 1. GitHub 仓库设置

首先，需要创建 GitHub 仓库并推送代码：

```bash
# 设置远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 创建并切换到 main 分支
git branch -M main

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: Setup AI-powered workflow"

# 推送到 GitHub
git push -u origin main
```

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 secrets：

1. 进入仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 添加 **New repository secret**：
   - Name: `ANTHROPIC_API_KEY`
   - Value: 你的 Anthropic API Key

### 3. 设置 GitHub Actions 权限

1. 进入 **Settings** → **Actions** → **General**
2. 在 **Workflow permissions** 部分：
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
3. 点击 **Save**

### 4. 本地安装 GitHub CLI（用于 Claude Code）

```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.cli

# 登录
gh auth login
```

## 使用方法

### Claude Code 的角色

作为 Claude Code，你需要：

1. **监控 PR**：使用 GitHub MCP 或运行脚本
   ```bash
   .github/scripts/claude-review.sh list
   ```

2. **审查 PR**：
   ```bash
   # 查看 PR 详情
   gh pr view <PR_NUMBER>

   # 查看 diff
   gh pr diff <PR_NUMBER>
   ```

3. **批准并合并**（如果通过）：
   ```bash
   gh pr review <PR_NUMBER> --approve
   gh pr merge <PR_NUMBER> --squash
   ```

4. **添加新任务到 task.md**：
   编辑 `task.md`，在 "Current Task" 部分添加新任务，然后提交：
   ```bash
   git add task.md
   git commit -m "Add new task: [任务描述]"
   git push
   ```

5. **请求修改**（如果不通过）：
   ```bash
   gh pr review <PR_NUMBER> --request-changes --body "反馈内容"
   ```
   然后更新 `task.md` 添加修复任务。

### Codex 的角色

Codex 由 GitHub Actions 自动触发，会：

1. 读取 `task.md` 中的当前任务
2. 分析需求并实现代码
3. 创建新分支并提交更改
4. 自动创建 PR

你不需要手动运行 Codex，它会在 `task.md` 更新时自动执行。

## 文件说明

- [task.md](task.md) - 任务管理文件，定义待完成的任务
- [.github/workflows/codex-task-runner.yml](.github/workflows/codex-task-runner.yml) - GitHub Actions 配置，自动触发 Codex
- [.github/scripts/claude-review.sh](.github/scripts/claude-review.sh) - Claude Code 用于 PR 审查的辅助脚本

## task.md 格式

```markdown
## Current Task

### Task N: [任务标题]

**Status**: pending

**Description**:
[详细描述任务需求]

**Requirements**:
- 需求 1
- 需求 2

**Acceptance Criteria**:
- [ ] 标准 1
- [ ] 标准 2
```

## 示例工作流

### 场景：添加新功能

1. **Claude Code** 编辑 `task.md`：
   ```markdown
   ### Task 2: Add subtract function
   **Status**: pending
   **Description**: Create a subtract function in math.js
   ```

2. **推送更改**：
   ```bash
   git add task.md
   git commit -m "Add task: subtract function"
   git push
   ```

3. **GitHub Actions** 自动触发 Codex

4. **Codex** 完成任务并创建 PR

5. **Claude Code** 使用 GitHub MCP 监控 PR：
   ```bash
   gh pr list --label codex-bot
   ```

6. **Claude Code** 审查代码：
   ```bash
   gh pr view 1
   gh pr diff 1
   ```

7. **如果通过**：
   ```bash
   gh pr review 1 --approve
   gh pr merge 1 --squash
   # 然后添加下一个任务到 task.md
   ```

8. **如果需要修改**：
   ```bash
   gh pr review 1 --request-changes --body "需要添加错误处理"
   # 然后更新 task.md 添加修复任务
   ```

## 注意事项

1. **权限控制**：Codex 只能执行 `task.md` 中定义的任务，不能越权
2. **PR 提交**：只有 Codex 可以自动提交 PR
3. **任务管理**：只有 Claude Code 应该修改 `task.md`
4. **代码审查**：所有 Codex 的 PR 都必须经过 Claude Code 审查

## 故障排查

### GitHub Actions 失败

1. 检查 Actions 日志：仓库的 **Actions** 标签
2. 确认 `ANTHROPIC_API_KEY` 已正确设置
3. 确认权限设置正确

### PR 创建失败

1. 检查是否有权限创建 PR
2. 确认分支命名没有冲突
3. 查看 Actions 日志中的错误信息

## 扩展功能

可以添加的增强功能：

- [ ] 自动运行测试
- [ ] 代码质量检查（ESLint, Prettier）
- [ ] 自动生成变更日志
- [ ] Slack/Discord 通知
- [ ] 任务优先级管理
- [ ] 多任务并行处理

## License

MIT
