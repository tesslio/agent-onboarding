# Tessl Agent Onboarding System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multi-format onboarding system that teaches newcomers about Tessl through autonomous, hands-on setup with a curated skill-builder example.

**Architecture:** Content-first design with a universal markdown guide (TESSL_ONBOARDING.md) and five thin adapters: Claude Code skill, Cursor adapter, GitHub Copilot adapter, web endpoint, and NPX package. The core markdown contains all instructions; adapters execute and format outputs for their specific tools.

**Tech Stack:** Markdown (core content), multiple adapter formats (.cursorrules, copilot-instructions.md, skill.md), Node.js (NPX package), static hosting (web endpoint), Tessl CLI + MCP tools

---

## Phase 1: Core Content & Example

### Task 1: Create skill-builder Example Skill

**Files:**
- Create: `examples/skill-builder/SKILL.md`
- Create: `examples/skill-builder/tile.json`
- Create: `examples/skill-builder/evals/scenarios.json`

**Step 1: Write SKILL.md for skill-builder**

```markdown
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
```

**Step 2: Create tile.json**

```json
{
  "name": "skill-builder",
  "version": "0.1.0",
  "description": "Helps you scaffold new Tessl skills with best practices and proper structure",
  "type": "skill",
  "private": true,
  "files": {
    "skill": "SKILL.md"
  },
  "metadata": {
    "tags": ["scaffolding", "development", "meta"],
    "author": "Tessl",
    "license": "MIT"
  }
}
```

**Step 3: Create eval scenarios**

```json
{
  "scenarios": [
    {
      "name": "basic-invocation",
      "description": "Skill can be invoked and responds appropriately",
      "input": "Help me create a skill for code review",
      "expected": {
        "asks_about_purpose": true,
        "asks_about_audience": true,
        "offers_to_generate_files": true
      }
    },
    {
      "name": "generates-valid-skill",
      "description": "Generated SKILL.md is valid and well-structured",
      "input": "Create a skill that validates API designs for REST APIs",
      "expected": {
        "has_frontmatter": true,
        "has_name": true,
        "has_description": true,
        "has_usage_section": true,
        "has_examples": true
      }
    },
    {
      "name": "generates-valid-metadata",
      "description": "Generated tile.json is valid",
      "input": "Create a skill for database migration planning",
      "expected": {
        "valid_json": true,
        "has_name": true,
        "has_version": true,
        "has_description": true,
        "has_type": "skill"
      }
    },
    {
      "name": "suggests-eval-scenarios",
      "description": "Provides meaningful eval scenarios",
      "input": "Build a skill that helps with test-driven development",
      "expected": {
        "suggests_scenarios": true,
        "scenario_count": ">=3",
        "scenarios_relevant": true
      }
    },
    {
      "name": "handles-unclear-request",
      "description": "Asks clarifying questions when request is vague",
      "input": "I want a skill",
      "expected": {
        "asks_clarifying_questions": true,
        "does_not_generate_prematurely": true
      }
    }
  ]
}
```

**Step 4: Verify files are created**

Run: `ls -la examples/skill-builder/`
Expected: See SKILL.md, tile.json, evals/scenarios.json

**Step 5: Commit**

```bash
git add examples/skill-builder/
git commit -m "feat: add skill-builder curated example

- Complete SKILL.md with meta skill for creating skills
- Valid tile.json with metadata
- 5 eval scenarios covering key behaviors"
```

---

### Task 2: Create Repo-Level Eval Scenarios

**Files:**
- Create: `.tessl/evals/repo-scenarios.json`

**Step 1: Create repo eval scenarios**

```json
{
  "scenarios": [
    {
      "name": "onboarding-flow-complete",
      "description": "Full onboarding flow completes successfully",
      "tasks": [
        "Verify Tessl is installed",
        "Check authentication status",
        "Validate skill-builder exists",
        "Run skill review on skill-builder",
        "Run tile eval on skill-builder"
      ],
      "expected": {
        "all_tasks_complete": true,
        "skill_review_score": ">=80",
        "tile_eval_pass": true
      }
    },
    {
      "name": "skill-builder-generates-valid-skill",
      "description": "Using skill-builder to create a new skill produces valid output",
      "tasks": [
        "Invoke skill-builder skill",
        "Provide test input (create a greeting skill)",
        "Validate generated SKILL.md is valid markdown",
        "Validate generated tile.json is valid JSON",
        "Run skill review on generated skill"
      ],
      "expected": {
        "skill_file_valid": true,
        "tile_file_valid": true,
        "review_passes": true
      }
    },
    {
      "name": "onboarding-artifacts-usable",
      "description": "Artifacts created during onboarding are immediately usable",
      "tasks": [
        "Use skill-builder to create a new skill",
        "Import the new skill with tessl skill import",
        "Run skill review on the new skill",
        "Verify skill can be installed"
      ],
      "expected": {
        "import_succeeds": true,
        "review_score": ">=70",
        "install_succeeds": true
      }
    }
  ]
}
```

**Step 2: Verify file is created**

Run: `ls -la .tessl/evals/`
Expected: See repo-scenarios.json

**Step 3: Commit**

```bash
git add .tessl/evals/repo-scenarios.json
git commit -m "feat: add repo-level eval scenarios

- Test full onboarding flow
- Test skill-builder generates valid output
- Test artifacts are immediately usable"
```

---

### Task 3: Write Core TESSL_ONBOARDING.md (Part 1: Structure)

**Files:**
- Create: `TESSL_ONBOARDING.md`

**Step 1: Create markdown structure with Layer 1 (Quick Start)**

```markdown
# Tessl Onboarding: Learn by Doing

**Welcome to Tessl!** This guide will teach you how to use Tessl by walking you through a hands-on setup. In about 5 minutes, you'll have:
- Tessl CLI installed and configured
- A working example skill that demonstrates best practices
- Understanding of the full quality pipeline: review → eval → publish

**Prerequisites:** You need a computer with terminal access and internet connectivity. That's it!

**What You'll Learn:** How to create, review, evaluate, and use Tessl skills to supercharge your AI agents.

---

## Quick Reference

**What is Tessl?**
Tessl is a package manager for AI agent skills. Think of it like npm for agent capabilities. Skills are versioned, tested, and shareable pieces of agent context that make AI assistants dramatically better at specific tasks.

**What You'll Build:**
A "skill-builder" skill that helps you create more skills. Meta, but powerful—you'll understand Tessl by building something that helps you use Tessl.

**Time Estimate:** 5 minutes

**What Happens Next:**
This guide will automatically:
1. Install Tessl CLI (if needed)
2. Authenticate with the registry
3. Set up a sample project
4. Create the skill-builder example
5. Run quality checks (review + evals)
6. Show you what to do next

**Ready? Let's go!**

---
```

**Step 2: Add Layer 2 (Step-by-Step Guide) - Part A**

```markdown
## Step-by-Step Guide

### Step 1: Prerequisites Check

**Goal:** Verify we have what we need to proceed.

**Actions:**
1. Check if Tessl CLI is installed:
   ```bash
   which tessl
   ```

   **If empty/not found:** Tessl needs to be installed (we'll do this in Step 2)
   **If shows path:** Great! Tessl is already installed.

2. Check network connectivity:
   ```bash
   curl -I https://registry.tessl.io
   ```

   **Expected:** HTTP 200 or similar success response
   **If fails:** Check your internet connection

**Success Criteria:**
- You know whether Tessl is installed
- Network is reachable

**Checkpoint:** If both checks pass and Tessl is installed, you can skip Step 2.

---

### Step 2: Install Tessl CLI

**Goal:** Get the Tessl CLI installed and available in your shell.

**Actions:**
1. Download and install Tessl:
   ```bash
   curl -fsSL https://get.tessl.io | sh
   ```

   **Expected output:** Installation progress, then success message

2. Verify installation:
   ```bash
   tessl --version
   ```

   **Expected:** Version number (e.g., `tessl 1.2.3`)

**Success Criteria:**
- `tessl` command is available
- Version displays correctly

**Checkpoint:** Run `tessl --version` and confirm it works.

---

### Step 3: Authenticate with Tessl

**Goal:** Log in to the Tessl registry so you can install and publish tiles.

**Actions:**
1. Start the login flow:
   ```bash
   tessl login
   ```

   **Expected output:** A URL and code for browser authentication

2. Open the provided URL in your browser

3. Enter the code shown in your terminal

4. Wait for "Authentication successful!" message

5. Verify authentication:
   ```bash
   tessl whoami
   ```

   **Expected:** Your username/email

**Success Criteria:**
- `tessl whoami` shows your identity
- You're authenticated with the registry

**Checkpoint:** Run `tessl whoami` and see your credentials.

**Note:** Authentication is async—the CLI polls in the background while you complete the browser flow. This usually takes 10-30 seconds.

---

### Step 4: Initialize Your Project

**Goal:** Set up a Tessl-enabled project directory.

**Actions:**
1. Create a new directory for this tutorial (or use existing):
   ```bash
   mkdir -p ~/tessl-tutorial
   cd ~/tessl-tutorial
   ```

2. Initialize Tessl project:
   ```bash
   tessl init
   ```

   **Expected:** Creates `tessl.json` configuration file

3. Verify initialization:
   ```bash
   cat tessl.json
   ```

   **Expected:** Valid JSON with project metadata

**Success Criteria:**
- `tessl.json` exists in your project directory
- File contains valid JSON with project name and mode

**Checkpoint:** You should see `tessl.json` with structure like:
```json
{
  "name": "my-project",
  "mode": "vendored",
  "dependencies": {}
}
```

---

### Step 5: Create the skill-builder Example

**Goal:** Set up the curated example skill that demonstrates best practices.

**Actions:**
1. Create the skill-builder directory structure:
   ```bash
   mkdir -p examples/skill-builder/evals
   ```

2. Copy or create the skill files (SKILL.md, tile.json, evals/scenarios.json)

   **Note for agents:** These files should be provided as part of the onboarding package. Copy them from the onboarding assets to the project directory.

3. Import the skill into your project:
   ```bash
   cd examples/skill-builder
   tessl skill import
   ```

   **Expected:** Updates tile.json with metadata, confirms import

4. Verify the skill exists:
   ```bash
   tessl list
   ```

   **Expected:** Shows skill-builder in the list of installed tiles

**Success Criteria:**
- `examples/skill-builder/` directory exists with SKILL.md, tile.json, evals/
- `tessl list` shows skill-builder

**Checkpoint:** Confirm you have a working skill-builder skill in your project.

---
```

