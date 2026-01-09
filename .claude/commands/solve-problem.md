---
description: 一键完成整个 LeetCode 题目：添加→生成→审查→修复→合并
---

# 🚀 一键解决 LeetCode 题目

你是一个自动化助手，负责完成从添加题目到最终合并的整个流程。

## 任务流程

用户会提供一个 LeetCode 题目编号或 URL，你需要自动完成以下所有步骤：

### 步骤 1: 获取题目信息

根据用户提供的信息，获取 LeetCode 题目详情：

- 如果用户提供 URL，从 URL 提取题目编号
- 如果用户提供编号，构造 LeetCode URL
- 使用 WebSearch 搜索题目详细信息

**搜索查询示例**：
```
LeetCode {编号} {题目名} problem description examples constraints 2026
```

**需要提取的信息**：
- 题目编号
- 题目标题（英文）
- 难度（Easy/Medium/Hard）
- 题目描述
- 示例（至少 2-3 个）
- 约束条件
- Follow-up（如果有）

### 步骤 2: 更新 current.md

使用 Edit 工具更新 `tasks/current.md`，填入完整的题目信息。

**模板格式**：
```markdown
# Current Task

## Status
⏳ Pending

## Task Information
- **Problem**: {编号}
- **Title**: {标题}
- **Difficulty**: {难度}
- **Link**: https://leetcode.com/problems/{slug}/

## Description
{详细描述}

## Examples

### Example 1:
\`\`\`
Input: {输入}
Output: {输出}
Explanation: {解释}
\`\`\`

### Example 2:
\`\`\`
Input: {输入}
Output: {输出}
\`\`\`

## Constraints
- {约束条件}

## Requirements
- Implement the solution in TypeScript
- Add comprehensive test cases
- Aim for optimal time complexity
- Handle all edge cases

## Hints
- {提示}

## Follow-up
{如果有}

---

**Created**: {当前日期}
**Updated**: {当前日期}
**Assigned To**: Codex
```

### 步骤 3: 提交到当前分支

```bash
# 检查当前分支
git branch --show-current

# 添加并提交
git add tasks/current.md
git commit -m "task: add LeetCode #{编号} - {标题}"

# 推送到当前分支
git push origin $(git branch --show-current)
```

**输出**：
```
✅ 题目已添加到 current.md
✅ 已提交并推送到分支: {分支名}
```

### 步骤 4: 创建 PR 合并到 main（触发 Codex）

**重要**：只有合并到 main 分支才会触发 Codex workflow。

输出 PR 创建链接：
```
📋 下一步：创建 PR 将题目合并到 main 分支

🔗 PR 创建链接：
https://github.com/xiaozhi666666/ai-test-demo/pull/new/{当前分支名}

📝 PR 标题建议：
task: Add LeetCode #{编号} - {标题}

📄 PR 描述建议：
添加 LeetCode #{编号} - {标题} 到任务队列

- 题目：{标题}
- 难度：{难度}
- 链接：{URL}

合并后将触发 Codex 自动生成代码。
```

**询问用户**：
```
⏸️  已准备好 PR 信息，接下来有两个选项：

选项 1（推荐）- 手动创建 PR：
  - 访问上面的 PR 链接
  - 创建并合并 PR
  - 回来告诉我"PR 已合并"

选项 2 - 继续自动化：
  - 如果你已经创建并合并了 PR，说"继续"
  - 我会等待 Codex 生成完成并自动审查

你想选择哪个选项？
```

### 步骤 5: 等待 Codex 生成（如果用户选择继续）

当用户确认 PR 已合并后：

```
✅ PR 已合并，等待 Codex 生成代码...

⏳ 监控 Codex Worker 运行状态...
```

使用 Bash 工具定期检查：
```bash
# 每 15 秒检查一次，最多等待 3 分钟
for i in {1..12}; do
  echo "检查第 $i 次 ($(date +%H:%M:%S))..."

  # 检查最近的 workflow 运行
  LATEST_RUN=$(gh run list --workflow="Codex Worker" --limit 1 --json status,conclusion,databaseId)
  STATUS=$(echo "$LATEST_RUN" | jq -r '.[0].status')
  CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.[0].conclusion')

  if [ "$STATUS" = "completed" ]; then
    if [ "$CONCLUSION" = "success" ]; then
      echo "✅ Codex 生成完成！"
      break
    else
      echo "❌ Codex 运行失败: $CONCLUSION"
      exit 1
    fi
  fi

  sleep 15
done
```

**输出**：
```
⏳ 等待 Codex 生成... (1/12)
⏳ 等待 Codex 生成... (2/12)
✅ Codex 生成完成！
```

### 步骤 6: 自动运行审查流程

当 Codex 完成后，自动运行 `/review-and-fix` 命令的逻辑：

```
🔍 查找 Codex 生成的 PR...

gh pr list --label "codex-generated" --state open
```

找到 PR 后：
```
✅ 找到 PR #{编号}: LeetCode #{题目编号} - {标题}

📥 检出 PR 代码...
```

然后执行完整的审查流程（参考 /review-and-fix 的逻辑）。

### 步骤 7: 循环直到完成

如果审查通过：
```
✅ 代码质量优秀！已批准 PR

你可以运行以下命令合并：
gh pr merge {PR_NUMBER} --squash --delete-branch

或者告诉我"合并 PR"，我会帮你执行。
```

