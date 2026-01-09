# Claude Code Review Guide

作为 Code Reviewer，你需要审查 Codex 生成的 LeetCode 解决方案。

## 审查重点

### 1. 算法正确性
- [ ] 算法逻辑是否正确
- [ ] 是否处理所有边界情况
- [ ] 是否符合题目约束条件

### 2. 时间复杂度
- [ ] 是否达到最优时间复杂度
- [ ] 是否有不必要的循环或递归
- [ ] 是否可以通过 LeetCode 时间限制

### 3. 空间复杂度
- [ ] 是否有内存泄漏风险
- [ ] 是否可以优化空间使用
- [ ] 是否符合题目空间要求

### 4. 代码质量
- [ ] 变量命名是否清晰
- [ ] 代码结构是否合理
- [ ] 是否有冗余代码
- [ ] TypeScript 类型是否正确

### 5. 测试覆盖
- [ ] 测试用例是否充分
- [ ] 是否覆盖边界情况
- [ ] 测试结果是否正确

## 审查流程

### Step 1: 获取 PR 信息
```bash
# 列出待审查的 PR
gh pr list --label "codex-generated" --state open

# 查看 PR 详情
gh pr view {PR_NUMBER}
```

### Step 2: 检出 PR 代码
```bash
# 检出 PR 分支
gh pr checkout {PR_NUMBER}

# 查看改动
git diff main...HEAD
```

### Step 3: 静态分析
```bash
# 运行 linter
npm run lint

# 运行类型检查
npm run type-check
```

### Step 4: 运行测试
```bash
# 运行所有测试
npm test

# 运行特定题目测试
npm run test:single "src/problems/{file-name}.ts"
```

### Step 5: 代码审查
使用 Claude Code 阅读代码并分析：
- 算法实现是否最优
- 是否有潜在 bug
- 代码风格是否一致

### Step 6: 提供反馈

#### 如果通过审查
```bash
# 批准 PR
gh pr review {PR_NUMBER} --approve --body "✅ LGTM! Code quality excellent."

# 合并 PR
gh pr merge {PR_NUMBER} --squash --delete-branch
```

#### 如果需要修改
```bash
# 请求更改
gh pr review {PR_NUMBER} --request-changes --body "
## 需要修改的问题

1. {问题描述}
2. {问题描述}

## 建议的改进

\`\`\`typescript
{建议的代码}
\`\`\`
"
```

## 常见问题检查清单

### 性能问题
- [ ] 是否使用了不必要的嵌套循环（O(n²) 可优化为 O(n)）
- [ ] 是否重复计算相同的值（可使用 Map/Set 优化）
- [ ] 是否可以使用双指针、滑动窗口等技巧

### 逻辑问题
- [ ] 边界条件：空数组、单元素、负数等
- [ ] 整数溢出风险
- [ ] 数组越界风险
- [ ] 无限循环风险

### 代码风格
- [ ] 使用有意义的变量名（避免 i、j、k 之外的单字母）
- [ ] 函数功能单一，避免过长
- [ ] 避免过深的嵌套（建议不超过 3 层）

## 审查标准

### ⭐️⭐️⭐️⭐️⭐️ 优秀
- 算法最优
- 代码清晰
- 测试完善
- 无任何问题

→ **立即批准合并**

### ⭐️⭐️⭐️⭐️ 良好
- 算法正确但非最优
- 代码可读性好
- 测试基本覆盖

→ **批准合并，可选优化建议**

### ⭐️⭐️⭐️ 一般
- 算法正确但效率低
- 代码有改进空间
- 测试不够完善

→ **请求修改，提供具体建议**

### ⭐️⭐️ 较差
- 算法有潜在 bug
- 代码质量差
- 缺少测试

→ **拒绝合并，要求重写**

### ⭐️ 很差
- 算法错误
- 无法运行
- 无测试

→ **关闭 PR，重新生成**

## 自动化检查

在审查前，以下检查会自动运行：
- ESLint 代码风格检查
- TypeScript 类型检查
- 单元测试运行
- 代码覆盖率检查

如果自动检查失败，PR 会被标记为不可合并。

## 示例审查评论

### 正面反馈
```markdown
✅ 优秀的实现！

- 时间复杂度达到最优 O(n)
- 代码清晰易懂
- 边界情况处理完善
- 测试覆盖率 100%

批准合并！🎉
```

### 改进建议
```markdown
💡 代码正确但有优化空间

**当前实现**：使用两层循环，O(n²)

**建议优化**：使用 HashMap，可优化到 O(n)

\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

其他方面都很好，做此优化后即可批准。
```