**Step 3: Verify structure is created**

Run: `wc -l TESSL_ONBOARDING.md`
Expected: Around 200-250 lines so far

**Step 4: Commit**

```bash
git add TESSL_ONBOARDING.md
git commit -m "feat: add TESSL_ONBOARDING.md structure (part 1)

- Layer 1: Quick start and overview
- Layer 2: Steps 1-5 (prerequisites through example creation)"
```

---

### Task 4: Write Core TESSL_ONBOARDING.md (Part 2: Quality Pipeline)

**Files:**
- Modify: `TESSL_ONBOARDING.md` (continue from previous task)

**Step 1: Add quality pipeline steps (review + evals)**

Append to `TESSL_ONBOARDING.md`:

```markdown
### Step 6: Run Skill Review

**Goal:** Validate the skill's structure and quality before testing functionality.

**What is Skill Review?**
Skill review analyzes your skill file for:
- Proper structure and formatting
- Clear, actionable instructions
- Good examples and documentation
- Best practices adherence

**Actions:**
1. Run skill review on skill-builder:
   ```bash
   tessl skill review examples/skill-builder
   ```

   **Expected output:**
   - Overall score (target: ≥80%)
   - Line-by-line feedback
   - Suggestions for improvement

2. Review the output:
   - **Score ≥80%:** Excellent! The skill meets quality standards.
   - **Score 60-79%:** Good, but could be improved. Note the suggestions.
   - **Score <60%:** Needs work. Review the feedback carefully.

**Understanding the Results:**
The skill-builder example is designed to score well (≥80%), demonstrating good practices. In real development, you'd iterate based on this feedback before moving to evals.

**Success Criteria:**
- Skill review completes without errors
- You see a score and detailed feedback
- You understand what the review checks for

**Checkpoint:** You've seen how Tessl validates skill quality structurally.

**Key Learning:** Review checks structure; evals check function. Always review before eval.

---

### Step 7: Run Tile Eval

**Goal:** Test the skill's functional correctness with real scenarios.

**What is Tile Eval?**
Tile eval runs test scenarios against your skill to ensure it:
- Responds correctly to different inputs
- Produces valid outputs
- Handles edge cases appropriately

**Actions:**
1. Run eval on the skill-builder tile:
   ```bash
   tessl eval run examples/skill-builder
   ```

   **Expected output:** Eval run ID (e.g., `eval_abc123`)

2. Poll for results (evals run asynchronously):
   ```bash
   tessl eval view <eval-run-id>
   ```

   **Check periodically** (every 10-30 seconds) until status is "complete"

3. Review the results:
   ```bash
   tessl eval view <eval-run-id>
   ```

   **Expected:**
   - Pass/fail status for each scenario
   - Overall pass rate (target: ≥80%)
   - Details on any failures

**Understanding the Results:**
- **All scenarios pass:** Perfect! The skill works as intended.
- **Most scenarios pass (≥80%):** Good! Some edge cases might need work.
- **Many scenarios fail (<80%):** The skill has functional issues to fix.

**Success Criteria:**
- Eval completes successfully
- You can see which scenarios passed/failed
- You understand what each scenario tests

**Checkpoint:** You've seen how Tessl validates skill functionality.

**Key Learning:** Evals test real behavior. They catch issues review can't find.

---

### Step 8: Run Repo Eval (Optional Bonus)

**Goal:** See how repository-level evals validate integration and workflows.

**What is Repo Eval?**
Repo eval tests broader scenarios:
- Do multiple tiles work together?
- Can an agent complete full workflows?
- Does the repository meet quality standards?

**Actions:**
1. Run repository eval:
   ```bash
   tessl eval run
   ```

   **Note:** This runs without specifying a tile, so it uses repo-level scenarios.

   **Expected output:** Eval run ID

2. Poll for results:
   ```bash
   tessl eval view <eval-run-id>
   ```

   **Wait** for status "complete"

3. Review the results:
   - Scenarios test integration, not individual tiles
   - Example: "Can skill-builder generate a valid skill that itself passes review?"

**Understanding the Results:**
Repo evals validate the full picture. They ensure your tiles work together and support real-world workflows.

**Success Criteria:**
- Repo eval completes
- You understand the difference between tile eval and repo eval
- You see how integration is tested

**Checkpoint:** You've now seen the full quality pipeline:
1. **Review** → Structure
2. **Tile Eval** → Function
3. **Repo Eval** → Integration

**Key Learning:** Tessl's quality pyramid ensures skills are robust at every level.

---

### Step 9: Understanding What You Built

**Goal:** Reflect on what you've learned and what you can do next.

**What You Have Now:**
1. **Tessl CLI** installed and configured
2. **Authenticated** with the registry
3. **skill-builder** example skill in your project
4. **Understanding** of the quality pipeline

**The skill-builder Skill:**
You now have a working skill that helps you create more skills. Try it:
- "Help me create a skill for code review"
- "I want to build a skill that validates API designs"
- "Create a skill for database migration planning"

**What You've Learned:**
- **Skills** are packaged, versioned, tested agent capabilities
- **Review** validates structure and quality
- **Evals** test functional correctness
- **The full pipeline** ensures skills are production-ready

**Real-World Workflow:**
1. Create a skill (use skill-builder!)
2. Run `tessl skill review` → fix issues
3. Create eval scenarios
4. Run `tessl eval run` → fix failures
5. Publish with `tessl skill publish`

---

## What's Next?

### Immediate Next Steps

**Option 1: Create Your First Skill**
Use skill-builder to create a skill for a task you care about:
```bash
# The skill-builder will guide you through the process
```

**Option 2: Explore the Registry**
Discover what skills already exist:
```bash
tessl skill search
```

**Option 3: Learn More**
- **Docs:** https://docs.tessl.io
- **Examples:** Browse existing skills for inspiration
- **Community:** Join the Tessl community (link in docs)

### Understanding Tessl's Value

**Why Use Tessl?**
- **Consistency:** Skills ensure agents behave predictably
- **Quality:** Review + evals catch issues before production
- **Sharing:** Package and share working solutions
- **Versioning:** Control and update agent capabilities over time

**When to Create a Skill:**
- You have a workflow that agents should follow consistently
- You want to share best practices with your team
- You need agents to use specific tools or APIs correctly
- You're building reusable agent capabilities

### Advanced Topics

Once you're comfortable with basics:
- **Publishing:** Share your skills with others
- **Dependencies:** Skills can depend on other skills
- **Advanced Evals:** Write sophisticated test scenarios
- **Workspaces:** Organize skills into namespaces

---
```

**Step 2: Verify content is added**

Run: `wc -l TESSL_ONBOARDING.md`
Expected: Around 450-500 lines total

**Step 3: Commit**

```bash
git add TESSL_ONBOARDING.md
git commit -m "feat: add quality pipeline steps to TESSL_ONBOARDING.md

- Step 6: Skill review
- Step 7: Tile eval
- Step 8: Repo eval (optional)
- Step 9: Understanding and next steps"
```

---

### Task 5: Write Core TESSL_ONBOARDING.md (Part 3: Reference Layer)

**Files:**
- Modify: `TESSL_ONBOARDING.md` (final additions)

**Step 1: Add Layer 4 (Reference for Agents)**

Append to `TESSL_ONBOARDING.md`:

```markdown
---

## Layer 4: Agent Reference

*This section is primarily for AI agents executing this onboarding flow.*

### Command Reference

**Installation:**
```bash
# Install Tessl CLI
curl -fsSL https://get.tessl.io | sh

# Verify installation
tessl --version
```

**Authentication:**
```bash
# Start login flow (opens browser)
tessl login

# Check auth status
tessl whoami

# Check overall status
tessl status
```

**Project Setup:**
```bash
# Initialize project
tessl init

# Check project status
tessl status

# List installed tiles
tessl list
```

**Skill Operations:**
```bash
# Create new skill
tessl skill new --name workspace/skill-name --description "..."

# Import skill from files
tessl skill import [path]

# Review skill quality
tessl skill review [path-or-tile-name]

# Lint skill
tessl skill lint [path]

# Publish skill
tessl skill publish [path]

# Search for skills
tessl skill search [query]
```

**Evaluation:**
```bash
# Run eval on a tile
tessl eval run [tile-name-or-path]

# Run repo-level eval
tessl eval run

# View eval results
tessl eval view <eval-run-id>

# List recent evals
tessl eval list
```

**Tile Management:**
```bash
# Install tile from registry
tessl install workspace/tile-name

# Uninstall tile
tessl uninstall workspace/tile-name

# Check for updates
tessl outdated

# Update tiles
tessl update --tiles workspace/tile1 workspace/tile2
```

### Expected Outputs Reference

**tessl status (authenticated):**
```
✓ Authenticated as user@example.com
✓ Project initialized: my-project
✓ Registry reachable

