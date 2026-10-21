# HackMeridian developer guides

Practical integration guides for builders at **[HackMeridian 2026](https://www.hackmeridian.com/)** (25–26 October, ONE16, Lisbon). Use them during the 28-hour build window and when writing your submission README.

| | |
| --- | --- |
| **Dates** | 25–26 October 2026 |
| **Location** | Lisbon, Portugal (ONE16) |
| **Submissions** | **Mon 26 Oct, 12:00** Lisbon — [schedule](https://www.hackmeridian.com/schedule) |
| **Rules** | [Portal rules](https://hackmeridian-portal.vercel.app/portal/rules) |
| **Prizes** | Must attend **in person** in Lisbon to be eligible |

| Guide | Best for |
| --- | --- |
| [Integrate Reflector](./reflector.md) | On-chain price feeds in dapps, backends, or Soroban contracts (DeFi, P2P reference rates, dashboards, liquidation logic) |

### Web (Vercel)

Deployable Next.js site: **[`web/`](./web/)** — landing at `/`, full guide at `/guide`. See [`web/README.md`](./web/README.md).

## Repos in this workspace

| Project | Role |
| --- | --- |
| [reflector-market-board](../reflector-market-board/) | Clone-and-run Next.js demo: `PulseClient`, asset discovery, formatting |
| [upeer](../upeer/) | Production-style BFF pattern: server FX reference + quote snapshots ([integration doc](../upeer/docs/integration-reflector.md)) |

## Stellar AI tooling (SDF)

| Resource | Role |
| --- | --- |
| [skills.stellar.org](https://skills.stellar.org/) | Official Stellar agent skills — smart contracts, assets, RPC/Horizon, dapps, payments, cross-chain |
| [Stellar Raven](https://raven.stellar.org/) | Official Stellar MCP — docs, ecosystem catalog, playbooks; endpoint `https://raven.stellar.org/mcp` |

Use Raven + Stellar Skills for general Stellar context; add the Reflector-specific repos below when you integrate oracles.

## Companion repos (AI + Reflector)

| Repo | Role |
| --- | --- |
| [reflector-skill](https://github.com/Bran18/reflector-skill) | Agent skill for Cursor, Claude Code, etc. — Pulse/Beam, deployments, JS + Rust consumers |
| [reflector-vibe-coding-guide](https://github.com/Bran18/reflector-vibe-coding-guide) | Vibe-coding workflows and prompts for building with Reflector at speed |

## Stellar skills that pair with Reflector

The Reflector guide includes a **Stellar building blocks** section (assets/SAC, RPC vs Horizon, wallet vs server reads). Deeper references:

| Topic | Stellar docs |
| --- | --- |
| SAC `C…` from `code:issuer`, trustlines | [Assets](https://developers.stellar.org/docs/build/apps/asset) · [skills: assets](https://skills.stellar.org/skills/assets/SKILL.md) |
| Soroban RPC, simulation, testnet URL | [RPC](https://developers.stellar.org/docs/data/apis/rpc) · [skills: data](https://skills.stellar.org/skills/data/SKILL.md) |
| Freighter, `contract.Client`, tx UX | [JS SDK guides](https://stellar.github.io/js-stellar-sdk/) · [skills: dapp](https://skills.stellar.org/skills/dapp/SKILL.md) |

## Official Reflector docs

- [Reflector docs](https://reflector.network/docs)
- [How it works](https://reflector.network/docs/how-it-works)
- [SEP-40 interface](https://reflector.network/docs/interface)
- [Examples (liquidation, peg, rebalancing)](https://reflector.network/docs/examples)
- [Pulse feed list](https://reflector.network/pulse)

## HackMeridian portal + AI tools

The [HackMeridian portal](https://hackmeridian-portal.vercel.app/) exposes an MCP server so tools like Cursor can read **schedule**, **event info**, **your team/submission status**, and **search builders** for teammates. Generate a token under **Settings → Connect AI tools** and add it to your MCP config as `Authorization: Bearer hmk_…` (the `Bearer ` prefix is required).

For hackathon building beyond event logistics, wire up [Stellar Raven](https://raven.stellar.org/) and [skills.stellar.org](https://skills.stellar.org/) alongside HackMeridian MCP and [reflector-skill](https://github.com/Bran18/reflector-skill).

Judges care about a clear README, demo video, and real Stellar integration. If Reflector is part of your story, show **which feed** you use, **how you handle missing/stale prices**, and **testnet vs mainnet** constants.
