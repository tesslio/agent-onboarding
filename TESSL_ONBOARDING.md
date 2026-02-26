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

   **Browser opens automatically:** If you have a browser available, it will open automatically

   **No browser (headless/SSH):** Copy the URL from terminal output and open it manually

2. Complete authentication in browser:
   - If browser opened: Enter the code shown in your terminal
   - If manual: Paste the URL in any browser, then enter the code

3. Wait for "Authentication successful!" message

4. Verify authentication:
   ```bash
   tessl whoami
   ```

   **Expected:** Your username/email

**Success Criteria:**
- `tessl whoami` shows your identity
- You're authenticated with the registry

**Checkpoint:** Run `tessl whoami` and see your credentials.

**Note:** Authentication is async—the CLI polls in the background while you complete the browser flow. This usually takes 10-30 seconds. Works in headless environments (SSH, CI/CD) by providing URL and code in terminal output.

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
