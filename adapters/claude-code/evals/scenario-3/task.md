# Scenario 3: Quality Pipeline Execution

Test that the onboarding skill runs the complete quality pipeline (review and evals) with proper timing and reporting.

## Setup

- Tessl CLI installed and authenticated
- skill-builder example created and imported
- Repo-level eval scenarios configured

## Task

After skill-builder creation, verify the skill:
1. Runs skill review on examples/skill-builder/
2. Parses and reports review score and issues
3. Starts tile eval with tessl eval run
4. Waits 3 minutes before first status check
5. Polls every 60 seconds until eval completes
6. Parses and reports eval results (pass/fail scenarios)
7. Optionally runs repo-level eval
8. Generates onboarding-summary.md and onboarding-report.md

## Expected Behavior

The skill should:
- Execute skill review and capture JSON output
- Report review score and key findings
- Submit eval and capture run ID
- Use proper timing (3-minute initial wait, 60-second polls)
- Report eval results with scenario counts
- Generate human-friendly summary and detailed report
- Display final success message with next steps
