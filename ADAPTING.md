# Adapting Tessl Onboarding for New AI Tools

This document explains how to create adapters for new AI tools and IDEs.

## Core Principle

The Tessl onboarding system uses a **content-first architecture**:
- **Core:** `TESSL_ONBOARDING.md` - Universal guide that any agent can follow
- **Adapters:** Tool-specific wrappers that tell agents how to execute the core guide

**Your adapter's job:** Tell the AI agent to read and execute `TESSL_ONBOARDING.md`

## Adapter Pattern

### Minimal Adapter (Template)

```markdown
# Tessl Onboarding for [Tool Name]

When user requests Tessl setup, follow these steps:

1. **Load Core Guide**
   - Read `TESSL_ONBOARDING.md` (local or https://tessl.io/onboard.md)
   - This contains complete step-by-step instructions

2. **Execute Steps**
   - Follow the guide sequentially
   - Use terminal commands where specified
   - Generate outputs as described

3. **Error Handling**
   - Retry network operations (3x)
   - Auto-create missing directories
   - Continue on non-critical failures

4. **Success Output**
   - Report completion
   - List created artifacts
   - Suggest next steps
```

That's it! The core guide handles the details.

## Examples by Tool Type

### IDE-Integrated Tools (Cursor, Windsurf, etc.)

**Format:** Tool-specific rules file (`.cursorrules`, `.windsurfrules`, etc.)

**Structure:**
```markdown
# Tessl Onboarding

## When to trigger
[Describe what user says to trigger onboarding]

## Instructions
Follow `TESSL_ONBOARDING.md` step-by-step.

## Key Commands
[List critical shell commands needed]

## Error Handling
[Brief notes on autonomous recovery]
```

**Example:** See `adapters/cursor/.cursorrules`

### Workspace Instruction Tools (Copilot, etc.)

**Format:** Markdown in tool-specific location (`.github/copilot-instructions.md`, etc.)

**Structure:**
```markdown
# Tessl Onboarding Instructions

## Trigger
[What phrases trigger this]

## Process
Follow `TESSL_ONBOARDING.md` or https://tessl.io/onboard.md

## Commands
[Table of key commands]

## Outputs
[What files to create]
```

**Example:** See `adapters/copilot/.github/copilot-instructions.md`

### CLI Skill Systems (Claude Code, etc.)

**Format:** Tool's skill format (usually markdown with YAML frontmatter)

**Structure:**
```markdown
---
name: tessl-onboarding
description: Interactive Tessl onboarding
---

## Process

Load `TESSL_ONBOARDING.md` and execute each step using [tool's APIs/commands].

[Detailed step-by-step following the core guide]
```

**Example:** See `adapters/claude-code/skill.md`

## Checklist for New Adapters

Creating an adapter for a new tool? Follow this checklist:

- [ ] **Identify format:** What file format does the tool expect? (markdown, YAML, JSON, etc.)
- [ ] **Identify location:** Where does the tool look for instructions? (root, `.github/`, config dir, etc.)
- [ ] **Minimal wrapper:** Start with minimal adapter that just references `TESSL_ONBOARDING.md`
- [ ] **Test basics:** Can the agent read the core guide and execute basic commands?
- [ ] **Add error handling:** Document how agent should handle common errors
- [ ] **Test full flow:** Run complete onboarding end-to-end
- [ ] **Document usage:** Write README explaining how users invoke it
- [ ] **Submit PR:** Add to the adapters/ directory

## Anatomy of a Good Adapter

### ✅ DO:
- **Reference the core guide** - Don't duplicate content
- **Keep it brief** - Let `TESSL_ONBOARDING.md` handle details
- **Focus on tool-specific** - How to invoke? What format?
- **Document triggers** - What does user say to start onboarding?
- **Test thoroughly** - Ensure end-to-end flow works

### ❌ DON'T:
- **Duplicate steps** - Don't copy `TESSL_ONBOARDING.md` content
- **Add tool-specific logic** - Keep onboarding universal
- **Over-specify** - Trust the core guide for details
- **Skip testing** - Always test with real users

## Common Patterns

### Pattern 1: Direct Reference

```markdown
Follow the complete guide at `TESSL_ONBOARDING.md`
```

**Use when:** Tool can easily read local files

### Pattern 2: Remote Fetch

```markdown
Fetch and follow: https://tessl.io/onboard.md
```

**Use when:** Tool can fetch URLs but prefers remote content

### Pattern 3: Inline Summary

```markdown
Execute these steps (see TESSL_ONBOARDING.md for details):
1. Check prerequisites
2. Install Tessl
3. Authenticate
...
```

**Use when:** Tool benefits from a high-level outline

### Pattern 4: Command List

```markdown
Run these commands in sequence:
- tessl login
- tessl init
- [etc.]

For full context: TESSL_ONBOARDING.md
```

**Use when:** Tool is command-focused

## Testing Your Adapter

### Test Cases

1. **Fresh install** - User has never used Tessl
   - Expected: Installs CLI, completes onboarding

2. **Existing user** - Tessl already installed
   - Expected: Skips install, completes onboarding

3. **Network issues** - Temporarily disconnect network
   - Expected: Retry logic, graceful error messages

4. **Auth timeout** - Don't complete browser auth
   - Expected: Clear error, instructions to retry

5. **Low scores** - Example gets <80% review score
   - Expected: Continues anyway, notes as educational

### Success Criteria

- [ ] Total time <5 minutes
- [ ] Minimal user interaction (just approval + auth)
- [ ] Generates all outputs (summary, report, artifacts)
- [ ] Error messages are helpful
- [ ] Works on clean machine

## Contributing Your Adapter

Have an adapter for a new tool? We'd love to include it!

**Steps:**
1. Create adapter following this guide
2. Test thoroughly (all test cases above)
3. Add README documenting usage
4. Submit PR to `adapters/[tool-name]/`

**PR should include:**
- Adapter file(s) in correct format
- README.md with usage instructions
- Test notes (what you tested, results)
- Example invocation

## Examples in This Repository

| Tool | Format | Location | Usage |
|------|--------|----------|-------|
| Claude Code | Skill markdown | `adapters/claude-code/` | `/tessl-onboarding` |
| Cursor | .cursorrules | `adapters/cursor/` | "Set up Tessl" |
| GitHub Copilot | Copilot instructions | `adapters/copilot/` | "Set up Tessl" |

## Questions?

- Check existing adapters for examples
- Read `TESSL_ONBOARDING.md` to understand the flow
- Open an issue if you need help creating an adapter

---

**Remember:** The adapter is just a thin wrapper. `TESSL_ONBOARDING.md` does the heavy lifting!
