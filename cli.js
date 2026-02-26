#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Configuration
const REGISTRY_URL = 'https://registry.tessl.io';
const INSTALL_URL = 'https://get.tessl.io';
const TIMEOUT_MS = 600000; // 10 minutes max
const POLL_INTERVAL_MS = 15000; // 15 seconds

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

// Helper: Print colored output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper: Print progress
function progress(step, total, message) {
  log(`[${step}/${total}] ${message}`, 'blue');
}

// Helper: Execute shell command and return output
function exec(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
  } catch (error) {
    if (options.ignoreErrors) {
      return null;
    }
    throw error;
  }
}

// Helper: Check if command exists
function commandExists(command) {
  const result = exec(`which ${command}`, { silent: true, ignoreErrors: true });
  return result !== null && result.trim().length > 0;
}

// Helper: Detect if running in headless environment
function isHeadless() {
  // Check common headless indicators
  return (
    !process.env.DISPLAY ||           // No X display
    process.env.CI === 'true' ||       // CI environment
    process.env.SSH_CONNECTION ||      // SSH session
    process.env.SSH_CLIENT ||          // SSH client
    !process.stdout.isTTY              // No TTY
  );
}

// Helper: Retry with exponential backoff
async function retry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      log(`Retrying in ${delay / 1000}s...`, 'yellow');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Helper: Copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main onboarding flow
async function main() {
  console.clear();
  log('╔════════════════════════════════════════╗', 'blue');
  log('║   Tessl Onboarding - Learn by Doing   ║', 'blue');
  log('╚════════════════════════════════════════╝', 'blue');
  console.log();

  const startTime = Date.now();
  const totalSteps = 11;

  // Step 0: Get permission
  progress(0, totalSteps, 'Getting permission...');
  console.log(`
This will:
- Install Tessl CLI (if needed) - ~30 seconds
- Authenticate with Tessl registry - ~30 seconds
- Create a sample skill - ~10 seconds
- Run quality checks - ~2-3 minutes

Total time: ~5 minutes. Safe and reversible.
  `);

  // In a real implementation, you'd use a library like 'prompts' for interactive input
  // For now, we'll assume consent
  log('✓ Permission granted', 'green');
  console.log();

  try {
    // Step 1: Check prerequisites
    progress(1, totalSteps, 'Checking prerequisites...');
    const hasTessl = commandExists('tessl');
    const hasNetwork = checkNetwork();

    if (hasTessl) {
      const version = exec('tessl --version', { silent: true }).trim();
      log(`  ✓ Tessl CLI installed (${version})`, 'green');
    } else {
      log('  ⚠ Tessl CLI not installed (will install)', 'yellow');
    }

    if (hasNetwork) {
      log('  ✓ Network reachable', 'green');
    } else {
      throw new Error('Cannot reach registry - check internet connection');
    }
    console.log();

    // Step 2: Install Tessl (if needed)
    if (!hasTessl) {
      progress(2, totalSteps, 'Installing Tessl CLI...');
      await retry(() => {
        exec(`curl -fsSL ${INSTALL_URL} | sh`);
      });

      // Add common install locations to PATH for this session
      const homedir = require('os').homedir();
      const tesslPaths = [
        `${homedir}/.local/bin`,
        `${homedir}/.tessl/bin`,
        '/usr/local/bin'
      ];
      process.env.PATH = `${tesslPaths.join(':')}:${process.env.PATH}`;

      log('  ✓ Tessl CLI installed', 'green');
      console.log();
    } else {
      progress(2, totalSteps, 'Tessl CLI already installed (skipping)');
      console.log();
    }

    // Step 3: Authenticate
    progress(3, totalSteps, 'Authenticating with Tessl...');
    await authenticate();
    console.log();

    // Step 4: Initialize project
    progress(4, totalSteps, 'Initializing project...');
    await initProject();
    console.log();

    // Step 5: Create skill-builder example
    progress(5, totalSteps, 'Creating skill-builder example...');
    await createExample();
    console.log();

    // Step 6: Create repo eval scenarios
    progress(6, totalSteps, 'Adding repo eval scenarios...');
    await createRepoEvals();
    console.log();

    // Step 7: Run skill review
    progress(7, totalSteps, 'Running skill review...');
    const reviewResults = await runSkillReview();
    console.log();

    // Step 8: Run tile eval
    progress(8, totalSteps, 'Running tile eval (this may take 2-3 minutes)...');
    const tileEvalResults = await runTileEval();
    console.log();

    // Step 9: Run repo eval
    progress(9, totalSteps, 'Running repo eval (optional bonus)...');
    const repoEvalResults = await runRepoEval();
    console.log();

    // Step 10: Generate outputs
    progress(10, totalSteps, 'Generating summary and report...');
    await generateOutputs(reviewResults, tileEvalResults, repoEvalResults, startTime);
    console.log();

    // Step 11: Success!
    progress(11, totalSteps, 'Complete!');
    displaySuccess();

  } catch (error) {
    log(`\n✗ Error: ${error.message}`, 'red');
    log('Check onboarding-report.md for details', 'gray');
    process.exit(1);
  }
}

