# Tessl Agent Onboarding System - Design Document

**Date:** 2026-02-24
**Status:** Approved
**Purpose:** Create an agent-consumable onboarding system that teaches newcomers about Tessl through hands-on setup and a curated example

---

## Executive Summary

This document describes a multi-format onboarding system for Tessl that prioritizes AI agent consumption while remaining human-readable. The system will:

1. Walk users through installing and setting up Tessl
2. Demonstrate best practices via a curated "skill-builder" example
3. Show the full quality pipeline: skill review → tile eval → repo eval
4. Generate layered outputs: quick summaries for humans, detailed reports for agents
5. Support three delivery formats: Claude Code skill, web endpoint, and NPX package

**Core Philosophy:** Content-first with thin adapters. A single markdown file contains the onboarding logic, and format-specific wrappers translate it for different tools.

---

## Requirements Summary

### Primary Audience
AI assistants (Claude, Cursor, Copilot, etc.) helping developers learn Tessl

### Primary Use Case
First-time setup and onboarding for newcomers who want to try Tessl

### Key Experience Goals
- Autonomous execution (minimal user interruption)
- Hands-on learning through a curated example
- Full feature tour: install → create → review → eval
- Works across multiple AI tools/platforms

### Output Requirements
**Layered outputs:**
- Quick summary (1-2 paragraphs for humans)
- Detailed report (full context for agents)
- Working artifacts (example skill files users can use immediately)

---

## Architecture

### Core Artifact: `TESSL_ONBOARDING.md`

A comprehensive, AI-optimized markdown file structured in four layers:

**Layer 1: Quick Start (Human Summary)**
- 2-3 paragraph overview of Tessl and this guide
- Expected outcome and time estimate
- Prerequisites check

**Layer 2: Step-by-Step Guide (AI Instructions)**
- Numbered steps with clear success criteria
- Code blocks with expected outputs
- Validation checkpoints
- Decision points marked clearly

**Layer 3: The Curated Example**
- Complete working skill: "skill-builder"
- Demonstrates best practices
- Includes eval scenarios
- Meta: helps users build more skills

**Layer 4: Reference (Agent Context)**
- Common errors and solutions
- Next steps and resources
- Full command reference
- Links to Tessl docs

### Five Delivery Adapters

**1. Claude Code Skill** (`tessl-onboarding/skill.md`)
- Target: Claude Code CLI users
- Mechanism: Loads `TESSL_ONBOARDING.md`, executes via Tessl MCP tools
- Output: Human summary + detailed report + artifacts in project directory

**2. Cursor Adapter** (`.cursorrules`)
- Target: Cursor IDE users
- Mechanism: Cursor-specific rules format that wraps `TESSL_ONBOARDING.md`
- Output: Follows core guide, generates standard artifacts

**3. GitHub Copilot Adapter** (`.github/copilot-instructions.md`)
- Target: GitHub Copilot users
- Mechanism: Copilot workspace instructions format
- Output: Follows core guide, generates standard artifacts

**4. Web Endpoint** (`tessl.io/onboard`)
- Target: Any AI agent that can fetch URLs
- Mechanism: Serves `TESSL_ONBOARDING.md` with AI-friendly metadata
- Headers: `X-Agent-Consumable: true`, `Content-Type: text/markdown`
- Optional: HTML version for humans browsing directly

**5. NPX Package** (`@tessl/onboard`)
- Target: Developers who prefer CLI tools
- Mechanism: Downloads/bundles markdown, executes via `child_process`
- Output: Terminal output + summary files + artifacts
- Progress indicators and spinners

**Plus: Adapter Pattern Documentation** (`ADAPTING.md`)
- Explains how to create adapters for new AI tools
- Templates and examples for quick adaptation

---

## Components

### File Structure

