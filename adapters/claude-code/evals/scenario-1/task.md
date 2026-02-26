# Scenario 1: Installation and Authentication

Test that the onboarding skill can successfully install Tessl CLI and authenticate the user.

## Setup

- Clean environment (no existing Tessl installation)
- Network access to registry.tessl.io

## Task

Run the tessl-onboarding skill and verify it:
1. Checks for Tessl CLI installation status
2. Installs Tessl CLI if not present
3. Initiates authentication flow with URL and code
4. Waits for user to complete authentication
5. Confirms successful authentication with username

## Expected Behavior

The skill should:
- Report whether Tessl is already installed or needs installation
- Display clear authentication instructions (browser and headless scenarios)
- Poll for authentication completion
- Report successful authentication with the user's username
