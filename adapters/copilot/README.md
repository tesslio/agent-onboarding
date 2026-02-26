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
