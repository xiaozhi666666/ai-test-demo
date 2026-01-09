# Problems Directory

此目录包含所有 LeetCode 题目的实现。

## 文件命名规范

格式：`{difficulty}-{number}-{title}.ts`

示例：
- `easy-001-two-sum.ts`
- `medium-015-3sum.ts`
- `hard-042-trapping-rain-water.ts`

## 代码结构

每个文件应包含：

1. **文档注释**：题目信息、描述、示例、约束
2. **类型定义**：如需要
3. **解决方案**：主函数实现
4. **复杂度注释**：时间和空间复杂度
5. **测试用例**：使用 TestRunner

## 示例代码

参考 [example-template.ts](./example-template.ts)

## 运行测试

```bash
# 运行单个文件
npm run test:single src/problems/easy-001-two-sum.ts

# 运行所有 Easy 题目
npm run test:easy

# 运行所有测试
npm test
```

## 目录索引

### Easy
- [ ] #1 - Two Sum

### Medium
- [ ] (待添加)

### Hard
- [ ] (待添加)
