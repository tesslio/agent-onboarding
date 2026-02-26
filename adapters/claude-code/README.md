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
