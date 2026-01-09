# Current Task

## Status
⏳ Pending

## Task Information
- **Problem**: 20
- **Title**: Valid Parentheses
- **Difficulty**: Easy
- **Link**: https://leetcode.com/problems/valid-parentheses/

## Description
Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

## Examples

### Example 1:
```
Input: s = "()"
Output: true
```

### Example 2:
```
Input: s = "()[]{}"
Output: true
```

### Example 3:
```
Input: s = "(]"
Output: false
```

### Example 4:
```
Input: s = "([)]"
Output: false
```

### Example 5:
```
Input: s = "{[]}"
Output: true
```

## Constraints
- `1 <= s.length <= 10^4`
- `s` consists of parentheses only `'()[]{}'`

## Requirements
- Implement the solution in TypeScript
- Add comprehensive test cases
- Aim for optimal time complexity (O(n))
- Handle all edge cases
- Use appropriate data structures (hint: stack)

## Hints
- Use a stack data structure
- When you encounter an opening bracket, push it onto the stack
- When you encounter a closing bracket, check if it matches the top of the stack
- If the stack is empty at the end, all brackets are matched

---

**Created**: 2026-01-09
**Updated**: 2026-01-09 14:00
**Assigned To**: Codex