```
tessl-onboarding/
├── TESSL_ONBOARDING.md          # Core content (universal)
├── ADAPTING.md                   # Pattern documentation for new tools
├── adapters/
│   ├── claude-code/
│   │   └── skill.md             # Claude Code skill wrapper
│   ├── cursor/
│   │   └── .cursorrules         # Cursor adapter
│   └── copilot/
│       └── .github/
│           └── copilot-instructions.md  # Copilot adapter
├── package.json                  # NPX package definition
├── cli.js                        # NPX entry point
├── examples/
│   └── skill-builder/           # The curated example
│       ├── SKILL.md             # The skill that helps build skills
│       ├── tile.json            # Tile metadata
│       └── evals/
│           └── scenarios.json   # Sample eval scenarios
├── .tessl/
│   └── evals/
│       └── repo-scenarios.json  # Repo-level eval (optional)
└── outputs/
    ├── onboarding-summary.md    # Human-readable summary template
    └── onboarding-report.md     # Agent-consumable report template
```

### Component Details

**TESSL_ONBOARDING.md** (~500-800 lines)
- Written for AI consumption but human-readable
- Self-contained (no external dependencies to understand)
- Embedded success criteria and checkpoints throughout

**ADAPTING.md** (~200-300 lines)
- Explains the adapter pattern
- Provides templates for creating new adapters
- Examples for popular AI tools
- Guidelines for maintaining consistency

**adapters/claude-code/skill.md** (~50-100 lines)
- Wraps `TESSL_ONBOARDING.md` in Claude Code skill format
- Uses Tessl MCP tools for execution
- Generates layered output

**adapters/cursor/.cursorrules** (~100-150 lines)
- Cursor-specific format wrapping core guide
- Instructions for Cursor's AI to follow
- References `TESSL_ONBOARDING.md` for details

**adapters/copilot/.github/copilot-instructions.md** (~100-150 lines)
- GitHub Copilot workspace instructions format
- Wraps core onboarding flow
- Compatible with Copilot's instruction system

**cli.js** (NPX Package, ~200-300 lines)
- Parses `TESSL_ONBOARDING.md` to extract steps
- Executes via `child_process.exec('tessl ...')`
- Progress indicators for each step
- Generates summary and detailed report

