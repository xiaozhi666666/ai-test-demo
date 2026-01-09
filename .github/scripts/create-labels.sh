#!/bin/bash

# 创建 GitHub 仓库标签的脚本
# 使用方法: ./create-labels.sh

set -e

echo "Creating GitHub labels for LeetCode AI Automation..."

# 检查 gh CLI 是否安装
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo "Error: Not logged in to GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# 创建标签的函数
create_label() {
    local name=$1
    local description=$2
    local color=$3

    echo "Creating label: $name"
    gh label create "$name" \
        --description "$description" \
        --color "$color" \
        --force 2>/dev/null || echo "  Label '$name' already exists, skipping"
}

# 创建所需的标签
create_label "codex-generated" "PR created by Codex automation" "0E8A16"
create_label "test-failed" "Tests failed for this PR" "D93F0B"
create_label "claude-reviewed" "Reviewed by Claude Code" "1D76DB"
create_label "ready-to-merge" "Approved and ready to merge" "0075CA"

echo ""
echo "✅ Labels created successfully!"
echo ""
echo "Available labels:"
gh label list | grep -E "codex-generated|test-failed|claude-reviewed|ready-to-merge"