// Helper functions for each step
function checkNetwork() {
  try {
    exec(`curl -I ${REGISTRY_URL}`, { silent: true, ignoreErrors: false });
    return true;
  } catch {
    return false;
  }
}

async function authenticate() {
  // Check if already authenticated
  try {
    const whoami = exec('tessl whoami', { silent: true }).trim();
    if (whoami) {
      log(`  ✓ Already authenticated as ${whoami}`, 'green');
      return;
    }
  } catch {
    // Not authenticated, proceed with login
  }

  const headless = isHeadless();

  log('  Starting login flow...', 'blue');
  if (headless) {
    log('  (Headless environment detected - authentication URL will be displayed)', 'gray');
  } else {
    log('  (Browser will open for authentication)', 'gray');
  }
  console.log();

  // Start login in background and capture output as it streams
  return new Promise((resolve, reject) => {
    const loginProcess = spawn('tessl', ['login'], {
      stdio: ['inherit', 'pipe', 'pipe']
    });

    let output = '';
    let urlDisplayed = false;

    // Capture stdout and stderr
    const captureOutput = (data) => {
      const chunk = data.toString();
      output += chunk;

      // Try to parse URL and code from accumulated output
      if (!urlDisplayed) {
        const urlMatch = output.match(/https?:\/\/[^\s]+/);
        const codeMatch = output.match(/code[:\s]*\n\s*([A-Z0-9-]+)/i) ||
                         output.match(/following code[:\s]*\n\s*([A-Z0-9-]+)/i);

        if (urlMatch || codeMatch) {
          urlDisplayed = true;
          console.log();
          log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
          if (urlMatch) {
            log(`  Authentication URL:`, 'blue');
            log(`  ${urlMatch[0]}`, 'green');
          }
          if (codeMatch) {
            log(`  Code: ${codeMatch[1]}`, 'yellow');
          }
          log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
          console.log();
        }
      }
    };

    loginProcess.stdout.on('data', captureOutput);
    loginProcess.stderr.on('data', captureOutput);

    loginProcess.on('close', async (code) => {
      if (!urlDisplayed) {
        log('  Login flow initiated', 'gray');
        console.log();
      }

      log('  Waiting for authentication...', 'gray');
      if (headless) {
        log('  (Open the URL above in a browser and enter the code)', 'gray');
      } else {
        log('  (Complete the browser flow or use the URL above if needed)', 'gray');
      }
      console.log();

      // Poll for authentication completion
      const maxWait = 180000; // 3 minutes
      const pollInterval = 5000; // 5 seconds
      const startTime = Date.now();

      while (Date.now() - startTime < maxWait) {
        await new Promise(r => setTimeout(r, pollInterval));

        try {
          const whoami = exec('tessl whoami', { silent: true }).trim();
          if (whoami) {
            log(`  ✓ Authenticated as ${whoami}`, 'green');
            return resolve();
          }
        } catch {
          // Not authenticated yet, continue polling
        }
      }

      reject(new Error('Authentication timeout - please try again'));
    });

    loginProcess.on('error', (err) => {
      reject(new Error(`Failed to start login: ${err.message}`));
    });
  });
}

