# Scenario 1: Rules Trigger and Prerequisites

Test that Cursor rules correctly trigger onboarding and check prerequisites.

## Setup

- Cursor editor with .cursorrules file loaded
- Clean environment (no Tessl CLI)

## Task

User says: "set up Tessl"

Verify the rules:
1. Recognize the trigger phrase "set up Tessl"
2. Present overview of what onboarding will do
3. Ask for user permission to proceed
4. Check for Tessl CLI installation (`which tessl`)
5. Check network connectivity to registry.tessl.io

## Expected Behavior

The rules should:
- Trigger immediately on "set up Tessl" phrase
- Display clear 5-step overview
- Request permission with time estimate
- Report whether Tessl is installed or needs installation
- Confirm network connectivity