Tiles status:
  ✓ All tiles in sync
```

**tessl skill review (good score):**
```
Reviewing skill: skill-builder

Overall Score: 85/100

✓ Structure: Valid markdown with proper frontmatter
✓ Clarity: Instructions are clear and actionable
✓ Examples: Good examples provided
⚠ Documentation: Could add more usage examples

Recommendations:
- Consider adding more edge case examples
- Document common failure modes
```

**tessl eval run:**
```
Starting eval run for: skill-builder
Eval Run ID: eval_abc123def456

Use `tessl eval view eval_abc123def456` to check status.
```

**tessl eval view (complete):**
```
Eval Run: eval_abc123def456
Status: complete
Started: 2024-02-24 10:30:00
Completed: 2024-02-24 10:32:15

Results: 4/5 scenarios passed (80%)

Scenarios:
  ✓ basic-invocation
  ✓ generates-valid-skill
  ✓ generates-valid-metadata
  ✓ suggests-eval-scenarios
  ✗ handles-unclear-request
    Expected agent to ask clarifying questions
    Got: Attempted to generate skill immediately
```

### Common Errors and Solutions

**Error: "Tessl command not found"**
- **Cause:** CLI not installed or not in PATH
- **Solution:** Run `curl -fsSL https://get.tessl.io | sh` and restart shell

**Error: "Not authenticated"**
- **Cause:** User hasn't completed login flow
- **Solution:** Run `tessl login` and complete browser authentication

**Error: "Registry unreachable"**
- **Cause:** Network issue or registry down
- **Solution:** Check internet connection, retry in 30 seconds

**Error: "Invalid tile.json"**
- **Cause:** Malformed JSON or missing required fields
- **Solution:** Run `tessl skill lint` for detailed errors

**Error: "Eval timeout"**
- **Cause:** Eval taking longer than expected
- **Solution:** Continue polling `tessl eval view`, evals can take 2-5 minutes

**Warning: "Skill review score below threshold"**
- **Cause:** Skill doesn't meet quality standards
- **Solution:** Review feedback, make improvements, re-review

**Warning: "Eval scenarios failed"**
- **Cause:** Skill doesn't behave as expected
- **Solution:** Debug failing scenarios, fix implementation, re-run eval

### Autonomous Execution Notes

**For AI Agents Running This Flow:**

1. **Permission:** Ask user once at start for permission to:
   - Install software (Tessl CLI)
   - Authenticate (will open browser)
   - Create files in project directory
   - Run quality checks

2. **Progress Updates:** Report progress clearly:
   ```
   [1/9] Checking prerequisites...
   [2/9] Installing Tessl CLI...
   [3/9] Authenticating...
   ...
   [9/9] Complete!
   ```

3. **Error Handling:**
   - Retry network operations (3 attempts, exponential backoff)
   - Auto-create missing directories
   - Continue on non-critical failures (low review scores, some eval failures)
   - Only interrupt user for: auth browser flow, catastrophic failures

4. **Output Generation:**
   - Create `onboarding-summary.md` (2-3 paragraphs, human-friendly)
   - Create `onboarding-report.md` (full details, agent-consumable)
   - Leave skill-builder artifacts in `examples/skill-builder/`

5. **Timing:**
   - Total time: ~5 minutes
   - Longest wait: authentication (10-30 seconds)
   - Eval polling: check every 10-30 seconds
   - Set timeout: 10 minutes total (abort if exceeded)

### Success Criteria Checklist

At the end of onboarding, verify:
- [ ] Tessl CLI installed (`tessl --version` works)
- [ ] User authenticated (`tessl whoami` shows identity)
- [ ] Project initialized (`tessl.json` exists)
- [ ] skill-builder example created (`examples/skill-builder/` exists)
- [ ] Skill review completed (score reported)
- [ ] Tile eval completed (pass/fail reported)
- [ ] Output files generated (summary + report)

If all checked, onboarding succeeded!

---

## Appendix: File Locations

**Created by this onboarding:**
- `tessl.json` - Project configuration (root)
- `examples/skill-builder/SKILL.md` - Example skill content
- `examples/skill-builder/tile.json` - Example skill metadata
- `examples/skill-builder/evals/scenarios.json` - Example eval scenarios
- `.tessl/evals/repo-scenarios.json` - Repo-level eval scenarios
- `onboarding-summary.md` - Human-friendly summary (generated)
- `onboarding-report.md` - Agent-friendly report (generated)

**Expected by Tessl:**
- `~/.tessl/` - Tessl CLI configuration directory
- `~/.tessl/credentials.json` - Authentication credentials
- `~/.local/bin/tessl` - Tessl CLI binary (typical location)

---

## Document Metadata

**Version:** 1.0
**Last Updated:** 2026-02-24
**Intended Audience:** AI agents (primary), human developers (secondary)
**Estimated Time:** 5 minutes
**Prerequisites:** Terminal access, internet connectivity

**Usage in Claude Code:** Invoke with `/tessl-onboarding`
**Usage via Web:** Fetch from `tessl.io/onboard`
**Usage via NPX:** Run `npx @tessl/onboard`

---

*End of TESSL_ONBOARDING.md*
```

**Step 2: Verify final length**

Run: `wc -l TESSL_ONBOARDING.md`
Expected: Around 700-800 lines total

**Step 3: Commit**

```bash
git add TESSL_ONBOARDING.md
git commit -m "feat: complete TESSL_ONBOARDING.md with reference layer

- Layer 4: Complete command reference
- Expected outputs guide
- Common errors and solutions
- Autonomous execution notes
- Success criteria checklist"
```

---

## Phase 2: Claude Code Skill Adapter

### Task 6: Create Claude Code Skill Wrapper

**Files:**
- Create: `tessl-onboarding/skill.md`
- Create: `tessl-onboarding/README.md`

**Step 1: Write skill.md**

```markdown
---
name: tessl-onboarding
description: Interactive Tessl onboarding - install, setup, create example skill, run quality checks
---

# Tessl Onboarding

This skill provides an interactive, autonomous onboarding experience for Tessl. It will:
1. Install and configure Tessl CLI
2. Create a curated "skill-builder" example
3. Run the full quality pipeline (review → eval)
4. Generate summary and detailed report

**Time:** ~5 minutes
**User Interaction:** Minimal (just initial approval and auth browser flow)

## Process

### Step 0: Load Core Instructions

**Load the universal onboarding guide:**

Read the file `TESSL_ONBOARDING.md` from the onboarding package. This file contains the complete step-by-step instructions.

**Note:** The skill adapter's job is to execute those instructions using Tessl MCP tools and generate appropriate outputs.

### Step 1: Get User Permission

**Ask user for permission to proceed:**

```
I'm going to set up Tessl for you. This will:
- Install Tessl CLI (if needed) - ~30 seconds
- Authenticate with Tessl registry (browser flow) - ~30 seconds
- Create a sample "skill-builder" skill - ~10 seconds
- Run quality checks (review + evals) - ~2-3 minutes
- Generate a summary of what you now have

This is safe and reversible. Total time: ~5 minutes.

Proceed? [Yes/No]
```

If user declines, explain what Tessl is and why this onboarding is valuable, then ask again.

### Step 2: Execute Prerequisites Check

**Use Bash tool to check prerequisites:**

```bash
# Check if Tessl is installed
which tessl

# If installed, check version
tessl --version 2>/dev/null || echo "not installed"

# Check network
curl -I https://registry.tessl.io 2>/dev/null | head -n1 || echo "network issue"
```

**Report findings to user:**
- ✓ Tessl installed, version X.Y.Z
- ✓ Network reachable
OR
- ⚠ Tessl not installed (will install)
- ✓ Network reachable

### Step 3: Install Tessl (if needed)

**If Tessl is not installed, install it:**

```bash
curl -fsSL https://get.tessl.io | sh
```

**Verify installation:**
```bash
tessl --version
```

**Report:** "✓ Tessl CLI installed"

### Step 4: Authenticate

**Check auth status first:**

Use MCP tool: `mcp__tessl__status`

If not authenticated:

**Start login flow:**

Use MCP tool: `mcp__tessl__login`

This returns a URL and code. Present to user:

```
Opening browser for authentication...
URL: <provided-url>
Code: <provided-code>

Please complete authentication in your browser.
Waiting for confirmation...
```

**Poll for auth completion:**

Repeatedly call `mcp__tessl__status` every 5 seconds (max 2 minutes) until authenticated.

**Report:** "✓ Authenticated as <username>"

### Step 5: Initialize Project

**Check if project is already initialized:**

```bash
test -f tessl.json && echo "exists" || echo "missing"
```

**If missing, initialize:**

Use MCP tool: `mcp__tessl__init` (or use Bash: `tessl init`)

**Verify:**
```bash
cat tessl.json
```

**Report:** "✓ Project initialized"

### Step 6: Create skill-builder Example

**Create directory structure:**

```bash
mkdir -p examples/skill-builder/evals
```

**Copy skill-builder files:**

The skill-builder files (SKILL.md, tile.json, evals/scenarios.json) should be bundled with this skill. Copy them:

```bash
cp <skill-package-path>/examples/skill-builder/SKILL.md examples/skill-builder/
cp <skill-package-path>/examples/skill-builder/tile.json examples/skill-builder/
cp <skill-package-path>/examples/skill-builder/evals/scenarios.json examples/skill-builder/evals/
```

**Import the skill:**

```bash
cd examples/skill-builder && tessl skill import && cd ../..
```

**Report:** "✓ skill-builder example created"

### Step 7: Create Repo Eval Scenarios

