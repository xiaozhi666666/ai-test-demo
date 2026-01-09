# Claude Code Commands

快速命令参考，用于在 Claude Code 中执行常见任务。

## 审查相关命令

### 查看待审查 PR
```bash
gh pr list --label "codex-generated" --state open
```

### 审查特定 PR
```bash
# 查看 PR 详情
gh pr view {PR_NUMBER}

# 检出 PR 代码
gh pr checkout {PR_NUMBER}

# 查看文件改动
gh pr diff {PR_NUMBER}
```

### 批准 PR
```bash
gh pr review {PR_NUMBER} --approve --body "✅ LGTM!"
```

### 请求修改
```bash
gh pr review {PR_NUMBER} --request-changes --body "需要修改的内容"
```

### 合并 PR
```bash
gh pr merge {PR_NUMBER} --squash --delete-branch
```

## 测试命令

### 运行所有测试
```bash
npm test
```

### 运行单个文件测试
```bash
npm run test:single "src/problems/easy-001-two-sum.ts"
```

### 运行特定难度测试
```bash
npm run test:easy
npm run test:medium
npm run test:hard
```

## 代码质量检查

### Lint 检查
```bash
npm run lint
```

### 类型检查
```bash
npm run type-check
```

### 格式化代码
```bash
npm run format
```

## 任务管理

### 查看当前任务
```bash
cat tasks/current.md
```

### 查看已完成任务
```bash
cat tasks/completed.md
```

### 查看任务统计
```bash
npm run stats
```

## Git 操作

### 查看当前分支
```bash
git branch --show-current
```

### 查看改动
```bash
git diff main...HEAD
```

### 回到主分支
```bash
git checkout main
```

## 批量操作

### 批准所有通过测试的 PR
```bash
for pr in $(gh pr list --label "codex-generated" --json number -q '.[].number'); do
  gh pr checks $pr && gh pr review $pr --approve && gh pr merge $pr --squash
done
```

### 关闭所有失败的 PR
```bash
for pr in $(gh pr list --label "test-failed" --json number -q '.[].number'); do
  gh pr close $pr --comment "测试失败，已关闭"
done
```

## 监控命令

### 实时监控 PR 状态
```bash
watch -n 10 'gh pr list --label "codex-generated"'
```

### 查看最近的工作流运行
```bash
gh run list --workflow=codex-worker.yml --limit 10
```

### 查看工作流日志
```bash
gh run view {RUN_ID} --log
```

## 快捷脚本

你可以在 Claude Code 中直接说：

- "审查最新的 PR" → 自动检出并审查
- "批准通过测试的 PR" → 自动批准
- "查看失败的测试" → 显示失败信息
- "更新任务列表" → 查看并更新任务
