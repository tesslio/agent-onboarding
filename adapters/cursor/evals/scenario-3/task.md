# Scenario 3: Complete Onboarding Pipeline

Test that Cursor rules execute the full onboarding pipeline from project setup through reports.

## Setup

- Tessl CLI installed and authenticated
- Empty project directory

## Task

After authentication completes, verify the rules guide:
1. Project initialization (tessl init)
2. skill-builder example creation
3. Repo eval scenarios setup
4. Skill review execution
5. Tile eval execution with polling
6. Optional repo eval
7. Summary and report generation

## Expected Behavior

The rules should:
- Initialize project with tessl.json
- Create examples/skill-builder/ with all files
- Import skill-builder skill
- Create .tessl/evals/ directory
- Run tessl skill review and report score
- Run tessl eval with proper polling (15s intervals)
- Generate onboarding-summary.md
- Generate onboarding-report.md
- Display success message with next steps
