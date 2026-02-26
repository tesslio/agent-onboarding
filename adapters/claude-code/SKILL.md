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

Use MCP tool: `mcp__tessl__new_tile` (or use Bash: `tessl init`)

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

**Copy skill-builder base files:**

The skill-builder files (SKILL.md, tile.json) should be bundled with this skill. Copy them:

```bash
cp <skill-package-path>/examples/skill-builder/SKILL.md examples/skill-builder/
cp <skill-package-path>/examples/skill-builder/tile.json examples/skill-builder/
```

**Generate eval scenarios using Tessl skills:**

Use the Tessl built-in skill to create eval scenarios for skill-builder:

```bash
# Use tessl__creating-eval-scenarios skill to generate scenarios
# This skill should be available in .claude/skills/ directory
tessl skill run tessl__creating-eval-scenarios examples/skill-builder/
```

**Alternative (if Tessl skill not available):**

Manually create 2-3 eval scenarios in `examples/skill-builder/evals/`:
- Each scenario needs: `evals/scenario-N/task.md` and `evals/scenario-N/criteria.json`
- Use weighted_checklist format for criteria

**Import the skill:**

```bash
cd examples/skill-builder && tessl skill import && cd ../..
```

**Report:** "✓ skill-builder example created with eval scenarios"

### Step 7: Create Repo Eval Scenarios

**Create directory:**
```bash
mkdir -p .tessl/evals
```

**Generate repo-level scenarios:**

Use Tessl built-in skill to create repo-level eval scenarios:

```bash
# Use tessl__creating-eval-scenarios for repo-level evals
tessl skill run tessl__creating-eval-scenarios --repo-level ./
```

**Alternative (if Tessl skill not available):**

Copy pre-made repo scenarios from the package:
```bash
cp <skill-package-path>/.tessl/evals/repo-scenarios.json .tessl/evals/
```

**Report:** "✓ Repo eval scenarios added"

**Note on Tessl Skills Location:**

The Tessl built-in skills (`tessl__creating-eval-scenarios`, `tessl__converting-skill-to-tessl-tile`) should be available in:
- User's machine: `~/.claude/skills/` or `Documents/.claude/skills/`
- NPX environment: `.claude/skills/` in the current working directory

If these skills are not found, fall back to manual scenario creation or copying pre-made scenarios.

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

**Wait for initial execution:**

Wait 3 minutes (180 seconds) before first status check to allow eval to run.

**Poll for results:**

```bash
tessl eval view <eval-run-id> --json
```

After initial 3-minute wait, poll every 60 seconds until status is "complete" (no max timeout - evals can take varying amounts of time).

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