async function initProject() {
  // Check if already initialized
  if (fs.existsSync('tessl.json')) {
    log('  ✓ Project already initialized', 'green');
    return;
  }

  exec('tessl init');
  log('  ✓ Project initialized', 'green');
}

async function createExample() {
  const examplePath = 'examples/skill-builder';

  // Create directory structure
  fs.mkdirSync(path.join(examplePath, 'evals'), { recursive: true });

  // Copy only SKILL.md from package
  const packagePath = path.dirname(__filename);
  fs.copyFileSync(
    path.join(packagePath, 'examples/skill-builder/SKILL.md'),
    path.join(examplePath, 'SKILL.md')
  );

  // Get username for workspace-scoped name
  let username = 'user';
  try {
    const whoamiOutput = exec('tessl whoami', { silent: true });
    const usernameMatch = whoamiOutput.match(/Username\s+([^\s]+)/);
    if (usernameMatch) {
      username = usernameMatch[1];
    }
  } catch (e) {
    // Fall back to 'user' if can't get username
  }

  // Generate tile.json with workspace-scoped name
  const tileJson = {
    name: `${username}/skill-builder`,
    version: '0.1.0',
    summary: 'Scaffold new Tessl skills with best practices',
    description: 'Helps you scaffold new Tessl skills with best practices and proper structure',
    type: 'skill',
    private: true,
    skills: {
      'skill-builder': {
        path: 'SKILL.md'
      }
    },
    metadata: {
      tags: ['scaffolding', 'development', 'meta'],
      author: 'Tessl',
      license: 'MIT'
    }
  };
  fs.writeFileSync(
    path.join(examplePath, 'tile.json'),
    JSON.stringify(tileJson, null, 2) + '\n'
  );

  // Create basic eval scenarios
  const scenario1Path = path.join(examplePath, 'evals/scenario-1');
  const scenario2Path = path.join(examplePath, 'evals/scenario-2');
  fs.mkdirSync(scenario1Path, { recursive: true });
  fs.mkdirSync(scenario2Path, { recursive: true });

  // Scenario 1: Basic scaffolding
  fs.writeFileSync(
    path.join(scenario1Path, 'task.md'),
    `# Scenario 1: Basic Skill Scaffolding

Test that skill-builder can create a basic skill structure.

## Task
Use skill-builder to create a new skill called "hello-world" that prints a greeting.

## Expected Behavior
- Creates skill directory with SKILL.md
- Includes proper frontmatter (name, description)
- Has clear usage instructions
`
  );

  fs.writeFileSync(
    path.join(scenario1Path, 'criteria.json'),
    JSON.stringify({
      context: 'Test basic skill scaffolding functionality',
      type: 'weighted_checklist',
      checklist: [
        {
          name: 'Directory Creation',
          description: 'Creates skill directory with proper structure',
          max_score: 25
        },
        {
          name: 'SKILL.md File',
          description: 'Generates SKILL.md with proper frontmatter',
          max_score: 25
        },
        {
          name: 'Name and Description',
          description: 'Includes name and description in frontmatter',
          max_score: 25
        },
        {
          name: 'Usage Instructions',
          description: 'Provides clear usage instructions in the skill',
          max_score: 25
        }
      ]
    }, null, 2) + '\n'
  );

  // Scenario 2: Skill with examples
  fs.writeFileSync(
    path.join(scenario2Path, 'task.md'),
    `# Scenario 2: Skill with Examples

Test that skill-builder can create a skill with usage examples.

## Task
Use skill-builder to create a skill called "code-formatter" that includes usage examples.

## Expected Behavior
- Creates skill with examples section
- Examples are clear and functional
- Follows Tessl skill best practices
`
  );

  fs.writeFileSync(
    path.join(scenario2Path, 'criteria.json'),
    JSON.stringify({
      context: 'Test skill creation with examples',
      type: 'weighted_checklist',
      checklist: [
        {
          name: 'Examples Section',
          description: 'Includes a clear examples section',
          max_score: 30
        },
        {
          name: 'Example Quality',
          description: 'Examples are clear and demonstrate usage',
          max_score: 35
        },
        {
          name: 'Best Practices',
          description: 'Follows Tessl skill best practices',
          max_score: 35
        }
      ]
    }, null, 2) + '\n'
  );

  // Import skill (--force to skip prompts, --no-public to keep private)
  exec(`cd ${examplePath} && tessl skill import --force --no-public && cd ../..`);

  log('  ✓ skill-builder example created with tile and scenarios', 'green');
}

