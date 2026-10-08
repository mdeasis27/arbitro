# Candidate arbitration

<!-- community-badges -->
[![CI](https://github.com/mdeasis27/arbitro/actions/workflows/ci.yml/badge.svg)](https://github.com/mdeasis27/arbitro/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
<!-- /community-badges -->

[Español](README.es.md) · [Try the demo](https://arbitro-manueldeasis27-2515s-projects.vercel.app/en/app) · [Case study](https://portafolio-mdea.vercel.app/en/projects/arbitro) · [Source](https://github.com/mdeasis27/arbitro)

![Actual interactive local interface](docs/images/cover.png)

Supply labels and confidence values and change the escalation threshold.

## Two situations to compare

**Consensus:** Three approve ballots at confidence 0.90, 0.80, 0.70; threshold 0.60. Aligned ballots resolve locally.

![Consensus](docs/images/scenario-a.png)

**Disagreement:** Approve / deny / review at 0.90 / 0.55 / 0.55; threshold 0.80. Divergent ballots escalate to review.

![Disagreement](docs/images/scenario-b.png)

## Business use case

Candidate recommendations can disagree without a safe automatic resolution.

**Who uses it:** Decision operator handling ambiguous cases.

**The decision:** Resolve a case locally or send it to human review.

Choose consensus or disagreement, inspect local ballots and confidence labels, then resolve or escalate the case.

### Try the decision

**Consensus:** Three approve ballots at confidence 0.90, 0.80, 0.70; threshold 0.60. Aligned ballots resolve locally.

**Disagreement:** Approve / deny / review at 0.90 / 0.55 / 0.55; threshold 0.80. Divergent ballots escalate to review.

Choose a scenario, edit its controls and run the local computation. Step through the visual process or reveal all steps. Reset before comparing the second scenario.

## How to try it

Open `/en/app` (English, default) or `/es/app` (Spanish). Change the scenario inputs and run the computation. Inspect the resulting decision, evidence and computed trace. Playback reveals completed local steps; it does not measure a live model. Reset starts a new local scenario. Changing language resets the scenario; the interface displays a reset notice.

The primary demo needs no account, API key or database. Public links refer to the existing deployment; local redesign changes are pending publication.

## Local setup and verification

Requires Node.js 22 and pnpm 10.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
node node_modules/typescript/bin/tsc --noEmit --incremental false
pnpm lint
pnpm build
```

Open `http://localhost:3000/en/app`. Recorded validation covers tests, lint, TypeScript and production builds. See [command results](docs/quality/decision-lab-verification.json) and [browser component checks](docs/quality/decision-lab-browser.json). The new browser checks exercise real React components and production CSS with controlled locale navigation; they do not certify Next routes or public deployment.

## Architecture

- `app/[lang]/`: localized browser experience.
- `lib/experience/`: typed local adapter, validation and run traces.
- `design-system/`: shared visual tokens, locale controls and execution/replay presentation.
- `app/api/`: optional server integrations; the primary demo does not require them.

Technology: Next.js 16, TypeScript, Python, Vitest, pytest, Tailwind CSS v4.

## Evidence and limitations

Candidate ballots converge into an arbitration node and review branch.

Vote distributions and review branches; supplied confidence is not calibrated probability.

Shows why ambiguous disagreement is escalated instead of hidden behind a single answer.

**Limits:** Confidence labels are scenario values and are not calibrated probabilities. These portfolio prototypes do not claim measured production impact.

Inputs use fictional or anonymized examples. Optional live integrations require their own credentials and operational setup. Secrets belong in the configured secret manager, never in local secret files or Git. Use the existing `infisical run -- <command>` workflow when live integration is needed. This repository does not publish or deploy automatically as part of the local demo.

![Actual English demo capture](docs/images/demo.png)

<!-- community-section -->
## License and contributing

Released under the [MIT License](LICENSE). Issues and pull requests are welcome: read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first. To report a vulnerability, see [SECURITY.md](SECURITY.md).
<!-- /community-section -->
