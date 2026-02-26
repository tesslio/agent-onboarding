---
name: skill-builder
description: Helps you scaffold new Tessl skills with best practices and proper structure
---

# Skill Builder

This skill helps you create new Tessl skills by asking the right questions and generating well-structured skill files.

## What This Skill Does

When you invoke this skill, it will:
1. Ask about your skill's purpose and target use case
2. Help you define clear success criteria
3. Generate a properly structured SKILL.md file
4. Create matching tile.json with correct metadata
5. Suggest initial eval scenarios

## Usage

Invoke this skill when you want to create a new Tessl skill:
- "Help me create a skill for code review"
- "I want to build a skill that validates API designs"
- "Create a skill for database migration planning"

## Process

**Step 1: Understand the Goal**
Ask the user:
- What problem does this skill solve?
- Who will use it (what type of AI agent)?
- What does success look like?

**Step 2: Define the Structure**
Based on the answers, determine:
- Skill name (kebab-case, descriptive)
- Clear description (one sentence)
- Key sections the skill should include

**Step 3: Generate SKILL.md**
Create a properly formatted skill file with:
- YAML frontmatter (name, description)
- Overview section
- Process/workflow section
- Examples section
- Best practices section

**Step 4: Generate tile.json**
Create metadata file with:
- Correct package name format
- Version (start at 0.1.0)
- Dependencies (if any)
- Private flag (default: true)

**Step 5: Suggest Eval Scenarios**
Propose 3-5 eval scenarios that test:
- Can the skill be invoked correctly?
- Does it ask the right questions?
- Does it generate valid output?
- Does it handle edge cases?

## Best Practices

- Keep skill names short and descriptive
- One skill = one clear purpose (don't overload)
- Include concrete examples, not just abstract instructions
- Write for AI agents (clear, unambiguous instructions)
- Test your skill with multiple agents (Claude, Cursor, etc.)

## Output Format

This skill generates:
1. `SKILL.md` - The skill content
2. `tile.json` - The metadata
3. `evals/scenarios.json` - Suggested eval scenarios (user should refine)

## Example Output

See this skill itself as an example! This skill was built following its own guidelines.
