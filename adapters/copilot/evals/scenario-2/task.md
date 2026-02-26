# Scenario 2: CLI Installation and Authentication

Test that GitHub Copilot instructions handle installation and authentication correctly.

## Setup

- User has granted permission
- Prerequisites checked
- No existing Tessl installation

## Task

After permission granted, verify the instructions guide:
1. Tessl CLI installation via curl
2. Installation verification with version check
3. Authentication status check
4. Login flow initiation
5. Authentication polling (5s intervals, 2-minute max)
6. Success confirmation

## Expected Behavior

The instructions should:
- Execute curl install script
- Verify installation with `tessl --version`
- Check current auth with `tessl whoami`
- Start login with `tessl login`
- Poll for completion every 5 seconds
- Stop polling after 2 minutes max
- Report authenticated username
