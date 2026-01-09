# 🔄 Claude Code ↔ Codex 自动修复循环指南

> **一键启动 AI 协作循环**：Claude Code 审查 → Codex 修复 → 重新审查 → 最多 4 次迭代

---

## 📋 目录

- [快速开始](#快速开始)
- [完整工作流程](#完整工作流程)
- [使用 Slash Command](#使用-slash-command)
- [手动操作步骤](#手动操作步骤)
- [循环机制说明](#循环机制说明)
- [故障排查](#故障排查)

---

## 🚀 快速开始

### 一键执行命令

在 Claude Code 中运行：

```bash
/review-and-fix
```

这个命令会自动执行：
1. ✅ 列出所有待审查的 Codex PR
2. ✅ 检出最新的 PR
3. ✅ 运行测试
4. ✅ 分析代码质量
5. ✅ 自动批准或请求修改
6. ✅ 如果请求修改，触发 Codex 自动修复

---

## 🔄 完整工作流程

### 阶段 0: 准备工作（一次性设置）

```bash
# 确保环境已配置
1. GitHub Actions 已启用
2. OPENAI_API_KEY 已设置
3. Workflow permissions 已配置（read + write）
```

### 阶段 1: 添加新题目

```bash
# 在 Claude Code 中说：
"帮我在 current.md 添加 LeetCode #X 题目"

# 或者手动：
1. 编辑 tasks/current.md
2. git add tasks/current.md
3. git commit -m "task: add LeetCode #X"
4. git push origin main
```

### 阶段 2: Codex 自动生成（自动）

```
✅ GitHub Actions 触发
✅ Codex 读取题目
✅ 生成代码实现
✅ 创建 PR（标题包含 "🤖 Codex"）
✅ 添加 codex-generated 标签
```

### 阶段 3: Claude Code 审查（你参与）

#### 选项 A - 使用 Slash Command（推荐）

```bash
# 在 Claude Code 中运行
/review-and-fix
```

#### 选项 B - 手动命令

```bash
# 1. 查看待审查的 PR
gh pr list --label "codex-generated" --state open

# 2. 检出 PR（替换 PR_NUMBER）
gh pr checkout <PR_NUMBER>

# 3. 运行测试
npm test

# 4. 审查代码
# 在 Claude Code 中说："审查当前 PR 的代码"

# 5a. 如果代码良好，批准
gh pr review <PR_NUMBER> --approve --body "✅ LGTM!"

# 5b. 如果需要修改，请求更改
gh pr review <PR_NUMBER> --request-changes --body "
## 需要改进的地方

1. [具体问题描述]
2. [优化建议]

## 期望的改进

[详细说明期望的代码改进]
"
```

### 阶段 4: Codex 自动修复（自动触发）

当你请求更改时，会自动触发：

```
✅ 检测到 "request changes" 事件
✅ 读取审查反馈
✅ 获取当前代码实现
✅ 调用 Codex 重新生成改进的代码
✅ 运行测试验证
✅ 提交并推送更新
✅ 在 PR 中评论更新信息
✅ 等待 Claude Code 重新审查
```

### 阶段 5: 循环迭代（自动）

```
循环：Claude 审查 → 请求修改 → Codex 修复 → 重新审查
最大次数：4 次
```

**成功条件**：
- ✅ Claude Code 批准 PR
- ✅ 所有测试通过
- ✅ 代码质量达标

**终止条件**：
- ⛔ 达到 4 次修复上限
- ⛔ 测试持续失败
- ⛔ 无法生成有效代码

### 阶段 6: 合并或人工介入

```bash
# 如果审查通过
gh pr merge <PR_NUMBER> --squash --delete-branch

# 如果达到上限需要人工介入
1. 查看所有修复历史
2. 手动修改代码
3. 或优化 Codex prompt
4. 或寻求其他解决方案
```

---

## 🎯 使用 Slash Command

### `/review-and-fix` - 自动审查并修复

**功能**：
- 自动查找待审查的 Codex PR
- 执行完整的代码审查
- 自动批准或请求修改
- 触发 Codex 自动修复（如果需要）

**使用方法**：

```bash
# 基本用法
/review-and-fix

# 指定 PR 编号
/review-and-fix 123

# 严格模式（更严格的审查标准）
/review-and-fix --strict

# 快速模式（快速审查）
/review-and-fix --quick
```

**输出示例**：

```
🔍 正在查找 Codex 生成的 PR...
✅ 找到 PR #15: LeetCode #9 - Palindrome Number

📥 检出 PR 代码...
✅ 已切换到 PR 分支

🧪 运行测试...
✅ 所有 6 个测试通过

🔍 分析代码质量...
⚠️ 发现可优化的地方：

1. 时间复杂度可以从 O(n) 优化到 O(log n)
2. 可以避免字符串转换

📝 请求修改并触发自动修复...
✅ 已提交审查意见

⏳ 等待 Codex 自动修复...
🔄 Codex 将在 1-2 分钟内更新代码

💡 提示：你可以运行 "监控修复进度" 来查看实时状态
```

---

## 🔧 手动操作步骤

### 完整的手动流程

#### 1. 查找待审查的 PR

```bash
# 列出所有 Codex 生成的 PR
gh pr list --label "codex-generated" --state open

# 输出示例：
# #15  🤖 Codex: LeetCode #9 - Palindrome Number  codex/problem-9-1234567
```

#### 2. 检出并审查

```bash
# 检出 PR
gh pr checkout 15

# 查看文件变化
gh pr diff 15

# 查看具体文件
cat src/problems/easy-009-palindrome-number.ts

# 运行测试
npm run test:single "src/problems/easy-009-palindrome-number.ts"
```

#### 3. 分析代码（在 Claude Code 中）

```
你：审查当前文件的代码，重点关注：
1. 算法复杂度是否最优
2. 是否处理了所有边界情况
3. 代码质量和可读性
4. 是否符合题目的 follow-up 要求

Claude Code 会：
- 读取并分析代码
- 检查算法正确性
- 评估性能
- 提供详细的审查报告
```

#### 4. 提交审查意见

**如果代码优秀** ⭐⭐⭐⭐⭐：

```bash
gh pr review 15 --approve --body "
✅ 优秀的实现！

**优点**：
- ✅ 算法复杂度达到最优 O(log n)
- ✅ 避免了字符串转换
- ✅ 边界情况处理完善
- ✅ 代码清晰易读
- ✅ 测试覆盖全面

**评级**：⭐⭐⭐⭐⭐

批准合并！🎉
"

# 合并 PR
gh pr merge 15 --squash --delete-branch
```

**如果需要改进** ⭐⭐⭐：

```bash
gh pr review 15 --request-changes --body "
## 💡 代码可以改进

**当前问题**：
1. 使用了字符串转换方法，不符合题目的 follow-up 要求
2. 时间复杂度 O(n)，可以优化到 O(log n)
3. 缺少对 0 的特殊处理

**期望的改进**：

使用数学方法反转数字的一半：

\`\`\`typescript
function isPalindrome(x: number): boolean {
  // 负数和末尾为 0 的数（除了 0 本身）不是回文
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false;
  }

  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }

  // 奇数位数：x === Math.floor(reversed / 10)
  // 偶数位数：x === reversed
  return x === reversed || x === Math.floor(reversed / 10);
}
\`\`\`

**优点**：
- ⏱️ O(log n) 时间复杂度
- 💾 O(1) 空间复杂度
- ✅ 符合 follow-up 要求

请根据以上建议修复代码。

**评级**：⭐⭐⭐ (可改进)
"
```

**如果有严重问题** ⭐：

```bash
gh pr review 15 --request-changes --body "
## ❌ 代码存在严重问题

**严重错误**：
1. ❌ 算法逻辑错误，测试用例失败
2. ❌ 未处理负数边界情况
3. ❌ 代码有语法错误

**测试失败**：
\`\`\`
❌ Test Case 2: FAILED
   Expected: false
   Got: true
\`\`\`

**要求**：
请完全重写实现，确保：
1. 所有测试用例通过
2. 正确处理边界情况
3. 算法逻辑正确

**评级**：⭐ (需要重写)
"
```

#### 5. 等待自动修复

提交 "request changes" 后：

```bash
# 监控 Actions 状态
gh run list --workflow="Codex Auto Fix" --limit 5

# 查看 PR 评论
gh pr view 15 --comments

# 等待 Codex 更新（通常 1-2 分钟）
# 收到更新通知后，重新审查：
gh pr checkout 15
git pull
npm test

# 在 Claude Code 中：
"重新审查更新后的代码"
```

---

## 🔁 循环机制说明

### 工作原理

```
┌─────────────────────────────────────────────┐
│  开始：Codex 创建 PR                         │
│  修复次数：0/4                               │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│  Claude Code 审查                           │
│  • 分析代码                                  │
│  • 运行测试                                  │
│  • 评估质量                                  │
└────────────────┬────────────────────────────┘
                 ▼
         ┌───────┴────────┐
         ▼                ▼
    ✅ Approve      ❌ Request Changes
    合并 PR         修复次数 +1
         │                │
         │                ▼
         │     ┌──────────────────────┐
         │     │  Codex 自动修复       │
         │     │  • 读取审查反馈        │
         │     │  • 重新生成代码        │
         │     │  • 提交更新           │
         │     └──────────┬───────────┘
         │                │
         │                ▼
         │      修复次数 < 4？
         │         │
         │    Yes  │  No
         │         │   │
         │         │   └─→ ⚠️ 达到上限
         │         │        标记需要人工介入
         │         │
         └────←────┘
                重新审查
```

### 修复次数跟踪

每个 PR 都会在描述中包含修复计数器：

```markdown
---

**Auto-Fix Metadata**:
- Fix Count: 2
- Max Attempts: 4
```

### 达到上限时

当修复次数达到 4 次时：

```
⚠️ 达到最大修复次数限制

此 PR 已经过 4 次自动修复尝试，但仍未通过审查。

建议操作：
1. 关闭当前 PR
2. 优化 Codex 的 system prompt
3. 手动实现解决方案
4. 检查题目理解是否正确

标签：needs-manual-intervention
```

---

## 📊 审查标准参考

### ⭐⭐⭐⭐⭐ 优秀（立即批准）

```
✅ 算法复杂度最优
✅ 代码清晰易读
✅ 所有测试通过
✅ 边界情况完善
✅ 符合最佳实践
```

### ⭐⭐⭐⭐ 良好（可批准）

```
✅ 算法正确
✅ 测试通过
⚠️ 复杂度非最优但可接受
✅ 代码可读性好
```

### ⭐⭐⭐ 一般（请求优化）

```
✅ 功能正确
⚠️ 复杂度可优化
⚠️ 代码可读性一般
✅ 基本测试覆盖
```

### ⭐⭐ 较差（请求重写）

```
⚠️ 有潜在 bug
❌ 复杂度差
❌ 代码质量低
⚠️ 测试不完善
```

### ⭐ 很差（关闭 PR）

```
❌ 算法错误
❌ 测试失败
❌ 无法运行
❌ 完全不符合要求
```

---

## 🛠️ 故障排查

### 问题 1: Codex 没有自动修复

**症状**：提交 request changes 后，没有收到 Codex 的更新

**检查**：
```bash
# 1. 检查 PR 是否有 codex-generated 标签
gh pr view <PR_NUMBER> --json labels

# 2. 检查 workflow 是否触发
gh run list --workflow="Codex Auto Fix" --limit 5

# 3. 查看 workflow 日志
gh run view <RUN_ID> --log
```

**解决方案**：
- 确保 PR 有 `codex-generated` 标签
- 检查 OPENAI_API_KEY 是否配置
- 查看 workflow permissions 是否正确

### 问题 2: 修复次数没有增加

**症状**：Codex 修复了代码，但计数器还是 0

**解决方案**：
```bash
# 手动更新 PR 描述
gh pr edit <PR_NUMBER> --body "
[原有内容]

---

**Auto-Fix Metadata**:
- Fix Count: 1
- Max Attempts: 4
"
```

### 问题 3: 循环没有停止

**症状**：超过 4 次还在继续修复

**解决方案**：
```bash
# 手动添加标签停止循环
gh pr edit <PR_NUMBER> --add-label "needs-manual-intervention"

# 或关闭 PR
gh pr close <PR_NUMBER> --comment "Reached max attempts, manual intervention needed"
```

### 问题 4: Slash command 不工作

**症状**：`/review-and-fix` 命令无效

**解决方案**：
```bash
# 检查 slash command 文件是否存在
ls -la .claude/commands/

# 手动执行等效操作
gh pr list --label "codex-generated"
gh pr checkout <PR_NUMBER>
npm test
```

---

## 📚 相关文档

- [Claude Code 审查指南](../ai-config/claude/review-guide.md)
- [Codex 系统提示词](../ai-config/codex/system-prompt.md)
- [完整故障排查](./TROUBLESHOOTING.md)
- [项目架构说明](./ARCHITECTURE.md)

---

## 🎓 最佳实践

### 1. 写清晰的审查意见

❌ 不好的反馈：
```
代码不好，重写
```

✅ 好的反馈：
```
## 需要改进的地方

1. **性能问题**：当前使用双层循环，时间复杂度 O(n²)
   - 建议使用 HashMap 优化到 O(n)

2. **边界情况**：未处理负数输入
   - 添加：if (x < 0) return false

3. **代码可读性**：变量名 `tmp` 不够清晰
   - 建议改为 `complement`
```

### 2. 设置合理的期望

- 第 1 次修复：可能修复明显问题
- 第 2 次修复：应该接近期望
- 第 3 次修复：通常应该通过
- 第 4 次修复：最后机会

### 3. 及时终止无效循环

如果连续 2-3 次修复都没有改进，考虑：
- 优化你的审查反馈描述
- 检查 Codex prompt 是否清晰
- 或者手动介入修改

### 4. 保持审查标准一致

使用相同的标准审查所有 PR，避免：
- 第一次太严格
- 后续太宽松
- 标准不一致

---

## 💡 快速命令参考

```bash
# === 查看 PR ===
gh pr list --label "codex-generated"                # 列出所有 Codex PR
gh pr view <PR_NUMBER>                              # 查看 PR 详情
gh pr checkout <PR_NUMBER>                          # 检出 PR
gh pr diff <PR_NUMBER>                              # 查看代码变化

# === 运行测试 ===
npm test                                            # 运行所有测试
npm run test:single "src/problems/xxx.ts"          # 测试单个文件

# === 审查操作 ===
gh pr review <PR_NUMBER> --approve --body "..."    # 批准
gh pr review <PR_NUMBER> --request-changes --body "..."  # 请求修改
gh pr review <PR_NUMBER> --comment --body "..."    # 仅评论

# === 合并 PR ===
gh pr merge <PR_NUMBER> --squash                   # Squash 合并
gh pr merge <PR_NUMBER> --squash --delete-branch   # 合并并删除分支

# === 监控状态 ===
gh run list --workflow="Codex Auto Fix"            # 查看修复任务
gh run view <RUN_ID> --log                         # 查看详细日志

# === 在 Claude Code 中 ===
/review-and-fix                                    # 自动审查并修复
/review-and-fix <PR_NUMBER>                        # 审查指定 PR
/review-and-fix --strict                           # 严格模式
```

---

## 🎯 总结

这个自动循环系统让你可以：

1. ✅ **自动化重复工作**：不需要手动告诉 Codex 如何修改
2. ✅ **快速迭代**：从审查到修复只需要 1-2 分钟
3. ✅ **保证质量**：最多 4 次机会确保代码质量
4. ✅ **学习改进**：通过审查历史了解什么是好代码

**下次使用时，只需运行**：

```bash
/review-and-fix
```

就可以启动整个自动化流程！🚀
