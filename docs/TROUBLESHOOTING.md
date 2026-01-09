# 故障排查指南

常见问题和解决方案。

## 目录

- [GitHub Actions 问题](#github-actions-问题)
- [标签相关问题](#标签相关问题)
- [OpenAI API 问题](#openai-api-问题)
- [测试问题](#测试问题)
- [PR 创建问题](#pr-创建问题)

---

## GitHub Actions 问题

### ❌ Error: could not add label: 'codex-generated' not found

**问题描述**：
```
Run gh pr create
could not add label: 'codex-generated' not found
Error: Process completed with exit code 1.
```

**原因**：
仓库中还没有创建 `codex-generated` 标签。

**解决方案**：

**方法 1：使用自动脚本（推荐）**
```bash
# 在项目根目录运行
./.github/scripts/create-labels.sh
```

**方法 2：手动创建标签**

1. 进入仓库的 `Issues` 或 `Pull Requests` 页面
2. 点击 `Labels`
3. 点击 `New label`
4. 创建以下标签：

| 名称 | 描述 | 颜色代码 |
|------|------|---------|
| `codex-generated` | PR created by Codex automation | `0E8A16` |
| `test-failed` | Tests failed for this PR | `D93F0B` |
| `claude-reviewed` | Reviewed by Claude Code | `1D76DB` |
| `ready-to-merge` | Approved and ready to merge | `0075CA` |

**方法 3：使用 GitHub CLI**
```bash
gh label create "codex-generated" --description "PR created by Codex automation" --color "0E8A16"
gh label create "test-failed" --description "Tests failed for this PR" --color "D93F0B"
gh label create "claude-reviewed" --description "Reviewed by Claude Code" --color "1D76DB"
gh label create "ready-to-merge" --description "Approved and ready to merge" --color "0075CA"
```

**注意**：
系统已经配置为即使标签不存在也能正常工作（会跳过添加标签的步骤）。标签主要用于：
- 更好地组织和过滤 PR
- 触发特定的自动化工作流

---

### ❌ Actions 未触发

**问题描述**：
推送 `tasks/current.md` 后，GitHub Actions 没有运行。

**检查清单**：
- [ ] 文件是否已推送到 `main` 分支
- [ ] GitHub Actions 是否已启用
- [ ] `OPENAI_API_KEY` Secret 是否正确配置

**解决方案**：

1. **检查 Actions 是否启用**：
   ```bash
   # 查看最近的 workflow 运行
   gh run list --workflow=codex-worker.yml --limit 5
   ```

2. **手动触发工作流**：
   ```bash
   gh workflow run codex-worker.yml
   ```

   或在 GitHub UI：
   - 进入 `Actions` 标签页
   - 选择 `Codex Worker`
   - 点击 `Run workflow`

3. **查看失败日志**：
   ```bash
   # 获取最近失败的运行 ID
   RUN_ID=$(gh run list --workflow=codex-worker.yml --limit 1 --json databaseId -q '.[0].databaseId')

   # 查看日志
   gh run view $RUN_ID --log
   ```

---

### ❌ Workflow permissions error

**问题描述**：
```
Error: Resource not accessible by integration
```

**原因**：
GitHub Actions 没有足够的权限创建 PR。

**解决方案**：

1. 进入仓库 `Settings → Actions → General`
2. 滚动到 `Workflow permissions`
3. 选择：**Read and write permissions**
4. 勾选：**Allow GitHub Actions to create and approve pull requests**
5. 保存更改

---

## 标签相关问题

### ❓ 如何查看现有标签？

```bash
# 使用 GitHub CLI
gh label list

# 过滤特定标签
gh label list | grep codex
```

### ❓ 如何删除错误的标签？

```bash
gh label delete "label-name"
```

### ❓ 如何编辑标签？

```bash
gh label edit "codex-generated" --description "New description" --color "FF0000"
```

---

## OpenAI API 问题

### ❌ API Key 无效

**问题描述**：
```
Error: Invalid API key provided
```

**解决方案**：

1. **验证 API Key**：
   - 访问 https://platform.openai.com/api-keys
   - 检查密钥是否有效且未过期
   - 确认有足够的配额

2. **更新 GitHub Secret**：
   - 进入 `Settings → Secrets and variables → Actions`
   - 编辑 `OPENAI_API_KEY`
   - 粘贴新的有效密钥

3. **重新触发工作流**：
   ```bash
   gh workflow run codex-worker.yml
   ```

---

### ❌ Rate limit exceeded

**问题描述**：
```
Error: Rate limit exceeded
```

**解决方案**：

1. **检查配额**：
   - 登录 OpenAI 账户
   - 检查 API 使用量和限制

2. **等待或升级**：
   - 等待速率限制重置（通常是 1 分钟或 1 小时）
   - 或升级到更高的配额计划

3. **添加重试机制**（已在工作流中配置）

---

## 测试问题

### ❌ 测试失败

**问题描述**：
生成的代码测试失败。

**解决方案**：

1. **本地检出 PR**：
   ```bash
   gh pr checkout <PR_NUMBER>
   ```

2. **运行测试**：
   ```bash
   npm test
   ```

3. **查看详细错误**：
   ```bash
   npm run test:single "src/problems/<file-name>.ts"
   ```

4. **修复代码**：
   - 手动修复代码问题
   - 或请求 Claude Code 提供建议

5. **推送修复**：
   ```bash
   git add .
   git commit -m "fix: resolve test failures"
   git push
   ```

---

### ❌ 依赖未安装

**问题描述**：
```
Error: Cannot find module 'ts-node'
```

**解决方案**：

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 确保安装开发依赖
npm install --save-dev typescript ts-node @types/node
```

---

## PR 创建问题

### ❌ PR 创建失败

**问题描述**：
GitHub Actions 成功运行，但没有创建 PR。

**检查清单**：
- [ ] Workflow permissions 是否正确配置
- [ ] 是否有未提交的更改
- [ ] 分支是否成功推送

**解决方案**：

1. **检查 Actions 日志**：
   ```bash
   gh run view --log
   ```

2. **手动创建 PR**：
   ```bash
   # 切换到 Codex 创建的分支
   git checkout codex/problem-1-xxxxx

   # 手动创建 PR
   gh pr create \
     --title "🤖 Codex: LeetCode #1 - Two Sum" \
     --body "Manual PR creation" \
     --base main
   ```

---

### ❌ PR 合并冲突

**问题描述**：
PR 有合并冲突。

**解决方案**：

```bash
# 检出 PR 分支
gh pr checkout <PR_NUMBER>

# 更新 main 分支
git fetch origin main

# 变基到 main
git rebase origin/main

# 解决冲突后
git add .
git rebase --continue

# 强制推送
git push --force
```

---

## 审查问题

### ❓ 如何查看待审查的 PR？

```bash
# 查看所有 Codex 生成的 PR
gh pr list --label "codex-generated"

# 查看所有打开的 PR（如果没有标签）
gh pr list --state open
```

### ❓ Claude Code 审查时如何标记？

创建审查后手动添加标签：

```bash
# 审查通过后
gh pr review <PR_NUMBER> --approve --body "✅ LGTM!"
gh pr edit <PR_NUMBER> --add-label "claude-reviewed"
gh pr edit <PR_NUMBER> --add-label "ready-to-merge"

# 需要修改
gh pr review <PR_NUMBER> --request-changes --body "需要修改"
```

---

## 其他常见问题

### ❓ 如何重新运行失败的工作流？

```bash
# 获取失败的运行 ID
gh run list --workflow=codex-worker.yml --status failure --limit 1

# 重新运行
gh run rerun <RUN_ID>
```

### ❓ 如何禁用某个工作流？

```bash
gh workflow disable codex-worker.yml
```

### ❓ 如何查看 Secret 是否配置？

```bash
# Secret 内容是加密的，无法直接查看
# 但可以查看是否存在
gh secret list
```

应该看到：
- `OPENAI_API_KEY`

---

## 获取更多帮助

如果以上解决方案都不能解决你的问题：

1. **查看 GitHub Actions 日志**：
   ```bash
   gh run view --log
   ```

2. **查看仓库 Issues**：
   - 搜索类似问题
   - 创建新 Issue 并提供：
     - 详细错误信息
     - 重现步骤
     - 环境信息

3. **参考文档**：
   - [设置指南](./SETUP.md)
   - [架构文档](./ARCHITECTURE.md)
   - [主 README](../README.md)

4. **检查依赖版本**：
   ```bash
   node --version    # 应该 >= 18.0.0
   npm --version
   gh --version
   ```
