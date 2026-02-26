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