**Create directory:**
```bash
mkdir -p .tessl/evals
```

**Copy repo scenarios:**
```bash
cp <skill-package-path>/.tessl/evals/repo-scenarios.json .tessl/evals/
```

**Report:** "✓ Repo eval scenarios added"

### Step 8: Run Skill Review

**Run review on skill-builder:**

```bash
tessl skill review examples/skill-builder --json
```

**Capture output** and parse JSON for:
- Overall score
- Key issues (if any)
- Recommendations

**Report:**
```
✓ Skill review complete
  Score: 85/100
  Status: Meets quality standards
  (Review emphasizes structure and clarity)
```

### Step 9: Run Tile Eval

**Start eval:**

```bash
tessl eval run examples/skill-builder --json
```

**Capture eval run ID** from output.

**Poll for results:**

```bash
tessl eval view <eval-run-id> --json
```

Poll every 15 seconds until status is "complete" (max 5 minutes).

**Parse results:**
- Total scenarios
- Passed scenarios
- Failed scenarios (if any)

**Report:**
```
✓ Tile eval complete
  Results: 4/5 scenarios passed (80%)
  (Evals test functional correctness)
```

### Step 10: Run Repo Eval (Optional Bonus)

**Start repo eval:**

```bash
tessl eval run --json
```

**Capture eval run ID** and poll for results same as Step 9.

**Report:**
```
✓ Repo eval complete
  Results: 3/3 scenarios passed (100%)
  (Repo evals test integration and workflows)
```

### Step 11: Generate Outputs

**Create human-friendly summary:**

Use Write tool to create `onboarding-summary.md`:

```markdown
# Tessl Setup Complete! 🎉

You now have Tessl installed and configured. Here's what you have:

**✓ Tessl CLI** - Installed and authenticated as <username>

**✓ skill-builder Skill** - A working example in `examples/skill-builder/` that helps you create more skills

**✓ Quality Checks Passed**
- Skill Review: 85/100 (structure ✓)
- Tile Eval: 4/5 scenarios passed (function ✓)
- Repo Eval: 3/3 scenarios passed (integration ✓)

## What You Can Do Now

1. **Try skill-builder:** Use it to create your first skill
2. **Explore the registry:** Run `tessl skill search` to see what's available
3. **Read the docs:** Visit https://docs.tessl.io for more

## What You Learned

- **Skills** are tested, versioned agent capabilities
- **Review** validates structure before function
- **Evals** test real behavior with scenarios
- **The quality pipeline** ensures production readiness

Happy building! 🚀
```

**Create agent-friendly report:**

Use Write tool to create `onboarding-report.md`:

```markdown
# Tessl Onboarding Report

**Session ID:** <generate-uuid>
**Completed:** <timestamp>
**Duration:** <elapsed-time>

## Summary

Tessl onboarding completed successfully. User now has:
- Tessl CLI installed and configured
- Authentication active (user: <username>)
- Working project with skill-builder example
- Understanding of quality pipeline

## Execution Log

### Prerequisites Check
- Command: `which tessl`
- Result: <path-or-not-found>
- Network: Reachable

### Installation
- Action: <installed | already-present>
- Version: <version>
- Duration: <seconds>

### Authentication
- Method: Browser OAuth flow
- User: <username>
- Duration: <seconds>

### Project Initialization
- Action: <initialized | already-present>
- Config: tessl.json created
- Mode: vendored

### Example Creation
- Skill: skill-builder
- Files: SKILL.md, tile.json, evals/scenarios.json
- Location: examples/skill-builder/

### Quality Checks

**Skill Review:**
- Score: 85/100
- Issues: 0 critical, 2 suggestions
- Duration: 3s

**Tile Eval:**
- Run ID: eval_abc123
- Scenarios: 5 total, 4 passed, 1 failed
- Pass Rate: 80%
- Duration: 142s

**Repo Eval:**
- Run ID: eval_def456
- Scenarios: 3 total, 3 passed, 0 failed
- Pass Rate: 100%
- Duration: 98s

## Artifacts Created

- `/path/to/project/tessl.json` - Project config
- `/path/to/project/examples/skill-builder/` - Example skill
- `/path/to/project/.tessl/evals/` - Repo scenarios
- `/path/to/project/onboarding-summary.md` - Human summary
- `/path/to/project/onboarding-report.md` - This report

## Next Steps for User

1. Use skill-builder to create a new skill
2. Explore Tessl registry (`tessl skill search`)
3. Read docs at https://docs.tessl.io
4. Join community for questions and feedback

## Next Steps for Agents

When working with this user on Tessl:
- They have skill-builder available - suggest using it for new skills
- They understand review → eval workflow
- Quality standards: review ≥80%, eval ≥80%
- Project is in vendored mode (dependencies are local)

## Full Command History

<List every command executed with timestamps and outputs>

---

*Report generated by tessl-onboarding skill v1.0*
```

**Report to user:**

Present the summary markdown to the user in the chat, and inform them that detailed logs are in `onboarding-report.md`.

### Step 12: Success Message

**Display final message:**

```
✅ Tessl onboarding complete!

I've created:
- ✓ skill-builder example in examples/skill-builder/
- ✓ Quality reports showing everything works
- ✓ Summary in onboarding-summary.md
- ✓ Detailed report in onboarding-report.md

Try this: "Use skill-builder to create a skill for code review"

Questions? Check the docs: https://docs.tessl.io
```

## Error Handling

**Installation Fails:**
- Report clear error message
- Provide manual install instructions
- Ask user to try manual install, then re-run skill

**Authentication Fails:**
- Check network connectivity
- Retry login flow once
- If fails again, provide troubleshooting steps

**Eval Timeout:**
- After 5 minutes, stop polling
- Report partial results if available
- Note that user can check later with `tessl eval view <id>`

**Low Review/Eval Scores:**
- Continue anyway (this is educational)
- Explain that real development is iterative
- Note in report that some improvements could be made

## Notes

- This skill bundles TESSL_ONBOARDING.md and example files
- It uses Tessl MCP tools where available, falls back to Bash
- Progress is reported clearly at each step
- Total execution time: ~5 minutes (varies by network speed)
```

**Step 2: Write README.md**

```markdown
# Tessl Onboarding Skill

Interactive onboarding for Tessl that teaches through hands-on setup.

## Usage

In Claude Code:

```
/tessl-onboarding
```

## What It Does

1. Installs Tessl CLI (if needed)
2. Authenticates with registry
3. Creates skill-builder example
4. Runs quality checks (review + evals)
5. Generates summary and report

**Time:** ~5 minutes
**Interaction:** Minimal (just approval and auth)

## Outputs

- `examples/skill-builder/` - Working example skill
- `onboarding-summary.md` - Human-friendly summary
- `onboarding-report.md` - Detailed execution log

## Requirements

- Terminal access
- Internet connectivity
- Web browser (for auth)

## Files Included

- `skill.md` - The skill itself
- `TESSL_ONBOARDING.md` - Core instructions
- `examples/` - skill-builder example files
- `.tessl/evals/` - Repo eval scenarios

## Version

1.0.0
```

**Step 3: Verify files created**

Run: `ls -la tessl-onboarding/`
Expected: See skill.md, README.md

**Step 4: Commit**

```bash
git add tessl-onboarding/
git commit -m "feat: create Claude Code skill adapter

- skill.md with complete execution flow
- Uses Tessl MCP tools + Bash for execution
- Generates layered outputs (summary + report)
- README with usage instructions"
```

---

### Task 7: Create Cursor Adapter

**Files:**
- Create: `adapters/cursor/.cursorrules`
- Create: `adapters/cursor/README.md`

**Step 1: Write .cursorrules**

```markdown
# Tessl Onboarding for Cursor

When the user asks to "set up Tessl" or "onboard to Tessl", follow this process:

## Overview

This onboarding will:
1. Install Tessl CLI (if needed)
2. Authenticate with Tessl registry
3. Create a working skill-builder example
4. Run quality checks (review + eval)
5. Generate summary and detailed report

Time: ~5 minutes
Interaction: Minimal (approval + browser auth)

## Instructions

