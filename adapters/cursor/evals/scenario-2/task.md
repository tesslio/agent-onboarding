# Scenario 2: Installation and Authentication Flow

Test that Cursor rules properly handle Tessl CLI installation and authentication.

## Setup

- Cursor editor with rules loaded
- User has granted permission
- Prerequisites checked

## Task

After permission granted, verify the rules guide:
1. Installation of Tessl CLI via curl command
2. Version verification with `tessl --version`
3. Authentication check with `tessl whoami`
4. Login initiation with `tessl login`
5. Polling for auth completion (5-second intervals, 2-minute max)

## Expected Behavior

The rules should:
- Execute curl install command if Tessl not present
- Verify installation succeeded
- Check authentication status before login
- Initiate browser-based login
- Poll until authentication completes or times out
- Report authenticated username
