# Codex Workflow

## 触发条件

当 `tasks/current.md` 文件被更新并推送到 main 分支时，自动触发执行。

## 执行步骤

### Step 1: 环境准备
```bash
# 检出代码
git checkout main
git pull origin main

# 创建工作分支
git checkout -b codex/task-$(date +%s)
```

### Step 2: 读取任务
```bash
# 解析 tasks/current.md
TASK_FILE="tasks/current.md"
PROBLEM_NUMBER=$(grep "Problem:" $TASK_FILE | awk '{print $2}')
PROBLEM_TITLE=$(grep "Title:" $TASK_FILE | awk -F': ' '{print $2}')
DIFFICULTY=$(grep "Difficulty:" $TASK_FILE | awk '{print $2}')
```

### Step 3: 调用 OpenAI API
```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: readFileSync("ai-config/codex/system-prompt.md") },
    { role: "user", content: readFileSync("tasks/current.md") }
  ],
  temperature: 0.3,
});
```

### Step 4: 生成代码
```bash
# 将生成的代码写入文件
echo "$GENERATED_CODE" > "src/problems/${DIFFICULTY}-${PROBLEM_NUMBER}-${PROBLEM_TITLE}.ts"
```

### Step 5: 运行测试
```bash
# 验证代码可执行
npm run test:single "src/problems/${DIFFICULTY}-${PROBLEM_NUMBER}-${PROBLEM_TITLE}.ts"
```

### Step 6: 提交并创建 PR
```bash
# 提交更改
git add .
git commit -m "feat: implement LeetCode #${PROBLEM_NUMBER} - ${PROBLEM_TITLE}"

# 推送到远程
git push origin codex/task-$(date +%s)

# 创建 PR
gh pr create \
  --title "🤖 Codex: LeetCode #${PROBLEM_NUMBER} - ${PROBLEM_TITLE}" \
  --body "$(cat ai-config/codex/pr-template.md)" \
  --label "codex-generated"
```

## 错误处理

- API 调用失败：重试 3 次，间隔 5 秒
- 代码生成失败：记录到 `logs/codex-errors.log`
- 测试失败：在 PR 中标注测试失败信息

## 输出格式

PR 描述应包含：
- 题目信息
- 时间/空间复杂度
- 实现思路
- 测试用例结果
