# Scenario 1: Trigger Recognition and Permission Flow

Test that GitHub Copilot instructions correctly recognize triggers and request permission.

## Setup

- GitHub Copilot active with copilot-instructions.md loaded
- Clean environment (no Tessl CLI)

## Task

User says any of:
- "Set up Tessl"
- "Onboard to Tessl"
- "Install and configure Tessl"
- "Run Tessl onboarding"

Verify the instructions:
1. Recognize any of the trigger phrases
2. Present overview of what will happen
3. Request explicit permission
4. Check prerequisites (Tessl CLI, network)

## Expected Behavior

The instructions should:
- Trigger on all four standard phrases
- Display clear process overview with duration
- Ask "Proceed?" before any actions
- Check CLI installation status with `which tessl`
- Verify network access to registry.tessl.io
- Report findings clearly
