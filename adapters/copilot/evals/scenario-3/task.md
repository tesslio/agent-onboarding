# Scenario 3: Full Pipeline Execution

Test that GitHub Copilot instructions execute the complete onboarding pipeline.

## Setup

- Tessl CLI installed and authenticated
- Empty project directory

## Task

After authentication, verify the instructions guide through:
1. Project initialization (tessl.json check/creation)
2. skill-builder example setup
3. Repo eval scenarios creation
4. Skill review execution and reporting
5. Tile eval execution with polling
6. Optional repo eval
7. Report generation (summary and detailed)
8. Success message with next steps

## Expected Behavior

The instructions should:
- Check for tessl.json, initialize if missing
- Create examples/skill-builder/ with all files
- Import skill-builder skill
- Set up .tessl/evals/ directory
- Run `tessl skill review` and parse JSON output
- Run `tessl eval run` and capture run ID
- Poll eval status every 15 seconds
- Generate onboarding-summary.md (2-3 paragraphs)
- Generate onboarding-report.md (detailed log)
- Display success message with next steps
