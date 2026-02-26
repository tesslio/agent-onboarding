# Scenario 1: Basic Skill Creation Flow

Test that skill-builder can guide through creating a simple skill.

## Task

User says: "Help me create a skill for code review"

The skill should:
1. Ask clarifying questions about the code review skill (purpose, target users, success criteria)
2. Generate a properly formatted SKILL.md file with frontmatter, overview, process, examples, and best practices sections
3. Create a matching tile.json with correct package name format, version 0.1.0, and metadata
4. Suggest 3-5 eval scenarios for testing the code review skill

## Expected Output

- SKILL.md with YAML frontmatter (name: code-review, description)
- tile.json with proper structure (name, version, summary, description, type: skill)
- Suggestions for eval scenarios that test code review functionality
