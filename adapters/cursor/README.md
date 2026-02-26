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
