# 详细设置指南

本文档提供完整的项目设置步骤。

## 目录

- [前置要求](#前置要求)
- [GitHub 设置](#github-设置)
- [本地环境设置](#本地环境设置)
- [Claude Code 设置](#claude-code-设置)
- [验证设置](#验证设置)

## 前置要求

### 必需
- Node.js >= 18.0.0
- Git
- GitHub 账号
- OpenAI API Key

### 推荐
- GitHub CLI (`gh`)
- Claude Code CLI

## GitHub 设置

### 1. 创建仓库

```bash
# 如果是新项目
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. 配置 Secrets

进入仓库的 `Settings → Secrets and variables → Actions`：

#### 必需的 Secrets

**OPENAI_API_KEY**
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key
3. 复制密钥
4. 在 GitHub 添加 Secret：
   - Name: `OPENAI_API_KEY`
   - Value: `sk-...`

#### 可选的 Secrets

**PAT_TOKEN** (如果需要更高权限)
1. 访问 https://github.com/settings/tokens
2. 生成新 token (classic)
3. 选择权限：
   - ✅ `repo` (完整仓库访问)
   - ✅ `workflow` (更新工作流)
4. 复制 token
5. 添加 Secret：
   - Name: `PAT_TOKEN`
   - Value: `ghp_...`

### 3. 配置 Actions 权限

进入 `Settings → Actions → General`:

#### Workflow permissions
- 选择：**Read and write permissions**
- 勾选：**Allow GitHub Actions to create and approve pull requests**

#### Actions permissions
- 选择：**Allow all actions and reusable workflows**

### 4. 启用 Actions

1. 进入 `Actions` 标签页
2. 点击 **I understand my workflows, go ahead and enable them**

## 本地环境设置

### 1. 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. 安装依赖

```bash
npm install
```

### 3. 验证安装

```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18.0.0

# 检查 Git 版本
git --version

# 检查 GitHub CLI（可选）
gh --version
```

### 4. 配置 Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Claude Code 设置

### 1. 安装 Claude Code

参考官方文档：https://docs.anthropic.com/claude/docs/claude-code

### 2. 安装 GitHub CLI

**macOS:**
```bash
brew install gh
```

**Windows:**
```bash
winget install --id GitHub.cli
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora
sudo dnf install gh
```

### 3. 登录 GitHub CLI

```bash
gh auth login
```

选择：
- 账号类型：GitHub.com
- 认证方式：Login with a web browser

### 4. 配置 Claude Code 项目

在项目根目录创建或编辑 `.claude/settings.local.json`:

```json
{
  "projectName": "LeetCode AI 自动化练习",
  "aiConfig": {
    "codexPrompt": "./ai-config/codex/system-prompt.md",
    "reviewGuide": "./ai-config/claude/review-guide.md"
  }
}
```

## 验证设置

### 1. 测试 GitHub Actions

手动触发一次工作流：

```bash
# 使用 GitHub CLI
gh workflow run codex-worker.yml

# 或在 GitHub UI 中
# Actions → Codex Worker → Run workflow
```

### 2. 检查工作流状态

```bash
# 查看最近的运行
gh run list --workflow=codex-worker.yml --limit 5

# 查看特定运行的日志
gh run view <RUN_ID> --log
```

### 3. 测试本地代码

```bash
# 运行示例测试
npm test

# 运行单个文件
npm run test:single src/problems/example-template.ts
```

### 4. 测试 PR 创建

创建一个测试任务：

```bash
# 1. 编辑任务文件
cat > tasks/current.md << 'EOF'
# Current Task

## Status
⏳ Pending

## Task Information
- **Problem**: 1
- **Title**: Two Sum
- **Difficulty**: Easy
- **Link**: https://leetcode.com/problems/two-sum/

## Description
Test task to verify setup.

## Requirements
- Test implementation
EOF

# 2. 提交并推送
git add tasks/current.md
git commit -m "test: verify Codex workflow"
git push

# 3. 检查 Actions 是否触发
gh run list --workflow=codex-worker.yml
```

### 5. 测试 Claude Code 审查

如果 PR 创建成功：

```bash
# 1. 列出 PR
gh pr list --label "codex-generated"

# 2. 检出 PR（使用实际的 PR 编号）
gh pr checkout 1

# 3. 查看改动
gh pr diff 1

# 4. 审查 PR
gh pr review 1 --approve --body "✅ Setup test successful!"

# 5. 合并 PR
gh pr merge 1 --squash --delete-branch
```

## 常见问题

### Actions 无法创建 PR

**原因**: 权限不足

**解决**:
1. 检查 Workflow permissions 设置
2. 确保勾选了 "Allow GitHub Actions to create and approve pull requests"
3. 如需要，使用 PAT_TOKEN 代替默认 GITHUB_TOKEN

### OpenAI API 调用失败

**原因**: API Key 无效或配额不足

**解决**:
1. 验证 API Key 是否正确
2. 检查 OpenAI 账户余额
3. 查看 Actions 日志中的具体错误

### 测试无法运行

**原因**: 依赖未安装

**解决**:
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### GitHub CLI 认证失败

**原因**: Token 过期或权限不足

**解决**:
```bash
# 重新登录
gh auth logout
gh auth login

# 刷新认证
gh auth refresh
```

## 下一步

设置完成后，请查看：

- [使用指南](../README.md#使用指南) - 学习如何使用系统
- [AI 配置说明](../ai-config/) - 了解 AI 配置细节
- [故障排查](../README.md#故障排查) - 解决常见问题

## 获取帮助

遇到问题？

1. 查看 [故障排查](../README.md#故障排查)
2. 搜索 [Issues](https://github.com/xiaozhi/ai-demo/issues)
3. 创建新 Issue 并提供：
   - 详细的错误信息
   - 你的环境信息
   - 重现步骤