**examples/skill-builder/** (The Curated Example)
- A working Tessl skill demonstrating best practices
- Purpose: helps users scaffold new skills with good structure
- Includes eval scenarios to validate skill quality
- Meta: using this skill teaches how skills work

---

## Data Flow

### Onboarding Sequence

1. **Prerequisites Check**
   - Is Tessl CLI installed?
   - Can we reach the registry?
   - Output: Ready status or installation needed

2. **Install/Login**
   - Run: `tessl login` (if needed)
   - Run: `tessl init` (if needed)
   - Output: Auth status + project config

3. **Scaffold skill-builder**
   - Copy: `examples/skill-builder/*` → user's project
   - Run: `tessl skill import`
   - Output: Working skill files

4. **Skill Review**
   - Run: `tessl skill review skill-builder`
   - Capture: Score, issues, recommendations
   - Output: Quality report (expect ~80%+ score)
   - **Key Learning:** Structure validation before functional testing

5. **Tile Eval**
   - Run: `tessl eval run skill-builder`
   - Poll: `tessl eval view <id>` until complete
   - Output: Pass/fail + scenario results
   - **Key Learning:** Functional correctness testing

6. **Repo Eval (Optional Bonus)**
   - Run: `tessl eval run` (repository-level)
   - Poll: `tessl eval view <id>` until complete
   - Output: Integration validation
   - **Key Learning:** Full quality pipeline

7. **Generate Outputs**
   - `onboarding-summary.md` (human: 2-3 paragraphs)
   - `onboarding-report.md` (agent: full details)
   - Working artifacts in project directory

### Format-Specific Handling

**Claude Code Skill:**
- Input: User invokes `/tessl-onboarding`
- Reads: Bundled `TESSL_ONBOARDING.md`
- Execution: Uses Tessl MCP tools
- Progress: Task updates in Claude UI
- Output: Markdown response + files on disk

**Web Endpoint:**
- Input: HTTP GET `tessl.io/onboard`
- Response: Raw `TESSL_ONBOARDING.md` with headers
- Agent reads and executes steps locally
- No server-side execution

**NPX Package:**
- Input: `npx @tessl/onboard` in terminal
- Reads: Bundled or downloaded markdown
- Execution: Spawns shell commands
- Progress: Terminal spinner + step descriptions
- Output: Files + summary to stdout

### Key Data Artifacts

1. **Prerequisites Report** - CLI status, auth status, project state
2. **Skill Files** - The skill-builder skill in user's project
3. **Review Results** - JSON with score, issues, feedback
4. **Eval Results** - JSON with scenario outcomes
5. **Summary** - Human-friendly completion message
6. **Report** - Agent-friendly detailed log

---

## Error Handling

### Design Principle: "Ask Once, Run Autonomously"

**Single Permission Request:**
```
"I'm going to set up Tessl for you. This will:
- Install Tessl CLI (if needed)
- Authenticate with Tessl registry
- Create a sample skill
- Run quality checks and evals

This is safe and reversible. Proceed? [Yes/No]"
```

After approval, agent handles everything automatically.

### Autonomous Recovery Actions

**Tessl CLI Not Installed**
- Agent: Automatically run `curl -fsSL https://get.tessl.io | sh`
- Output: "Installing Tessl CLI... ✓ Installed"
- No user interaction needed

**Authentication Failure**
- Agent: Run `tessl login`, capture auth URL + code
- Output: "Opening browser for auth..." (auto-open if possible)
- Wait: Poll `tessl whoami` until success (with timeout)
- Fallback: Display URL + code if browser fails

**Network/Registry Issues**
- Agent: Retry with exponential backoff (3 attempts)
- Output: Progress indicator while retrying
- Only report if all retries fail

**Skill Review Below Threshold**
- Agent: Continue automatically, note score
- Output: "Skill scored 75% - room for improvement, but let's continue"
- Treat as educational, not blocking

**Eval Failures**
- Agent: Continue to next step
- Output: "2/5 scenarios passed - this shows what evals catch!"
- Educational, not blocking

**Missing Dependencies**
- Agent: Auto-create needed directories/files
- Example: No `.tessl/` dir? Create it
- Minimal logging

### Progress Indicators (Not Blockers)

```
Setting up Tessl...
  ✓ CLI installed
  ✓ Authenticated as user@example.com
  ✓ Project initialized
  ✓ Example skill created
  ⚠ Skill review: 75% (could be better, but passing)
  ✓ Tile eval: 3/5 scenarios passed
  ✓ Repo eval: skipped (optional)

Done! You now have a working Tessl setup.
```

### User Interruption Required Only For:
- Initial permission to begin
- Auth requiring browser interaction (provide clear link)
- Catastrophic failures (CLI install fails, no network)

Everything else: **handle silently and report at the end**.

---

## Testing Strategy

### Layered Validation

**Level 1: Markdown Validation**
- Ensure `TESSL_ONBOARDING.md` is well-formed
- Manual walkthrough + automated structure checks
- All command examples valid and copy-pastable
- Step numbers sequential, success criteria clear

**Level 2: Example Validation**
- The skill-builder example works correctly
- `tessl skill review skill-builder` scores ≥80%
- `tessl eval run skill-builder` passes core scenarios
- Generated files are valid

**Level 3: Adapter Testing**

*Claude Code Skill:*
- Skill invocation works
- MCP tools called correctly
- Output artifacts in expected locations
- Summary + report generated properly

*NPX Package:*
- Works across macOS, Linux, Windows
- Shell commands execute correctly
- Progress indicators display properly
- Correct file permissions

*Web Endpoint:*
- Content-Type and headers correct
- Markdown renders properly
- CDN caching works
- Agents can fetch and parse

**Level 4: Error Scenario Testing**
- Clean install (no Tessl)
- Existing install (Tessl present)
- Failed authentication
- Network timeout
- Low skill review score

**Level 5: End-to-End Testing**
- Full flow from start to finish
- Persona testing:
  - Brand new user
  - Existing user
  - Developer with multiple projects
- Success: Complete in <5 minutes with working artifacts

### Testing Philosophy

**Optimize for:**
- Real user scenarios (not edge cases)
- Fast feedback
- Clear failure messages

**Don't over-test:**
- Tessl CLI itself (assume it works)
- External services (mock if needed)
- Every possible error

### Pre-Release Checklist

- [ ] Manual walkthrough by Tessl newcomer
- [ ] All three adapters tested on clean machines
- [ ] Example skill scores ≥80% on skill review
- [ ] Example skill passes ≥80% of eval scenarios
- [ ] Documentation accurate
- [ ] Error messages helpful

---

## Implementation Phases

### Phase 1: Core Content (Week 1)
- Write `TESSL_ONBOARDING.md`
- Create skill-builder example
- Validate example (review + eval)

### Phase 2: Tool-Specific Adapters (Week 1-2)
- Create Claude Code skill adapter
- Create Cursor adapter
- Create GitHub Copilot adapter
- Write adapter pattern documentation
- Test each adapter with real users

### Phase 3: NPX Package (Week 2-3)
- Build CLI wrapper
- Parse and execute markdown
- Cross-platform testing
- Publish to npm

### Phase 4: Web Endpoint (Week 3-4)
- Set up hosting at tessl.io/onboard
- Configure headers and caching
- Add optional HTML version
- Test agent consumption

### Phase 5: Testing & Documentation (Week 4)
- Comprehensive testing guide
- Main README
- Adapter testing across tools
- End-to-end validation

### Phase 6: Polish & Launch (Week 4)
- User feedback incorporation
- Final testing across all formats
- Public announcement

---

## Success Metrics

**User Success:**
- Time to complete: <5 minutes
- Completion rate: >90%
- Working artifacts generated: 100%

**Learning Outcomes:**
- Users understand Tessl workflow
- Users can create their own skills after onboarding
- Users understand quality pipeline (review → eval)

**Technical Success:**
- All three formats functional
- Error rate: <5%
- Cross-platform compatibility: macOS, Linux, Windows

**Adoption:**
- Track invocations per format
- Measure conversion: onboarding → active Tessl use
- Gather qualitative feedback

---

## Future Enhancements

### Near-term (Next Quarter)
- Add more curated examples (beyond skill-builder)
- Adapters for additional tools (Windsurf, Aider, etc.)
- Multi-language support (Spanish, French, Japanese)
- Telemetry and analytics (track completion rates)

### Long-term (Next Year)
- Interactive playground (browser-based)
- Video walkthrough embedded in docs
- Community-contributed examples
- Advanced tutorials (beyond onboarding)
- Automated adapter generation tool

---

## Appendix: Key Design Decisions

**Why content-first?**
- AI agents excel at following markdown instructions
- Single source of truth is easier to maintain
- Transparent and debuggable
- Self-documenting

**Why three formats?**
- Different users prefer different tools
- Maximizes reach and adoption
- Proves portability of core content

**Why autonomous execution?**
- Reduces friction for newcomers
- Demonstrates Tessl's power immediately
- Better learning experience (watch it work)

**Why skill-builder as example?**
- Meta: teaches by being what it teaches
- Immediately useful after onboarding
- Demonstrates Tessl's bootstrapping power
- Self-reinforcing learning

**Why include skill review + evals?**
- Shows the full quality pipeline
- Teaches best practices from day one
- Demonstrates Tessl's differentiation
- Makes quality tangible

---

## Open Questions (Resolved)

1. ~~Should we support other AI tools beyond Claude?~~ → Yes, start with Claude, design for portability
2. ~~Should users be required to interact during setup?~~ → No, autonomous with single upfront permission
3. ~~Should we include repo eval?~~ → Yes, as optional bonus step
4. ~~Should we include skill review?~~ → Yes, before eval to teach the workflow

---

## References

- Tessl CLI Documentation: https://docs.tessl.io
- Tessl MCP Server: https://github.com/tessl/mcp-server
- Claude Code Skills: https://github.com/anthropics/claude-code
- Example Skills: (internal Tessl repository)

---

**Next Steps:** Create detailed implementation plan using writing-plans skill.