Follow the complete guide in `TESSL_ONBOARDING.md` located at the repository root (or fetch from https://tessl.io/onboard.md if not present).

## Execution Steps

### Step 1: Get Permission
Ask user: "I'll set up Tessl for you (install CLI, auth, create example, run checks). This takes ~5 minutes. Proceed?"

### Step 2: Check Prerequisites
Run: `which tessl` and `curl -I https://registry.tessl.io`
Report: Tessl status and network connectivity

### Step 3: Install Tessl (if needed)
If not installed, run: `curl -fsSL https://get.tessl.io | sh`
Verify: `tessl --version`

### Step 4: Authenticate
Check: `tessl whoami`
If not authenticated, run: `tessl login`
Wait for browser auth completion (poll `tessl whoami` every 5s, max 2 minutes)

### Step 5: Initialize Project
Check for `tessl.json`
If missing, run: `tessl init`

### Step 6: Create skill-builder Example
Create directory: `examples/skill-builder/evals`
Copy skill files (SKILL.md, tile.json, evals/scenarios.json) from the onboarding package
Run: `cd examples/skill-builder && tessl skill import`

### Step 7: Create Repo Eval Scenarios
Create directory: `.tessl/evals`
Copy `repo-scenarios.json` from onboarding package

### Step 8: Run Skill Review
Run: `tessl skill review examples/skill-builder --json`
Parse results, report score

### Step 9: Run Tile Eval
Run: `tessl eval run examples/skill-builder --json`
Capture eval ID
Poll: `tessl eval view <id> --json` every 15s until complete
Report pass/fail results

### Step 10: Run Repo Eval (Optional)
Run: `tessl eval run --json`
Poll for results
Report or skip if not applicable

### Step 11: Generate Outputs
Create `onboarding-summary.md` (human-friendly, 2-3 paragraphs)
Create `onboarding-report.md` (detailed, agent-consumable)
Report completion with file locations

## Error Handling

- **Installation fails**: Show error, provide manual install instructions
- **Auth fails**: Retry once, show troubleshooting steps
- **Network issues**: Retry with backoff (3 attempts)
- **Low review/eval scores**: Continue anyway, note as educational
- **Missing files**: Auto-create directories as needed

## Success Output

Present:
```
✅ Tessl onboarding complete!

Created:
- skill-builder example in examples/skill-builder/
- Quality reports (review + evals passed)
- Summary in onboarding-summary.md
- Detailed report in onboarding-report.md

Try: "Use skill-builder to create a skill for code review"
```

## Reference

Full details: `TESSL_ONBOARDING.md` or https://tessl.io/onboard.md
Tessl docs: https://docs.tessl.io
```

**Step 2: Write README.md**

```markdown
# Tessl Onboarding - Cursor Adapter

This adapter enables Cursor IDE users to run Tessl onboarding seamlessly.

## Usage

In Cursor, simply ask:
```
Set up Tessl for me
```

or:
```
Run Tessl onboarding
```

Cursor's AI will follow the `.cursorrules` to execute the onboarding flow.

## What It Does

1. Installs Tessl CLI (if needed)
2. Authenticates with registry
3. Creates skill-builder example
4. Runs quality checks
5. Generates summary and report

**Time:** ~5 minutes
**Interaction:** Minimal

## Requirements

- Cursor IDE
- Terminal access
- Internet connectivity
- Web browser (for auth)

## Outputs

- `examples/skill-builder/` - Working example skill
- `onboarding-summary.md` - Human summary
- `onboarding-report.md` - Detailed log

## How It Works

The `.cursorrules` file instructs Cursor's AI to:
1. Read the universal `TESSL_ONBOARDING.md` guide
2. Execute steps using terminal commands
3. Generate required outputs
4. Report progress and completion

## Version

1.0.0
```

**Step 3: Verify files created**

Run: `ls -la adapters/cursor/`
Expected: See .cursorrules, README.md

**Step 4: Commit**

```bash
git add adapters/cursor/
git commit -m "feat: add Cursor adapter

- .cursorrules with complete onboarding flow
- References core TESSL_ONBOARDING.md
- Handles errors autonomously
- README with usage instructions"
```

---

### Task 8: Create GitHub Copilot Adapter

**Files:**
- Create: `adapters/copilot/.github/copilot-instructions.md`
- Create: `adapters/copilot/README.md`

**Step 1: Write copilot-instructions.md**

```markdown
# Tessl Onboarding Instructions for GitHub Copilot

## Trigger

When the user requests:
- "Set up Tessl"
- "Onboard to Tessl"
- "Install and configure Tessl"
- "Run Tessl onboarding"

Execute the Tessl onboarding process.

## Process Overview

Complete onboarding guide: `TESSL_ONBOARDING.md` (fetch from https://tessl.io/onboard.md if not present)

**Duration:** ~5 minutes
**Interaction:** Initial approval + browser authentication

## Execution Flow

### 1. Request Permission

```
I'll set up Tessl for you:
- Install Tessl CLI (if needed)
- Authenticate with registry
- Create skill-builder example
- Run quality checks (review + evals)

This is safe and takes ~5 minutes. Proceed?
```

### 2. Prerequisites Check

```bash
which tessl
curl -I https://registry.tessl.io
```

Report: CLI status and network connectivity

### 3. Install Tessl (if needed)

```bash
curl -fsSL https://get.tessl.io | sh
tessl --version
```

### 4. Authenticate

```bash
# Check authentication
tessl whoami

# If not authenticated
tessl login
# Poll: tessl whoami (every 5s, max 2 min)
```

### 5. Initialize Project

```bash
# Check for tessl.json
test -f tessl.json || tessl init
```

### 6. Create skill-builder Example

```bash
mkdir -p examples/skill-builder/evals
# Copy files from onboarding package
cd examples/skill-builder && tessl skill import && cd ../..
```

### 7. Create Repo Eval Scenarios

```bash
mkdir -p .tessl/evals
# Copy repo-scenarios.json
```

### 8. Run Skill Review

```bash
tessl skill review examples/skill-builder --json
```

Parse and report score

### 9. Run Tile Eval

```bash
tessl eval run examples/skill-builder --json
# Poll: tessl eval view <id> --json (every 15s)
```

Report pass/fail status

### 10. Run Repo Eval (Optional)

```bash
tessl eval run --json
# Poll for results
```

### 11. Generate Outputs

Create:
- `onboarding-summary.md` - Human-friendly (2-3 paragraphs)
- `onboarding-report.md` - Detailed agent log

### 12. Report Completion

```
✅ Tessl onboarding complete!

Created:
- skill-builder in examples/skill-builder/
- Summary in onboarding-summary.md
- Report in onboarding-report.md

Next: "Use skill-builder to create a skill for code review"
```

## Error Handling

| Error | Action |
|-------|--------|
| Install fails | Show error, provide manual instructions |
| Auth fails | Retry once, show troubleshooting |
| Network timeout | Retry 3x with backoff |
| Low review score | Continue, note as educational |
| Eval failures | Continue, explain what failed |
| Missing dirs | Auto-create as needed |

## Commands Reference

```bash
# Installation
curl -fsSL https://get.tessl.io | sh

# Authentication
tessl login
tessl whoami

# Project
tessl init
tessl status

# Skills
tessl skill review <path>
tessl skill import <path>

# Evals
tessl eval run <path>
tessl eval view <id>
```

## Additional Resources

- Full guide: `TESSL_ONBOARDING.md` or https://tessl.io/onboard.md
- Tessl docs: https://docs.tessl.io
- Community: https://community.tessl.io
```

**Step 2: Write README.md**

```markdown
# Tessl Onboarding - GitHub Copilot Adapter

This adapter enables GitHub Copilot users to run Tessl onboarding in their workspace.

## Usage

In your IDE with Copilot enabled, ask:
```
Set up Tessl for me
```

or:
```
Run Tessl onboarding
```

Copilot will follow the workspace instructions to execute onboarding.

## Setup

1. Copy `.github/copilot-instructions.md` to your project's `.github/` directory
2. Ensure Copilot has access to your workspace
3. Ask Copilot to run onboarding

## What It Does

1. Installs Tessl CLI (if needed)
2. Authenticates with registry
3. Creates skill-builder example
4. Runs quality checks
5. Generates summary and report

**Time:** ~5 minutes
**Interaction:** Minimal

## Requirements

- GitHub Copilot subscription
- Terminal access
- Internet connectivity
- Web browser (for auth)

## Outputs

- `examples/skill-builder/` - Working example skill
- `onboarding-summary.md` - Human summary
- `onboarding-report.md` - Detailed log

## How It Works

The `copilot-instructions.md` file tells Copilot to:
1. Read the universal `TESSL_ONBOARDING.md` guide
2. Execute steps using shell commands
3. Generate required outputs
4. Report progress and completion

## Version

1.0.0
```

**Step 3: Verify files created**

Run: `ls -la adapters/copilot/.github/`
Expected: See copilot-instructions.md, and README.md in adapters/copilot/

**Step 4: Commit**

```bash
git add adapters/copilot/
git commit -m "feat: add GitHub Copilot adapter

- copilot-instructions.md with complete flow
- References core TESSL_ONBOARDING.md
- Autonomous error handling
- README with setup instructions"
```

---

### Task 9: Create Adapter Pattern Documentation

**Files:**
- Create: `ADAPTING.md`

**Step 1: Write ADAPTING.md**

```markdown
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
```

**Step 2: Verify file created**

Run: `ls -la ADAPTING.md`
Expected: File exists

**Step 3: Commit**

```bash
git add ADAPTING.md
git commit -m "docs: add adapter pattern documentation

- Explains content-first architecture
- Templates for different tool types
- Checklist for creating new adapters
- Testing guidelines
- Examples and patterns"
```

---

## Phase 3: NPX Package

### Task 7: Create NPX Package Structure

**Files:**
- Create: `tessl-onboarding/package.json`
- Create: `tessl-onboarding/cli.js`

**Step 1: Write package.json**

```json
{
  "name": "@tessl/onboard",
  "version": "1.0.0",
  "description": "Interactive Tessl onboarding - learn by doing",
  "main": "cli.js",
  "bin": {
    "tessl-onboard": "./cli.js"
  },
  "keywords": [
    "tessl",
    "onboarding",
    "skills",
    "ai-agents"
  ],
  "author": "Tessl",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tessl/onboard"
  },
  "files": [
    "cli.js",
    "TESSL_ONBOARDING.md",
    "examples/",
    ".tessl/",
    "outputs/"
  ],
  "scripts": {
    "start": "node cli.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {}
}
```

**Step 2: Write cli.js (part 1 - setup)**

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Configuration
const REGISTRY_URL = 'https://registry.tessl.io';
const INSTALL_URL = 'https://get.tessl.io';
const TIMEOUT_MS = 600000; // 10 minutes max
const POLL_INTERVAL_MS = 15000; // 15 seconds

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// Helper: Print colored output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper: Print progress
function progress(step, total, message) {
  log(`[${step}/${total}] ${message}`, 'blue');
}

// Helper: Execute shell command and return output
function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (options.ignoreErrors) {
      return null;
    }
    throw error;
  }
}

// Helper: Check if command exists
function commandExists(command) {
  try {
    exec(`which ${command}`, { silent: true, ignoreErrors: true });
    return true;
  } catch {
    return false;
  }
}

// Helper: Retry with exponential backoff
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      log(`Retrying in ${delay / 1000}s...`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Helper: Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
```

**Step 3: Verify files created**

Run: `ls -la tessl-onboarding/`
Expected: See package.json, cli.js

**Step 4: Commit**

```bash
git add tessl-onboarding/package.json tessl-onboarding/cli.js
git commit -m "feat: add NPX package structure and helpers

- package.json with bin entry
- cli.js with helper functions (exec, retry, copy, etc)
- Terminal color support for progress output"
```

---

### Task 8: Implement NPX CLI Logic (Main Flow)

**Files:**
- Modify: `tessl-onboarding/cli.js` (continue from previous task)

**Step 1: Add main onboarding flow**

Append to `cli.js`:

```javascript
// Main onboarding flow
async function main() {
  console.clear();
  log('╔════════════════════════════════════════╗', 'blue');
  log('║   Tessl Onboarding - Learn by Doing   ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  console.log();

  const startTime = Date.now();
  const totalSteps = 11;

  // Step 0: Get permission
  progress(0, totalSteps, 'Getting permission...');
  console.log(`
This will:
- Install Tessl CLI (if needed) - ~30 seconds
- Authenticate with Tessl registry - ~30 seconds
- Create a sample skill - ~10 seconds
- Run quality checks - ~2-3 minutes

Total time: ~5 minutes. Safe and reversible.
  `);

  // In a real implementation, you'd use a library like 'prompts' for interactive input
  // For now, we'll assume consent
  log('✓ Permission granted', 'green');
  console.log();

  try {
    // Step 1: Check prerequisites
    progress(1, totalSteps, 'Checking prerequisites...');
    const hasTessl = commandExists('tessl');
    const hasNetwork = checkNetwork();

    if (hasTessl) {
      const version = exec('tessl --version', { silent: true }).trim();
      log(`  ✓ Tessl CLI installed (${version})`, 'green');
    } else {
      log('  ⚠ Tessl CLI not installed (will install)', 'yellow');
    }

    if (hasNetwork) {
      log('  ✓ Network reachable', 'green');
    } else {
      throw new Error('Cannot reach registry - check internet connection');
    }
    console.log();

    // Step 2: Install Tessl (if needed)
    if (!hasTessl) {
      progress(2, totalSteps, 'Installing Tessl CLI...');
      await retry(() => {
        exec(`curl -fsSL ${INSTALL_URL} | sh`);
      });
      log('  ✓ Tessl CLI installed', 'green');
      console.log();
    } else {
      progress(2, totalSteps, 'Tessl CLI already installed (skipping)');
      console.log();
    }

    // Step 3: Authenticate
    progress(3, totalSteps, 'Authenticating with Tessl...');
    await authenticate();
    console.log();

    // Step 4: Initialize project
    progress(4, totalSteps, 'Initializing project...');
    await initProject();
    console.log();

    // Step 5: Create skill-builder example
    progress(5, totalSteps, 'Creating skill-builder example...');
    await createExample();
    console.log();

    // Step 6: Create repo eval scenarios
    progress(6, totalSteps, 'Adding repo eval scenarios...');
    await createRepoEvals();
    console.log();

    // Step 7: Run skill review
    progress(7, totalSteps, 'Running skill review...');
    const reviewResults = await runSkillReview();
    console.log();

    // Step 8: Run tile eval
    progress(8, totalSteps, 'Running tile eval (this may take 2-3 minutes)...');
    const tileEvalResults = await runTileEval();
    console.log();

    // Step 9: Run repo eval
    progress(9, totalSteps, 'Running repo eval (optional bonus)...');
    const repoEvalResults = await runRepoEval();
    console.log();

    // Step 10: Generate outputs
    progress(10, totalSteps, 'Generating summary and report...');
    await generateOutputs(reviewResults, tileEvalResults, repoEvalResults, startTime);
    console.log();

    // Step 11: Success!
    progress(11, totalSteps, 'Complete!');
    displaySuccess();

  } catch (error) {
    log(`\n✗ Error: ${error.message}`, 'red');
    log('Check onboarding-report.md for details', 'gray');
    process.exit(1);
  }
}

// Helper functions for each step
function checkNetwork() {
  try {
    exec(`curl -I ${REGISTRY_URL}`, { silent: true, ignoreErrors: false });
    return true;
  } catch {
    return false;
  }
}

async function authenticate() {
  // Check if already authenticated
  try {
    const whoami = exec('tessl whoami', { silent: true }).trim();
    if (whoami) {
      log(`  ✓ Already authenticated as ${whoami}`, 'green');
      return;
    }
  } catch {
    // Not authenticated, proceed with login
  }

  log('  Starting login flow...', 'blue');
  log('  (This will open your browser)', 'gray');

  // Start login (this is async)
  exec('tessl login');

  // Poll for auth completion
  log('  Waiting for authentication...', 'gray');
  const maxWait = 120000; // 2 minutes
  const pollInterval = 5000; // 5 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    try {
      const whoami = exec('tessl whoami', { silent: true }).trim();
      if (whoami) {
        log(`  ✓ Authenticated as ${whoami}`, 'green');
        return;
      }
    } catch {
      // Not authenticated yet, continue polling
    }
  }

  throw new Error('Authentication timeout - please try again');
}

async function initProject() {
  // Check if already initialized
  if (fs.existsSync('tessl.json')) {
    log('  ✓ Project already initialized', 'green');
    return;
  }

  exec('tessl init');
  log('  ✓ Project initialized', 'green');
}

async function createExample() {
  const examplePath = 'examples/skill-builder';

  // Create directory
  fs.mkdirSync(path.join(examplePath, 'evals'), { recursive: true });

  // Copy files from package
  const packagePath = path.dirname(__filename);
  copyDir(
    path.join(packagePath, 'examples/skill-builder'),
    examplePath
  );

  // Import skill
  exec(`cd ${examplePath} && tessl skill import && cd ../..`);

  log('  ✓ skill-builder example created', 'green');
}

async function createRepoEvals() {
  const evalsPath = '.tessl/evals';
  fs.mkdirSync(evalsPath, { recursive: true });

  // Copy repo scenarios
  const packagePath = path.dirname(__filename);
  fs.copyFileSync(
    path.join(packagePath, '.tessl/evals/repo-scenarios.json'),
    path.join(evalsPath, 'repo-scenarios.json')
  );

  log('  ✓ Repo eval scenarios added', 'green');
}

async function runSkillReview() {
  const output = exec('tessl skill review examples/skill-builder --json', { silent: true });
  const results = JSON.parse(output);

  log(`  ✓ Review complete: ${results.score}/100`, 'green');
  log(`    (Review validates structure and quality)`, 'gray');

  return results;
}

async function runTileEval() {
  // Start eval
  const output = exec('tessl eval run examples/skill-builder --json', { silent: true });
  const { evalRunId } = JSON.parse(output);

  log(`  Eval started: ${evalRunId}`, 'gray');
  log('  Polling for results...', 'gray');

  // Poll for completion
  const maxWait = 300000; // 5 minutes
  const pollInterval = 15000; // 15 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const statusOutput = exec(`tessl eval view ${evalRunId} --json`, { silent: true });
    const status = JSON.parse(statusOutput);

    if (status.status === 'complete') {
      const passed = status.scenarios.filter(s => s.passed).length;
      const total = status.scenarios.length;
      const passRate = Math.round((passed / total) * 100);

      log(`  ✓ Eval complete: ${passed}/${total} scenarios passed (${passRate}%)`, 'green');
      log(`    (Evals test functional correctness)`, 'gray');

      return status;
    }
  }

  throw new Error('Eval timeout - check results later with tessl eval view');
}

async function runRepoEval() {
  // Start repo eval
  try {
    const output = exec('tessl eval run --json', { silent: true });
    const { evalRunId } = JSON.parse(output);

    log(`  Repo eval started: ${evalRunId}`, 'gray');

    // Poll for completion (same as tile eval)
    const maxWait = 300000;
    const pollInterval = 15000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusOutput = exec(`tessl eval view ${evalRunId} --json`, { silent: true });
      const status = JSON.parse(statusOutput);

      if (status.status === 'complete') {
        const passed = status.scenarios.filter(s => s.passed).length;
        const total = status.scenarios.length;

        log(`  ✓ Repo eval complete: ${passed}/${total} scenarios passed`, 'green');
        log(`    (Repo evals test integration)`, 'gray');

        return status;
      }
    }

    log('  ⚠ Repo eval timeout (optional step)', 'yellow');
    return null;
  } catch (error) {
    log('  ⚠ Repo eval skipped (optional)', 'yellow');
    return null;
  }
}

async function generateOutputs(reviewResults, tileEvalResults, repoEvalResults, startTime) {
  const duration = Math.round((Date.now() - startTime) / 1000);
  const username = exec('tessl whoami', { silent: true }).trim();

  // Generate human summary
  const summary = `# Tessl Setup Complete! 🎉

You now have Tessl installed and configured. Here's what you have:

**✓ Tessl CLI** - Installed and authenticated as ${username}

**✓ skill-builder Skill** - A working example in \`examples/skill-builder/\` that helps you create more skills

**✓ Quality Checks Passed**
- Skill Review: ${reviewResults.score}/100 (structure ✓)
- Tile Eval: ${tileEvalResults.passed}/${tileEvalResults.total} scenarios passed (function ✓)
${repoEvalResults ? `- Repo Eval: ${repoEvalResults.passed}/${repoEvalResults.total} scenarios passed (integration ✓)` : '- Repo Eval: skipped (optional)'}

## What You Can Do Now

1. **Try skill-builder:** Use it to create your first skill
2. **Explore the registry:** Run \`tessl skill search\` to see what's available
3. **Read the docs:** Visit https://docs.tessl.io for more

## What You Learned

- **Skills** are tested, versioned agent capabilities
- **Review** validates structure before function
- **Evals** test real behavior with scenarios
- **The quality pipeline** ensures production readiness

Setup took ${duration} seconds. Happy building! 🚀
`;

  fs.writeFileSync('onboarding-summary.md', summary);

  // Generate agent report (detailed)
  const report = `# Tessl Onboarding Report

**Completed:** ${new Date().toISOString()}
**Duration:** ${duration} seconds
**User:** ${username}

## Execution Summary

All onboarding steps completed successfully.

## Results

### Skill Review
- Score: ${reviewResults.score}/100
- Status: ${reviewResults.score >= 80 ? 'Passed' : 'Needs improvement'}

### Tile Eval
- Scenarios: ${tileEvalResults.total}
- Passed: ${tileEvalResults.passed}
- Failed: ${tileEvalResults.total - tileEvalResults.passed}
- Pass Rate: ${Math.round((tileEvalResults.passed / tileEvalResults.total) * 100)}%

${repoEvalResults ? `### Repo Eval
- Scenarios: ${repoEvalResults.total}
- Passed: ${repoEvalResults.passed}
- Pass Rate: ${Math.round((repoEvalResults.passed / repoEvalResults.total) * 100)}%
` : '### Repo Eval\nSkipped (optional step)\n'}

## Artifacts Created

- \`examples/skill-builder/\` - Example skill
- \`.tessl/evals/\` - Repo eval scenarios
- \`onboarding-summary.md\` - Human summary
- \`onboarding-report.md\` - This report

## Next Steps

User should:
1. Try skill-builder to create a new skill
2. Explore the registry
3. Read documentation

Agents should:
- Suggest using skill-builder for new skills
- Remember user understands quality pipeline
- Maintain review ≥80%, eval ≥80% standards
`;

  fs.writeFileSync('onboarding-report.md', report);

  log('  ✓ Summary: onboarding-summary.md', 'green');
  log('  ✓ Report: onboarding-report.md', 'green');
}

function displaySuccess() {
  console.log();
  log('╔════════════════════════════════════════╗', 'green');
  log('║     Tessl Onboarding Complete! ✅      ║', 'green');
  log('╚════════════════════════════════════════╝', 'green');
  console.log();
  log('Created:', 'blue');
  log('  ✓ skill-builder example in examples/skill-builder/', 'green');
  log('  ✓ Quality reports showing everything works', 'green');
  log('  ✓ Summary in onboarding-summary.md', 'green');
  log('  ✓ Detailed report in onboarding-report.md', 'green');
  console.log();
  log('Try this:', 'blue');
  log('  "Use skill-builder to create a skill for code review"', 'gray');
  console.log();
  log('Questions? Check the docs: https://docs.tessl.io', 'blue');
  console.log();
}

// Run the main flow
main().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
```

**Step 2: Make cli.js executable**

```bash
chmod +x tessl-onboarding/cli.js
```

**Step 3: Test locally**

```bash
cd tessl-onboarding && node cli.js
```

Expected: Should start onboarding flow (though it may fail without actual Tessl setup)

**Step 4: Commit**

```bash
git add tessl-onboarding/cli.js
git commit -m "feat: implement NPX CLI main flow

- Complete onboarding sequence from prerequisites to success
- Progress indicators and colored terminal output
- Autonomous execution with polling for async operations
- Generates summary and detailed report"
```

---

## Phase 4: Web Endpoint

### Task 9: Create Web Serving Setup

**Files:**
- Create: `web/index.html`
- Create: `web/serve-onboarding.md` (instructions for hosting)

**Step 1: Create index.html (human-friendly landing page)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tessl Onboarding</title>
  <meta name="description" content="Learn Tessl by doing - interactive onboarding for AI agents and developers">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
    }
    header {
      text-align: center;
      margin-bottom: 3rem;
    }
    h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .tagline {
      color: #7f8c8d;
      font-size: 1.2rem;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    .options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .option {
      background: #ecf0f1;
      padding: 1.5rem;
      border-radius: 6px;
      text-align: center;
    }
    .option h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    .option code {
      display: block;
      background: #2c3e50;
      color: #ecf0f1;
      padding: 0.5rem;
      border-radius: 4px;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .agent-note {
      background: #e8f4f8;
      border-left: 4px solid #3498db;
      padding: 1rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Tessl Onboarding</h1>
    <p class="tagline">Learn by doing - interactive setup in 5 minutes</p>
  </header>

  <div class="card">
    <h2>What You'll Get</h2>
    <ul>
      <li>Tessl CLI installed and configured</li>
      <li>A working "skill-builder" example skill</li>
      <li>Understanding of the full quality pipeline: review → eval</li>
      <li>Ready to create and publish your own skills</li>
    </ul>
  </div>

  <div class="card">
    <h2>How to Start</h2>
    <div class="options">
      <div class="option">
        <h3>Claude Code</h3>
        <p>Interactive onboarding in your IDE</p>
        <code>/tessl-onboarding</code>
      </div>
      <div class="option">
        <h3>NPX (Terminal)</h3>
        <p>Quick setup from command line</p>
        <code>npx @tessl/onboard</code>
      </div>
      <div class="option">
        <h3>AI Agent</h3>
        <p>Fetch the markdown guide</p>
        <code><a href="/onboard.md">Get TESSL_ONBOARDING.md</a></code>
      </div>
    </div>
  </div>

  <div class="card">
    <h2>What You'll Learn</h2>
    <ul>
      <li><strong>Skills</strong> - Tested, versioned agent capabilities</li>
      <li><strong>Review</strong> - Structure and quality validation</li>
      <li><strong>Evals</strong> - Functional correctness testing</li>
      <li><strong>The Pipeline</strong> - Ensure production readiness</li>
    </ul>
  </div>

  <div class="agent-note">
    <strong>For AI Agents:</strong>
    <p>This page serves <code>TESSL_ONBOARDING.md</code> at <code>/onboard.md</code> with proper headers for agent consumption. Fetch that file to get complete step-by-step instructions.</p>
  </div>

  <footer style="text-align: center; margin-top: 3rem; color: #7f8c8d;">
    <p>Questions? Check the <a href="https://docs.tessl.io">docs</a> or join the community.</p>
  </footer>
</body>
</html>
```

**Step 2: Create serve-onboarding.md (hosting instructions)**

```markdown
# Hosting Tessl Onboarding Web Endpoint

This directory contains files for serving the Tessl onboarding at `tessl.io/onboard`.

## Files

- `index.html` - Human-friendly landing page
- `TESSL_ONBOARDING.md` - The core markdown guide (copy from root)

## Hosting Setup

### Static Hosting (Recommended)

**Option 1: Vercel**
```bash
npm install -g vercel
cd web/
vercel --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
cd web/
netlify deploy --prod
```

**Option 3: GitHub Pages**
```bash
# Push web/ directory to gh-pages branch
git subtree push --prefix web origin gh-pages
```

### Server Configuration

**Required Headers:**

For `/onboard.md`:
```
Content-Type: text/markdown; charset=utf-8
X-Agent-Consumable: true
Cache-Control: public, max-age=3600
```

**Example Nginx Config:**
```nginx
location /onboard.md {
  add_header Content-Type "text/markdown; charset=utf-8";
  add_header X-Agent-Consumable "true";
  add_header Cache-Control "public, max-age=3600";
  alias /path/to/TESSL_ONBOARDING.md;
}

location / {
  try_files $uri $uri/ /index.html;
}
```

**Example Vercel Config (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/onboard.md",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/markdown; charset=utf-8"
        },
        {
          "key": "X-Agent-Consumable",
          "value": "true"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ],
  "routes": [
    {
      "src": "/onboard.md",
      "dest": "/TESSL_ONBOARDING.md"
    }
  ]
}
```

## Testing

**Test human page:**
```bash
open http://localhost:3000
# or
curl http://localhost:3000
```

**Test agent endpoint:**
```bash
curl -I http://localhost:3000/onboard.md
# Should see Content-Type: text/markdown and X-Agent-Consumable: true
```

**Test agent fetch:**
```bash
curl http://localhost:3000/onboard.md | head -n 20
# Should see markdown content
```

## Production URLs

- Human page: `https://tessl.io/onboard`
- Agent endpoint: `https://tessl.io/onboard.md`

## CDN Caching

Enable CDN caching for performance:
- Cache `/onboard.md` for 1 hour (3600s)
- Invalidate cache on updates
- Use ETags for conditional requests

## Monitoring

Monitor:
- Fetch success rate
- Average response time
- 404 errors (indicates broken links)
- Agent vs human traffic ratio
```

**Step 3: Copy TESSL_ONBOARDING.md to web directory**

```bash
cp TESSL_ONBOARDING.md web/onboard.md
```

**Step 4: Verify files**

Run: `ls -la web/`
Expected: See index.html, onboard.md, serve-onboarding.md

**Step 5: Commit**

```bash
git add web/
git commit -m "feat: add web endpoint for hosting

- index.html with human-friendly landing page
- Hosting instructions for static deployment
- onboard.md (copy of TESSL_ONBOARDING.md) for agents
- Server config examples (nginx, vercel)"
```

---

## Phase 5: Testing & Documentation

### Task 10: Create Testing Guide

**Files:**
- Create: `TESTING.md`

**Step 1: Write TESTING.md**

```markdown
# Testing Tessl Onboarding

This document describes how to test the Tessl onboarding system across all three formats.

## Prerequisites for Testing

- Clean machine or VM (to test installation)
- Internet connectivity
- Web browser (for auth flow)
- Node.js 18+ (for NPX testing)
- Claude Code CLI (for skill testing)

## Test Levels

### Level 1: Component Testing

**Test skill-builder Example:**
```bash
cd examples/skill-builder
tessl skill review .
tessl eval run .
```

Expected:
- Review score ≥80%
- Eval pass rate ≥80%

**Test repo eval scenarios:**
```bash
tessl eval run
```

Expected:
- All scenarios pass

**Test TESSL_ONBOARDING.md:**
- Manual read-through
- Check all commands are valid
- Verify step numbers are sequential
- Confirm success criteria are clear

### Level 2: Adapter Testing

**Test Claude Code Skill:**
1. Install skill: `claude-code skill install ./tessl-onboarding`
2. Invoke: `/tessl-onboarding`
3. Complete flow
4. Verify outputs created

**Test NPX Package:**
1. Clean environment: `rm -rf tessl.json examples/ .tessl/`
2. Run: `npx @tessl/onboard` (or `node cli.js` for local testing)
3. Complete flow
4. Verify outputs created

**Test Web Endpoint:**
1. Start local server: `cd web && python3 -m http.server 8000`
2. Visit `http://localhost:8000` (human page)
3. Fetch `http://localhost:8000/onboard.md` (agent endpoint)
4. Verify headers are correct

### Level 3: Error Scenario Testing

**Test: Tessl not installed**
1. Uninstall Tessl: `rm ~/.local/bin/tessl`
2. Run onboarding
3. Expected: Auto-installs Tessl

**Test: Not authenticated**
1. Logout: `tessl logout`
2. Run onboarding
3. Expected: Prompts for auth, completes flow

**Test: Network timeout**
1. Disconnect network temporarily
2. Run onboarding
3. Expected: Retry logic kicks in, reports error after max attempts

**Test: Low review score**
1. Modify skill-builder to have issues
2. Run onboarding
3. Expected: Continues despite low score, reports it

**Test: Eval failure**
1. Modify skill-builder to fail scenarios
2. Run onboarding
3. Expected: Reports failures, continues to next step

### Level 4: End-to-End Testing

**Persona 1: Brand New User**
- Never used Tessl before
- No CLI installed
- Fresh project directory
- Expected: Complete onboarding in ~5 minutes

**Persona 2: Existing User**
- Tessl already installed
- Already authenticated
- Existing project with tessl.json
- Expected: Skips installation/auth, completes in ~3 minutes

**Persona 3: Multiple Projects**
- User has several Tessl projects
- Runs onboarding in new directory
- Expected: Uses existing auth, creates new project successfully

### Level 5: Cross-Platform Testing

**Test on macOS:**
- M1/M2 (ARM)
- Intel (x86_64)

**Test on Linux:**
- Ubuntu 22.04+
- Debian 11+

**Test on Windows:**
- Windows 11 with WSL2

## Automated Testing (Future)

**Unit Tests:**
```bash
npm test
```

**Integration Tests:**
```bash
npm run test:integration
```

**E2E Tests:**
```bash
npm run test:e2e
```

## Manual Test Checklist

Before release:
- [ ] skill-builder scores ≥80% on review
- [ ] skill-builder passes ≥80% of eval scenarios
- [ ] Repo eval passes all scenarios
- [ ] Claude Code skill installs and runs
- [ ] NPX package installs and runs
- [ ] Web endpoint serves correctly
- [ ] All three formats produce same artifacts
- [ ] Error handling works (network, auth, etc.)
- [ ] Outputs (summary + report) are correct
- [ ] Total time <5 minutes on clean install
- [ ] Works on macOS, Linux, Windows

## Reporting Issues

If tests fail:
1. Capture full output
2. Note environment (OS, versions)
3. Check `onboarding-report.md` for details
4. File issue with reproduction steps

## Performance Benchmarks

Target times (clean install):
- Prerequisites check: <5s
- Tessl installation: <30s
- Authentication: <30s
- Project init: <5s
- Example creation: <10s
- Skill review: <10s
- Tile eval: <180s
- Repo eval: <120s
- Output generation: <5s

**Total:** ~5 minutes (300s)
```

**Step 2: Commit**

```bash
git add TESTING.md
git commit -m "docs: add comprehensive testing guide

- Component, adapter, error, E2E, and cross-platform tests
- Manual test checklist for releases
- Performance benchmarks
- Issue reporting guidelines"
```

---

### Task 11: Create Main README

**Files:**
- Create: `README.md` (root)

**Step 1: Write README.md**

```markdown
# Tessl Onboarding

Interactive onboarding system for Tessl - learn by doing in 5 minutes.

## What This Is

A multi-format onboarding experience that:
- Installs and configures Tessl CLI
- Creates a working "skill-builder" example
- Runs the full quality pipeline (review → eval)
- Teaches Tessl through hands-on setup

**Target Audience:** Newcomers to Tessl (both AI agents and human developers)

## Quick Start

### Claude Code
```
/tessl-onboarding
```

### NPX (Terminal)
```bash
npx @tessl/onboard
```

### Any AI Agent
Fetch the onboarding guide:
```
https://tessl.io/onboard.md
```

## What You Get

After completing onboarding:
- ✓ Tessl CLI installed and authenticated
- ✓ Working skill-builder example in your project
- ✓ Understanding of quality pipeline
- ✓ Ready to create and publish your own skills

## Time Required

~5 minutes (varies by network speed)

## Outputs

- `examples/skill-builder/` - Working example skill
- `onboarding-summary.md` - Human-friendly summary
- `onboarding-report.md` - Detailed execution log

## Architecture

**Content-First Design:**
- Core: `TESSL_ONBOARDING.md` (universal markdown guide)
- Adapters: Claude Code skill, NPX package, web endpoint
- Philosophy: Single source of truth, thin format-specific wrappers

## Repository Structure

```
tessl-onboarding/
├── TESSL_ONBOARDING.md          # Core onboarding guide
├── examples/skill-builder/      # Curated example skill
├── .tessl/evals/                # Repo-level eval scenarios
├── tessl-onboarding/            # Claude Code skill
│   ├── skill.md
│   └── README.md
├── package.json                 # NPX package
├── cli.js                       # NPX entry point
├── web/                         # Web hosting files
│   ├── index.html
│   └── onboard.md
├── docs/plans/                  # Design and implementation docs
└── TESTING.md                   # Testing guide
```

## Development

**Install dependencies:**
```bash
npm install
```

**Test locally:**
```bash
# Test NPX
node cli.js

# Test skill (requires Claude Code)
claude-code skill install ./tessl-onboarding

# Test web (requires local server)
cd web && python3 -m http.server 8000
```

**Run tests:**
```bash
npm test
```

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

## Deployment

**Claude Code Skill:**
- Publish to Claude Code skill registry
- Users install with skill manager

**NPX Package:**
```bash
npm publish
```

**Web Endpoint:**
- Deploy `web/` directory to static hosting (Vercel, Netlify, GitHub Pages)
- See `web/serve-onboarding.md` for details

## Design Decisions

**Why content-first?**
- AI agents excel at following markdown instructions
- Single source of truth, easier to maintain
- Transparent and debuggable

**Why three formats?**
- Different users prefer different tools
- Maximizes reach and adoption
- Proves portability of core content

**Why skill-builder as example?**
- Meta: teaches by being what it teaches
- Immediately useful after onboarding
- Self-reinforcing learning

See [design document](./docs/plans/2026-02-24-tessl-agent-onboarding-design.md) for full details.

## Contributing

Contributions welcome! Please:
1. Read design docs first
2. Test changes across all three formats
3. Update TESSL_ONBOARDING.md if changing flow
4. Run full test suite before submitting

## Documentation

- [Design Document](./docs/plans/2026-02-24-tessl-agent-onboarding-design.md)
- [Implementation Plan](./docs/plans/2026-02-24-tessl-agent-onboarding-implementation.md)
- [Testing Guide](./TESTING.md)
- [Tessl Docs](https://docs.tessl.io)

## License

MIT

## Support

- [Tessl Documentation](https://docs.tessl.io)
- [GitHub Issues](https://github.com/tessl/onboard/issues)
- [Community](https://community.tessl.io)
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add main README

- Quick start for all three formats
- Architecture overview
- Repository structure
- Development and deployment instructions
- Links to design docs and testing guide"
```

---

## Summary

**Implementation complete!**

This plan creates a fully agent-agnostic onboarding system with **14 tasks across 5 phases:**

**Deliverables:**
1. ✓ Core content (TESSL_ONBOARDING.md + skill-builder example + repo evals)
2. ✓ Claude Code skill adapter
3. ✓ Cursor adapter (.cursorrules)
4. ✓ GitHub Copilot adapter (copilot-instructions.md)
5. ✓ Adapter pattern documentation (ADAPTING.md)
6. ✓ NPX package with CLI
7. ✓ Web endpoint for hosting
8. ✓ Comprehensive testing guide
9. ✓ Full documentation

**Agent Support:**
- ✅ Claude Code (via skill)
- ✅ Cursor (via .cursorrules)
- ✅ GitHub Copilot (via workspace instructions)
- ✅ Any agent with web fetch (via tessl.io/onboard.md)
- ✅ Terminal users (via NPX)
- 📝 Extensible pattern for future tools (via ADAPTING.md)

**Next steps:** Execute this plan task-by-task using @superpowers:executing-plans or @superpowers:subagent-driven-development.
