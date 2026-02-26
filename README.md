# Tessl Onboarding

Interactive onboarding system for Tessl - learn by doing in 5 minutes.

## What This Is

A multi-format onboarding experience that:
- Installs and configures Tessl CLI
- Creates a working "skill-builder" example
- Runs the full quality pipeline (review → eval)
- Teaches Tessl through hands-on setup

**Target Audience:** Newcomers to Tessl (both AI agents and human developers)

## Quick Start

### Claude Code
```
/tessl-onboarding
```

### NPX (Terminal)
```bash
npx @tessl/onboard
```

### Any AI Agent
Fetch the onboarding guide:
```
https://tessl.io/onboard.md
```

## What You Get

After completing onboarding:
- ✓ Tessl CLI installed and authenticated
- ✓ Working skill-builder example in your project
- ✓ Understanding of quality pipeline
- ✓ Ready to create and publish your own skills

## Time Required

~5 minutes (varies by network speed)

## Outputs

- `examples/skill-builder/` - Working example skill
- `onboarding-summary.md` - Human-friendly summary
- `onboarding-report.md` - Detailed execution log

## Architecture

**Content-First Design:**
- Core: `TESSL_ONBOARDING.md` (universal markdown guide)
- Adapters: Claude Code skill, NPX package, web endpoint
- Philosophy: Single source of truth, thin format-specific wrappers

## Repository Structure

```
tessl-onboarding/
├── TESSL_ONBOARDING.md          # Core onboarding guide
├── ADAPTING.md                   # Adapter pattern documentation
├── IMPLEMENTATION_PLAN.md        # Implementation plan
├── TESTING.md                    # Testing guide
├── README.md                     # This file
├── examples/skill-builder/       # Curated example skill
├── .tessl/evals/                 # Repo-level eval scenarios
├── adapters/                     # Format-specific adapters
│   ├── claude-code/              # Claude Code skill
│   ├── cursor/                   # Cursor adapter
│   └── copilot/                  # GitHub Copilot adapter
├── package.json                  # NPX package
├── cli.js                        # NPX entry point
├── web/                          # Web hosting files
│   ├── index.html
│   ├── onboard.md
│   └── serve-onboarding.md
└── docs/plans/                   # Design documents
```

## Development

**Install dependencies:**
```bash
npm install
```

**Test locally:**
```bash
# Test NPX
node cli.js

# Test skill (requires Claude Code)
claude-code skill install ./adapters/claude-code

# Test web (requires local server)
cd web && python3 -m http.server 8000
```

**Run tests:**
```bash
npm test
```

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

## Deployment

**Claude Code Skill:**
- Publish to Claude Code skill registry
- Users install with skill manager

**NPX Package:**
```bash
npm publish
```

**Web Endpoint:**
- Deploy `web/` directory to static hosting (Vercel, Netlify, GitHub Pages)
- See `web/serve-onboarding.md` for details

## Design Decisions

**Why content-first?**
- AI agents excel at following markdown instructions
- Single source of truth, easier to maintain
- Transparent and debuggable

**Why three formats?**
- Different users prefer different tools
- Maximizes reach and adoption
- Proves portability of core content

**Why skill-builder as example?**
- Meta: teaches by being what it teaches
- Immediately useful after onboarding
- Self-reinforcing learning

See [design document](./docs/plans/2026-02-24-tessl-agent-onboarding-design.md) for full details.

## Contributing

Contributions welcome! Please:
1. Read design docs first
2. Test changes across all three formats
3. Update TESSL_ONBOARDING.md if changing flow
4. Run full test suite before submitting

## Documentation

- [Design Document](./docs/plans/2026-02-24-tessl-agent-onboarding-design.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Testing Guide](./TESTING.md)
- [Tessl Docs](https://docs.tessl.io)

## License

MIT

## Support

- [Tessl Documentation](https://docs.tessl.io)
- [GitHub Issues](https://github.com/tessl/onboard/issues)
- [Community](https://community.tessl.io)