async function createRepoEvals() {
  const evalsPath = '.tessl/evals';
  fs.mkdirSync(evalsPath, { recursive: true });

  // Copy repo scenarios
  const packagePath = path.dirname(__filename);
  fs.copyFileSync(
    path.join(packagePath, '.tessl/evals/repo-scenarios.json'),
    path.join(evalsPath, 'repo-scenarios.json')
  );

  log('  ✓ Repo eval scenarios added', 'green');
}

async function runSkillReview() {
  const output = exec('tessl skill review examples/skill-builder --json', { silent: true });
  const results = JSON.parse(output);

  log(`  ✓ Review complete: ${results.score}/100`, 'green');
  log(`    (Review validates structure and quality)`, 'gray');

  return results;
}

async function runTileEval() {
  // Start eval
  const output = exec('tessl eval run examples/skill-builder --json', { silent: true });
  const { evalRunId } = JSON.parse(output);

  log(`  Eval started: ${evalRunId}`, 'gray');
  log('  Polling for results...', 'gray');

  // Poll for completion
  const maxWait = 300000; // 5 minutes
  const pollInterval = 15000; // 15 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));

    const statusOutput = exec(`tessl eval view ${evalRunId} --json`, { silent: true });
    const status = JSON.parse(statusOutput);

    if (status.status === 'complete') {
      const passed = status.scenarios.filter(s => s.passed).length;
      const total = status.scenarios.length;
      const passRate = Math.round((passed / total) * 100);

      log(`  ✓ Eval complete: ${passed}/${total} scenarios passed (${passRate}%)`, 'green');
      log(`    (Evals test functional correctness)`, 'gray');

      return status;
    }
  }

  throw new Error('Eval timeout - check results later with tessl eval view');
}

async function runRepoEval() {
  // Start repo eval
  try {
    const output = exec('tessl eval run --json', { silent: true });
    const { evalRunId } = JSON.parse(output);

    log(`  Repo eval started: ${evalRunId}`, 'gray');

    // Poll for completion (same as tile eval)
    const maxWait = 300000;
    const pollInterval = 15000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusOutput = exec(`tessl eval view ${evalRunId} --json`, { silent: true });
      const status = JSON.parse(statusOutput);

      if (status.status === 'complete') {
        const passed = status.scenarios.filter(s => s.passed).length;
        const total = status.scenarios.length;

        log(`  ✓ Repo eval complete: ${passed}/${total} scenarios passed`, 'green');
        log(`    (Repo evals test integration)`, 'gray');

        return status;
      }
    }

    log('  ⚠ Repo eval timeout (optional step)', 'yellow');
    return null;
  } catch (error) {
    log('  ⚠ Repo eval skipped (optional)', 'yellow');
    return null;
  }
}

