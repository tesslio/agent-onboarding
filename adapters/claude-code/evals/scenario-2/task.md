# Scenario 2: skill-builder Example Creation

Test that the onboarding skill creates a working skill-builder example with proper structure.

## Setup

- Tessl CLI installed and authenticated
- Empty project directory

## Task

After authentication completes, verify the skill:
1. Initializes a Tessl project (tessl.json)
2. Creates examples/skill-builder/ directory structure
3. Copies skill-builder files (SKILL.md, tile.json, evals/scenarios.json)
4. Imports the skill to make it available
5. Creates repo-level eval scenarios in .tessl/evals/

## Expected Behavior

The skill should:
- Create tessl.json with proper project configuration
- Set up complete skill-builder example with all required files
- Successfully import the skill-builder skill
- Create repo-level eval scenarios
- Report each step completion clearly
