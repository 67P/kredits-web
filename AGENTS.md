# AGENTS.md

Reference for AI agents working in `kredits-web`.

## Overview

Unhosted Ember.js Web UI for [Kosmos Kredits](https://wiki.kosmos.org/Kredits) — a contribution-tracking and community-currency system. The app is serverless: it reads all data from the **Rootstock (RSK)** blockchain via `@kredits/contracts` + `ethers`, fetches contributor metadata from **IPFS**, and caches everything locally with `localforage`. No custom backend.

## Tech Stack

- **Ember.js 3.18** (Octane edition), **ember-cli** build pipeline (Broccoli)
- **Plain JavaScript** (no TypeScript; `jsconfig.json` only enables `experimentalDecorators`)
- **SCSS** for styling (no Tailwind/CSS modules)
- **ethers 5** + **@kredits/contracts** for on-chain reads/writes
- **ember-concurrency** for async sync tasks; **Ember Services** for state (no Redux, no Ember Data)
- **QUnit** + qunit-dom + fetch-mock for tests
- **Node 16** (`.nvmrc`); `>= 14` in engines

## Commands

| Task | Command |
|---|---|
| Dev server (RSK testnet) | `npm start` |
| Dev against local Hardhat devchain | `npm run start:local` |
| Full lint + test pipeline (CI) | `npm test` |
| Ember/QUnit suite only | `npm run test:ember` |
| Interactive test runner | `ember test --server` |
| All linters | `npm run lint` |
| Lint JS (autofix) | `npm run lint:js -- --fix` |
| Lint Handlebars templates | `npm run lint:hbs` |
| Production build into `release/` | `npm run build-prod` |
| Deploy to 5apps | `npm run deploy` (=`git push 5apps master`) |

No `format` or `typecheck` scripts (no TS, no Prettier).

## Project Structure

```
app/
├── components/      # PODS layout: <name>/component.js + template.hbs
├── controllers/     # Route controllers (dashboard, budget, signup, contributions/*, ...)
├── routes/          # Ember routes (mirror router.js hierarchy)
├── services/        # Singleton services — the core architecture
├── models/          # Plain EmberObject models (contributor, contribution, reimbursement)
├── helpers/         # Template helpers (fmt-*, etc.), dash-case files
├── utils/           # Plain JS utilities (dash-case)
├── styles/          # SCSS: app.scss + partials + components/_<name>.scss
└── templates/       # Route .hbs templates
config/              # environment.js, targets.js, optional-features.json
tests/               # unit/, integration/, fixtures/, helpers/
public/              # Static assets (img/, robots.txt)
release/             # Committed production build output (deployed via 5apps)
```

**Key files**:
- `app/services/kredits.js` (~784 lines) — central state hub; wraps `@kredits/contracts` SDK, holds `contributors`/`contributions`/`reimbursements`/`currentUser`, subscribes to contract events, runs ember-concurrency sync tasks.
- `app/services/browser-cache.js` — `localforage`-based offline persistence, namespaced per network.
- `app/router.js` — full route map (dashboard, contributions, contributors, signup, budget, reimbursements, about).
- `config/environment.js` — web3/IPFS/GitHub/API config + env-var overrides.

## Architecture

- **State**: The `kredits` service is the single source of truth. Components/controllers inject `@service kredits` and consume `contributors`, `contributions`, `reimbursements`, `currentUser`, and computed derivations (`contributionsConfirmed`, `kreditsByContributor`, …) via `alias`/`filterBy`/`sort` macros.
- **Identity/auth**: No login. The connected wallet address (`window.ethereum` → MetaMask, fallback read-only `JsonRpcProvider`) is mapped to a contributor via `Contributor.getContributorIdByAddress`. `currentUserIsContributor` / `currentUserIsCore` gate UI capabilities.
- **Live updates**: Contract event subscriptions (`ContributorAdded`, `ContributionAdded`, `ContributionVetoed`, `ReimbursementAdded`, `ReimbursementVetoed`, `Token.Transfer`) update local state. A `provider.on('block', …)` tick recomputes confirmed vs. unconfirmed items (confirmation is block-based).
- **Offline**: `browser-cache` loads from localforage on boot (`loadInitialData`), sets `*NeedSync` flags, then background sync tasks refill from chain. Enables fast unhosted operation.
- **Bootstrap**: `routes/application.js` → `beforeModel: kredits.setup()` → `model: loadInitialData() + addContractEventHandlers()` → `afterModel` schedules syncs.

## Conventions

- **Files**: dash-case (`contribution-list/component.js`, `fmt-crypto-currency.js`).
- **Components**: **PODS** layout — each component is a directory under `app/components/<name>/` with `component.js` + `template.hbs`.
- **Component style — prefer Octane for new code**: use `@glimmer/component` with `@tracked`, `@service`, `@action` decorators. The codebase is mid-migration from classic `Component.extend({...})` with `actions` hashes; don't force-rewrite existing classic components, but write new ones in Octane. ESLint and `template-lint` warn (not error) on classic patterns.
- **Styling**: plain SCSS — one partial per component at `app/styles/components/_<name>.scss`, imported by `app/styles/app.scss`. Semantic/BEM-ish class names.
- **Imports**: external libs → `@ember/*` → ember addons → app utils/models → `kredits-web/config/environment`. App imports use the `kredits-web/` absolute module prefix.
- **No jQuery** (`ember/no-jquery: error`). **No Ember Data** — models are plain `EmberObject.extend` with a `serialize()` returning `JSON.stringify`.
- **Indent**: 2 spaces, LF, UTF-8, trim trailing whitespace (`.editorconfig`).

## Config & Environment

Read in `config/environment.js` (lines ~102–110). No `.env.example` (`.gitignore` ignores `/.env*`).

| Var | Default | Purpose |
|---|---|---|
| `WEB3_PROVIDER_URL` | `https://rsk-testnet.kosmos.org` | JSON-RPC endpoint |
| `WEB3_CHAIN_ID` | `31` (RSK Testnet) | Target chain ID (used for MetaMask switching) |
| `WEB3_NETWORK_NAME` | `RSK Testnet` | Human-readable name; namespaces the localforage cache |
| `CI` | — | Toggles `testem.js` `--no-sandbox` and IE11 browser target |

## Testing

- **Framework**: QUnit via `ember-qunit` + `qunit-dom`; `@ember/test-helpers` (`render`, `click`, `fillIn`).
- **HTTP mocking**: `fetch-mock` — `tests/test-helper.js` mocks Bitstamp ticker endpoints globally.
- **Runner**: headless Chrome (`testem.js`); CI uses Node 16 via `.github/workflows/ci.yml`.
- **File patterns**:
  - `tests/unit/<type>/<name>-test.js` — unit tests for services, controllers, routes, models, helpers, utils.
  - `tests/integration/components/<name>/component-test.js` — component rendering tests (PODS layout).
  - `tests/integration/helpers/<name>-test.js` — helper tests.
  - `tests/fixtures/<name>.js` — shared fixture data (contributors, contributions, …).
  - `tests/helpers/create-component.js` — custom test helper.

## Gotchas

- **Mid-migration codebase**: classic and Octane component styles coexist. Linters warn (not error) on legacy patterns; `.template-lintrc.js` keeps a `pending` list of templates still using `{{action}}`.
- **`release/` is committed build output** — don't hand-edit; regenerated by `npm run build-prod` (auto-staged on `npm version`).
- **Deployment is `git push 5apps master`** (5apps static hosting) — pushing to `master` triggers a deploy. Be deliberate about commits/pushes.
- **No `.env.example`** — set `WEB3_*` vars inline (see `npm run start:local` for the pattern).
- **`gitno/`** contains auxiliary non-Ember scripts (bitstamp sync shell, `nostr.html`) — not part of the app.