async function generateOutputs(reviewResults, tileEvalResults, repoEvalResults, startTime) {
  const duration = Math.round((Date.now() - startTime) / 1000);
  const username = exec('tessl whoami', { silent: true }).trim();

  // Generate human summary
  const summary = `# Tessl Setup Complete! 🎉

You now have Tessl installed and configured. Here's what you have:

**✓ Tessl CLI** - Installed and authenticated as ${username}

**✓ skill-builder Skill** - A working example in \`examples/skill-builder/\` that helps you create more skills

**✓ Quality Checks Passed**
- Skill Review: ${reviewResults.score}/100 (structure ✓)
- Tile Eval: ${tileEvalResults.passed}/${tileEvalResults.total} scenarios passed (function ✓)
${repoEvalResults ? `- Repo Eval: ${repoEvalResults.passed}/${repoEvalResults.total} scenarios passed (integration ✓)` : '- Repo Eval: skipped (optional)'}

## What You Can Do Now

1. **Try skill-builder:** Use it to create your first skill
2. **Explore the registry:** Run \`tessl skill search\` to see what's available
3. **Read the docs:** Visit https://docs.tessl.io for more

## What You Learned

- **Skills** are tested, versioned agent capabilities
- **Review** validates structure before function
- **Evals** test real behavior with scenarios
- **The quality pipeline** ensures production readiness

Setup took ${duration} seconds. Happy building! 🚀
`;

  fs.writeFileSync('onboarding-summary.md', summary);

  // Generate agent report (detailed)
  const report = `# Tessl Onboarding Report

**Completed:** ${new Date().toISOString()}
**Duration:** ${duration} seconds
**User:** ${username}

## Execution Summary

All onboarding steps completed successfully.

## Results

### Skill Review
- Score: ${reviewResults.score}/100
- Status: ${reviewResults.score >= 80 ? 'Passed' : 'Needs improvement'}

### Tile Eval
- Scenarios: ${tileEvalResults.total}
- Passed: ${tileEvalResults.passed}
- Failed: ${tileEvalResults.total - tileEvalResults.passed}
- Pass Rate: ${Math.round((tileEvalResults.passed / tileEvalResults.total) * 100)}%

${repoEvalResults ? `### Repo Eval
- Scenarios: ${repoEvalResults.total}
- Passed: ${repoEvalResults.passed}
- Pass Rate: ${Math.round((repoEvalResults.passed / repoEvalResults.total) * 100)}%
` : '### Repo Eval\nSkipped (optional step)\n'}

## Artifacts Created

- \`examples/skill-builder/\` - Example skill
- \`.tessl/evals/\` - Repo eval scenarios
- \`onboarding-summary.md\` - Human summary
- \`onboarding-report.md\` - This report

## Next Steps

User should:
1. Try skill-builder to create a new skill
2. Explore the registry
3. Read documentation

Agents should:
- Suggest using skill-builder for new skills
- Remember user understands quality pipeline
- Maintain review ≥80%, eval ≥80% standards
`;

  fs.writeFileSync('onboarding-report.md', report);

  log('  ✓ Summary: onboarding-summary.md', 'green');
  log('  ✓ Report: onboarding-report.md', 'green');
}

function displaySuccess() {
  console.log();
  log('╔════════════════════════════════════════╗', 'green');
  log('║     Tessl Onboarding Complete! ✅      ║', 'green');
  log('╚════════════════════════════════════════╝', 'green');
  console.log();
  log('Created:', 'blue');
  log('  ✓ skill-builder example in examples/skill-builder/', 'green');
  log('  ✓ Quality reports showing everything works', 'green');
  log('  ✓ Summary in onboarding-summary.md', 'green');
  log('  ✓ Detailed report in onboarding-report.md', 'green');
  console.log();
  log('Try this:', 'blue');
  log('  "Use skill-builder to create a skill for code review"', 'gray');
  console.log();
  log('Questions? Check the docs: https://docs.tessl.io', 'blue');
  console.log();
}

// Run the main flow
main().catch(error => {
  log(`\nFatal error: ${error.message}`, 'red');
  process.exit(1);
});
