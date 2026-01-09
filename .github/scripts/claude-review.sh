#!/bin/bash

# Claude Code PR Review Script
# This script is meant to be run by Claude Code to monitor and review PRs

set -e

echo "🤖 Claude Code PR Review Helper"
echo "================================"
echo ""

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

# Function to list open Codex PRs
list_prs() {
    echo "📋 Open Codex PRs:"
    gh pr list --label "codex-bot" --json number,title,url,headRefName
}

# Function to get PR details
get_pr_details() {
    local pr_number=$1
    echo "📄 PR #$pr_number Details:"
    gh pr view "$pr_number" --json title,body,files,commits
}

# Function to get PR diff
get_pr_diff() {
    local pr_number=$1
    echo "📝 PR #$pr_number Diff:"
    gh pr diff "$pr_number"
}

# Function to comment on PR
comment_pr() {
    local pr_number=$1
    local comment=$2
    gh pr comment "$pr_number" --body "$comment"
    echo "✅ Comment added to PR #$pr_number"
}

# Function to approve and merge PR
approve_and_merge() {
    local pr_number=$1

    # Approve
    gh pr review "$pr_number" --approve --body "✅ Approved by Claude Code - All acceptance criteria met"

    # Merge
    gh pr merge "$pr_number" --squash --auto

    echo "✅ PR #$pr_number approved and merged"
}

# Function to request changes
request_changes() {
    local pr_number=$1
    local feedback=$2

    gh pr review "$pr_number" --request-changes --body "$feedback"

    echo "⚠️  Changes requested for PR #$pr_number"
}

# Main menu
show_menu() {
    echo ""
    echo "Available commands:"
    echo "  1. list       - List all open Codex PRs"
    echo "  2. view <PR>  - View PR details"
    echo "  3. diff <PR>  - View PR diff"
    echo "  4. comment    - Add comment to PR (interactive)"
    echo "  5. approve    - Approve and merge PR (interactive)"
    echo "  6. changes    - Request changes (interactive)"
    echo "  7. exit       - Exit"
    echo ""
}

# Parse command line arguments
if [ $# -eq 0 ]; then
    # Interactive mode
    while true; do
        show_menu
        read -p "Enter command: " cmd args

        case $cmd in
            1|list)
                list_prs
                ;;
            2|view)
                read -p "Enter PR number: " pr_num
                get_pr_details "$pr_num"
                ;;
            3|diff)
                read -p "Enter PR number: " pr_num
                get_pr_diff "$pr_num"
                ;;
            4|comment)
                read -p "Enter PR number: " pr_num
                read -p "Enter comment: " comment_text
                comment_pr "$pr_num" "$comment_text"
                ;;
            5|approve)
                read -p "Enter PR number to approve: " pr_num
                approve_and_merge "$pr_num"
                ;;
            6|changes)
                read -p "Enter PR number: " pr_num
                read -p "Enter feedback: " feedback_text
                request_changes "$pr_num" "$feedback_text"
                ;;
            7|exit)
                echo "Goodbye!"
                exit 0
                ;;
            *)
                echo "Unknown command: $cmd"
                ;;
        esac
    done
else
    # Command line mode
    case $1 in
        list)
            list_prs
            ;;
        view)
            get_pr_details "$2"
            ;;
        diff)
            get_pr_diff "$2"
            ;;
        *)
            echo "Usage: $0 [list|view <PR>|diff <PR>]"
            exit 1
            ;;
    esac
fi