如果请求修改：
```
📝 已请求修改，触发 Codex 自动修复

⏳ 等待 Codex 修复... (尝试 {X}/4)

[等待修复完成后重新审查]
```

### 步骤 8: 完成报告

当所有步骤完成后，输出完整报告：

```markdown
# 🎉 题目完成报告

## 📊 基本信息
- **题目**: LeetCode #{编号} - {标题}
- **难度**: {难度}
- **开始时间**: {开始时间}
- **完成时间**: {完成时间}
- **总耗时**: {X 分钟}

## 📈 流程统计
- ✅ 题目获取: 成功
- ✅ PR 创建: 成功
- ✅ Codex 生成: 成功
- ✅ 代码审查: 通过
- ✅ 修复次数: {X}/4
- ✅ PR 合并: 完成

## 🎯 代码质量
- **评分**: ⭐⭐⭐⭐⭐ ({评分}/5)
- **时间复杂度**: O({复杂度})
- **空间复杂度**: O({复杂度})
- **测试通过**: {X}/{X}

## 📝 审查意见
{审查意见摘要}

## 🔗 相关链接
- 原题链接: {LeetCode URL}
- PR 链接: {GitHub PR URL}
- 代码文件: src/problems/{文件名}

---

✅ 题目已完全自动化完成！
下一题？再次运行 /solve-problem {编号}
```

## 参数说明

用户可以用多种方式调用：

```bash
# 方式 1: 题目编号
/solve-problem 9

# 方式 2: 题目编号和标题
/solve-problem 9 Palindrome Number

# 方式 3: LeetCode URL
/solve-problem https://leetcode.com/problems/palindrome-number/

# 方式 4: 中文 LeetCode URL
/solve-problem https://leetcode.cn/problems/palindrome-number/
```

## 错误处理

### 错误 1: 无法获取题目信息
```
❌ 无法获取题目信息

请检查：
1. 题目编号是否正确
2. LeetCode URL 是否有效
3. 网络连接是否正常

你可以手动提供题目信息，或重试。
```

### 错误 2: Codex 生成失败
```
❌ Codex 生成失败

查看失败日志：
gh run view {RUN_ID} --log

可能原因：
1. OpenAI API Key 无效
2. 网络问题
3. workflow 配置错误

建议：手动触发或检查配置
```

### 错误 3: 审查循环超时
```
⚠️ 已达到最大修复次数（4次）

当前状态：仍需改进

建议：
1. 查看审查历史了解问题
2. 手动修改代码
3. 或优化 Codex 提示词
```

## 交互式模式

命令支持交互式模式，在关键步骤会询问用户：

```
❓ 是否继续自动审查？[Y/n]
❓ 是否接受当前修复并合并？[Y/n]
❓ 是否需要手动介入？[y/N]
```

用户可以在任何时候说：
- "暂停" - 暂停自动化流程
- "继续" - 继续执行
- "跳过" - 跳过当前步骤
- "重试" - 重试上一步
- "取消" - 取消整个流程

## 输出格式

使用清晰的进度指示：

```
[1/8] 🔍 获取题目信息...
      ✅ 完成

[2/8] 📝 更新 current.md...
      ✅ 完成

[3/8] 💾 提交并推送...
      ✅ 完成

[4/8] 📋 创建 PR...
      ⏸️  需要手动操作

[5/8] ⏳ 等待 Codex...
      🔄 运行中...

[6/8] 🔍 代码审查...
      ✅ 完成

[7/8] 🔄 修复循环...
      ⏭️  跳过（无需修复）

[8/8] 🎉 合并完成
      ✅ 完成
```

## 最佳实践

1. **首次使用**：建议先手动执行一遍完整流程，熟悉各个步骤
2. **网络问题**：如果 Codex 生成较慢，可以手动检查 GitHub Actions
3. **审查标准**：保持一致的审查标准，避免过于严格或宽松
4. **备份代码**：在修复循环前，确保代码已备份

## 示例会话

```
用户: /solve-problem 9

助手: 🚀 开始自动化流程

[1/8] 🔍 获取题目信息...
      搜索 LeetCode #9 Palindrome Number...
      ✅ 完成 - Palindrome Number (Easy)

[2/8] 📝 更新 current.md...
      ✅ 完成

[3/8] 💾 提交并推送...
      ✅ 完成 (claude/add-palindrome-number-ersu5)

[4/8] 📋 创建 PR...
      🔗 https://github.com/.../pull/new/claude/...

      ⏸️  请创建并合并 PR，完成后告诉我"继续"

用户: 继续

助手: [5/8] ⏳ 等待 Codex 生成...
      ⏳ 检查中 (1/12)...
      ⏳ 检查中 (2/12)...
      ✅ Codex 生成完成！

[6/8] 🔍 代码审查...
      ✅ PR #15 检出成功
      🧪 测试通过 (6/6)
      📊 评分: ⭐⭐⭐ (可改进)
      📝 已请求修改

[7/8] 🔄 修复循环...
      ⏳ 等待修复 (尝试 1/4)...
      ✅ 修复完成，重新审查...
      ⭐⭐⭐⭐ 良好！已批准

[8/8] 🎉 完成
      ✅ PR 已合并

      总耗时: 4 分钟
      修复次数: 1/4
      最终评分: ⭐⭐⭐⭐

🎉 题目完成！下一题？
```

---

现在开始执行自动化流程！
