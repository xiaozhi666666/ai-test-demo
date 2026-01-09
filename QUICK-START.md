# 🚀 快速开始：Claude Code ↔ Codex 自动循环

> **一键命令**：`/review-and-fix` - 自动审查 Codex 代码并触发修复循环

---

## ⚡ 10 秒快速开始

### 1. 添加新题目（任选一种方式）

**方式 A - 让 Claude Code 帮你**：
```
在 Claude Code 中说：
"帮我在 current.md 添加 LeetCode #X 题目"
```

**方式 B - 手动添加**：
```bash
# 编辑 tasks/current.md，填入题目信息
git add tasks/current.md
git commit -m "task: add LeetCode #X"
git push origin main
```

### 2. 等待 Codex 生成（自动，1-2 分钟）

Codex 会自动：
- ✅ 读取题目
- ✅ 生成代码
- ✅ 运行测试
- ✅ 创建 PR

### 3. 审查并修复（一键命令）

```bash
# 在 Claude Code 中运行
/review-and-fix
```

就这么简单！🎉

---

## 🔄 完整流程图

```
你添加题目 → Codex 自动生成 → Claude 自动审查
                                      ↓
                              评分 >= 4 星？
                                ↙        ↘
                            ✅ 是        ❌ 否
                              ↓            ↓
                          批准合并    请求修改
                                          ↓
                                   Codex 自动修复
                                          ↓
                                     重新审查
                                   （最多 4 次）
```

---

## 📖 `/review-and-fix` 命令会做什么？

1. ✅ 自动查找待审查的 Codex PR
2. ✅ 检出代码
3. ✅ 运行所有测试
4. ✅ 分析代码质量（算法、性能、可读性）
5. ✅ 给出 1-5 星评分
6. ✅ 自动批准（4-5星）或请求修改（1-3星）
7. ✅ 如果请求修改，自动触发 Codex 修复
8. ✅ 循环直到通过或达到 4 次上限

---

## 🎯 评分标准

| 评分 | 说明 | 操作 |
|-----|------|------|
| ⭐⭐⭐⭐⭐ | 完美实现 | 立即批准合并 |
| ⭐⭐⭐⭐ | 良好实现 | 批准合并，可选建议 |
| ⭐⭐⭐ | 可以改进 | 请求修改 → Codex 修复 |
| ⭐⭐ | 需要重写 | 请求修改 → Codex 重写 |
| ⭐ | 严重错误 | 关闭 PR 重新生成 |

---

## 💡 常用命令

```bash
# === 审查相关 ===
/review-and-fix                    # 自动审查最新 PR
/review-and-fix 123                # 审查指定 PR
/review-and-fix --strict           # 严格模式
/review-and-fix --quick            # 快速模式

# === 手动操作 ===
gh pr list --label "codex-generated"  # 列出所有 Codex PR
gh pr checkout <PR_NUMBER>           # 检出 PR
npm test                             # 运行测试
gh pr merge <PR_NUMBER> --squash     # 合并 PR

# === 监控状态 ===
gh run list --workflow="Codex Auto Fix"  # 查看修复任务
gh run list --workflow="Codex Worker"    # 查看生成任务
```

---

## 📊 示例输出

运行 `/review-and-fix` 后，你会看到：

```
🔍 正在查找 Codex 生成的 PR...
✅ 找到 PR #15: LeetCode #9 - Palindrome Number

📥 检出 PR 代码...
✅ 已切换到 PR 分支

🧪 运行测试...
✅ 所有 6 个测试通过 (28ms)

🔍 分析代码质量...

# 🔍 代码审查报告

## 📊 基本信息
- PR 编号：#15
- 题目：LeetCode #9 - Palindrome Number
- 难度：Easy

## 🧪 测试结果
- 通过：6/6 ✅
- 执行时间：28ms

## 📈 性能分析
- 时间复杂度：O(n) ⚠️ 可优化到 O(log n)
- 空间复杂度：O(n) ⚠️ 可优化到 O(1)

## ⭐ 综合评分
评分：⭐⭐⭐ (可改进)

## 🎯 审查决策
决策：❌ 请求修改

---

📝 已请求修改并触发 Codex 自动修复

⏳ 预计 1-2 分钟后 Codex 会提交更新
🔔 修复完成后重新运行：/review-and-fix 15
```

---

## 🔁 自动修复循环

当你请求修改后：

```
尝试 1/4 → Claude 请求修改 → Codex 修复 → 等待审查
尝试 2/4 → Claude 请求修改 → Codex 修复 → 等待审查
尝试 3/4 → Claude 请求修改 → Codex 修复 → 等待审查
尝试 4/4 → Claude 请求修改 → Codex 修复 → 最后机会
达到上限 → ⚠️ 标记需要人工介入
```

---

## 🛠️ 故障排查

### 问题：没有找到 PR

```bash
# 检查 Codex workflow 是否运行
gh run list --workflow="Codex Worker" --limit 5

# 查看详细日志
gh run view <RUN_ID> --log
```

### 问题：修复没有触发

```bash
# 检查 PR 是否有标签
gh pr view <PR_NUMBER> --json labels

# 手动添加标签
gh pr edit <PR_NUMBER> --add-label "codex-generated"
```

### 问题：达到修复上限

```
⚠️  PR 已达到 4 次修复上限

建议：
1. 关闭当前 PR
2. 优化 ai-config/codex/system-prompt.md
3. 手动实现或寻求帮助
```

---

## 📚 详细文档

- **完整指南**：[docs/CLAUDE-CODEX-LOOP.md](docs/CLAUDE-CODEX-LOOP.md)
- **审查标准**：[ai-config/claude/review-guide.md](ai-config/claude/review-guide.md)
- **Codex 配置**：[ai-config/codex/system-prompt.md](ai-config/codex/system-prompt.md)
- **故障排查**：[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 💪 实战练习

### 第一次使用？跟着做：

1. **添加题目**
```
在 Claude Code 中说：
"帮我在 current.md 添加 LeetCode #1 Two Sum"
```

2. **等待通知**
```
⏳ 等待 1-2 分钟
✅ 收到通知："Codex 已创建 PR #X"
```

3. **一键审查**
```bash
/review-and-fix
```

4. **查看结果**
```
✅ 如果批准：运行 gh pr merge <PR_NUMBER> --squash
❌ 如果请求修改：等待 Codex 修复，然后重新审查
```

5. **完成！**
```
🎉 代码已合并，任务完成！
```

---

## 🎓 最佳实践

### ✅ 好的审查反馈

```markdown
## 需要改进的地方

1. **性能问题**：时间复杂度 O(n²)
   - 建议：使用 HashMap 优化到 O(n)
   - 示例代码：[提供具体代码]

2. **边界情况**：未处理空数组
   - 建议：添加 if (arr.length === 0) return []

3. **代码可读性**：变量名 `tmp` 不清晰
   - 建议：改为 `complement`
```

### ❌ 不好的审查反馈

```
代码不好，重写。
```

---

## 🚀 开始使用

现在就试试吧！

```bash
# 1. 添加一个题目
"帮我在 current.md 添加 LeetCode 题目"

# 2. 等待 Codex 生成（1-2 分钟）

# 3. 运行一键审查
/review-and-fix

# 就这么简单！
```

---

**下次需要时**，直接打开这个文件，复制命令就行！📋

完整文档：[docs/CLAUDE-CODEX-LOOP.md](docs/CLAUDE-CODEX-LOOP.md)
