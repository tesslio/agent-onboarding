# Testing Tessl Onboarding

This document describes how to test the Tessl onboarding system across all three formats.

## Prerequisites for Testing

- Clean machine or VM (to test installation)
- Internet connectivity
- Web browser (for auth flow)
- Node.js 18+ (for NPX testing)
- Claude Code CLI (for skill testing)

## Test Levels

### Level 1: Component Testing

**Test skill-builder Example:**
```bash
cd examples/skill-builder
tessl skill review .
tessl eval run .
```

Expected:
- Review score ≥80%
- Eval pass rate ≥80%

**Test repo eval scenarios:**
```bash
tessl eval run
```

Expected:
- All scenarios pass

**Test TESSL_ONBOARDING.md:**
- Manual read-through
- Check all commands are valid
- Verify step numbers are sequential
- Confirm success criteria are clear

### Level 2: Adapter Testing

**Test Claude Code Skill:**
1. Install skill: `claude-code skill install ./tessl-onboarding`
2. Invoke: `/tessl-onboarding`
3. Complete flow
4. Verify outputs created

**Test NPX Package:**
1. Clean environment: `rm -rf tessl.json examples/ .tessl/`
2. Run: `npx @tessl/onboard` (or `node cli.js` for local testing)
3. Complete flow
4. Verify outputs created

**Test Web Endpoint:**
1. Start local server: `cd web && python3 -m http.server 8000`
2. Visit `http://localhost:8000` (human page)
3. Fetch `http://localhost:8000/onboard.md` (agent endpoint)
4. Verify headers are correct

### Level 3: Error Scenario Testing

**Test: Tessl not installed**
1. Uninstall Tessl: `rm ~/.local/bin/tessl`
2. Run onboarding
3. Expected: Auto-installs Tessl

**Test: Not authenticated**
1. Logout: `tessl logout`
2. Run onboarding
3. Expected: Prompts for auth, completes flow

**Test: Network timeout**
1. Disconnect network temporarily
2. Run onboarding
3. Expected: Retry logic kicks in, reports error after max attempts

**Test: Low review score**
1. Modify skill-builder to have issues
2. Run onboarding
3. Expected: Continues despite low score, reports it

**Test: Eval failure**
1. Modify skill-builder to fail scenarios
2. Run onboarding
3. Expected: Reports failures, continues to next step

### Level 4: End-to-End Testing

**Persona 1: Brand New User**
- Never used Tessl before
- No CLI installed
- Fresh project directory
- Expected: Complete onboarding in ~5 minutes

**Persona 2: Existing User**
- Tessl already installed
- Already authenticated
- Existing project with tessl.json
- Expected: Skips installation/auth, completes in ~3 minutes

**Persona 3: Multiple Projects**
- User has several Tessl projects
- Runs onboarding in new directory
- Expected: Uses existing auth, creates new project successfully

### Level 5: Cross-Platform Testing

**Test on macOS:**
- M1/M2 (ARM)
- Intel (x86_64)

**Test on Linux:**
- Ubuntu 22.04+
- Debian 11+

**Test on Windows:**
- Windows 11 with WSL2

## Automated Testing (Future)

**Unit Tests:**
```bash
npm test
```

**Integration Tests:**
```bash
npm run test:integration
```

**E2E Tests:**
```bash
npm run test:e2e
```

## Manual Test Checklist

Before release:
- [ ] skill-builder scores ≥80% on review
- [ ] skill-builder passes ≥80% of eval scenarios
- [ ] Repo eval passes all scenarios
- [ ] Claude Code skill installs and runs
- [ ] NPX package installs and runs
- [ ] Web endpoint serves correctly
- [ ] All three formats produce same artifacts
- [ ] Error handling works (network, auth, etc.)
- [ ] Outputs (summary + report) are correct
- [ ] Total time <5 minutes on clean install
- [ ] Works on macOS, Linux, Windows

## Reporting Issues

If tests fail:
1. Capture full output
2. Note environment (OS, versions)
3. Check `onboarding-report.md` for details
4. File issue with reproduction steps

## Performance Benchmarks

Target times (clean install):
- Prerequisites check: <5s
- Tessl installation: <30s
- Authentication: <30s
- Project init: <5s
- Example creation: <10s
- Skill review: <10s
- Tile eval: <180s
- Repo eval: <120s
- Output generation: <5s

**Total:** ~5 minutes (300s)
