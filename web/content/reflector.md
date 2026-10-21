# Reflector at HackMeridian — integration guide

[Reflector](https://reflector.network/) is a **decentralized price oracle on Stellar**. Independent nodes agree off-chain and write quotes into **Soroban oracle contracts**. Your app or contract **reads** that on-chain state — you never call Reflector nodes directly.

This guide is tuned for a **28-hour hackathon**: start on **testnet**, ship a visible demo, then document how you would switch to mainnet.

**Canonical docs:** [reflector.network/docs](https://reflector.network/docs)

---

## HackMeridian at a glance

Synced from the [HackMeridian portal](https://hackmeridian-portal.vercel.app/) (MCP `event_info` / `schedule`). Confirm on [hackmeridian.com/schedule](https://www.hackmeridian.com/schedule) before you travel.

| | |
| --- | --- |
| **Event** | HackMeridian 2026 |
| **When** | 25–26 October 2026 |
| **Where** | ONE16, Lisbon, Portugal ([venue notes](https://www.hackmeridian.com/)) |
| **Rules** | [Portal rules](https://hackmeridian-portal.vercel.app/portal/rules) |
| **Prizes** | In-person in Lisbon required for prize eligibility |

### Deadlines that matter for your demo

All times below are **Lisbon local** (same window as the public [schedule](https://www.hackmeridian.com/schedule)).

| Phase | When |
| --- | --- |
| Check-in + hacking starts | Sun 25 Oct — doors from **09:00**; hacking from late morning (see schedule) |
| Overnight build | Sun evening → Mon morning |
| **Submissions close** | **Mon 26 Oct, 12:00** — no late submissions |
| Judging + closing | Mon 26 Oct afternoon |
| Finalist pitches (Meridian) | Wed 28 Oct — async judging uses repo, demo video, and README before this |

Plan Reflector integration so a judge can verify it in **under five minutes**: env vars or constants documented, one command to run the app, and README text for **feed ID**, **network**, and **staleness handling**.

### Portal + Cursor MCP

Connect AI tools from **Settings → Connect AI tools** in the portal. In `~/.cursor/mcp.json`, set:

```json
"headers": { "Authorization": "Bearer hmk_YOUR_TOKEN" }
```

The `Bearer ` prefix is required. Tools: `event_info`, `schedule`, `my_status`, `search_builders`.

For **Stellar-wide** context (docs, ecosystem projects, playbooks), add **[Stellar Raven](https://raven.stellar.org/)** — official MCP at `https://raven.stellar.org/mcp` (browser sign-in, no API keys). Pair it with **[skills.stellar.org](https://skills.stellar.org/)** so your agent loads the right Stellar skills (`assets`, `data`, `dapp`, `smart-contracts`, …) before touching Reflector.

---

## When Reflector fits your project

| Idea | Typical feed | Read from |
| --- | --- | --- |
| Lending, perps, liquidation | CEX/DEX or DEX (collateral in USDC/XLM) | Soroban consumer contract + optional UI |
| P2P / remittance **reference** FX | Fiat FX | Next.js API route or script (`PulseClient`) |
| Portfolio / treasury dashboard | CEX/DEX + DEX | Server-side reads ([reflector-market-board](../reflector-market-board/)) |
| “Alert me when BTC moves” | Any | [Flare](https://reflector.network/docs) subscriptions (webhooks; needs XRF) |
| Sub-second reads in production | Beam | Prepaid oracle; consumer must `track` |

For most HackMeridian MVPs, **Pulse** is enough: **free on-chain reads** (simulated via Soroban RPC), ~**5 minute** updates.

---

## Mental model (60 seconds)

```text
CEX APIs / Stellar DEX trades
           │
    Reflector nodes (consensus)
           │
    Pulse or Beam contract (SEP-40)
           │
    Your Soroban contract or dapp (simulate / invoke)
```

- Prices are **`i128` integers**: `human = price / 10^decimals`. Pulse often uses **14** decimals — call `decimals()`, do not assume 7.
- `lastprice` / `lastPrice` returns **nothing** when the quote is missing or stale. **Never** treat that as zero.
- Default **resolution** is **300 seconds** (5 min). For mints, liquidations, or swaps keyed on price, compare `timestamp` to ledger time.

Full architecture: [How it works](https://reflector.network/docs/how-it-works).

---

## Pick a Pulse feed (do not mix them up)

Each Pulse deployment is a **separate contract** with its own asset list. Copy the `C…` ID for the network you are on — do not mix mainnet IDs with testnet RPC.

**Stellar pubnet DEX** — SAC tokens (`Asset::Stellar`)

- Mainnet: `CALI2BYU2JE6WVRUFYTS6MSBNEHGJ35P4AVCZYF3B6QOE3QKOB2PLE6M`
- Testnet (pubnet DEX feed on testnet): `CAVLP5DH2GJPZMVO7IJY4CVOD5MWEFTJFVPD2YY2FQXOQHRGHK4D6HLP`

**Stellar testnet DEX** — testnet-native SAC tokens

- Mainnet: none
- Testnet: `CA2NWEPNC6BD5KELGJDVWWTXUE7ASDKTNQNL6DN3TGBVWFEWSVVGMUAF`

**CEX / DEX tickers** — `BTC`, `ETH`, … (`Asset::Other`)

- Mainnet: `CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN`
- Testnet: `CCYOZJCOPG34LLQQ7N24YXBM7LL62R7ONMZ3G6WZAAYPB5OYKOMJRN63`

**Fiat FX** — `GBP`, `EUR`, `BRL`, … (`Asset::Other`)

- Mainnet: `CBKGPWGKSKZF52CFHMTRR23TBWTPMRDIYZ4O2P5VS65BMHYH4DXMCJZC`
- Testnet: `CCSSOHTBL3LEWUCBBEB5NJFC2OKFRC74OWEIJIZLRJBGAAU4VMU5NV4W`

**Verify before you demo:** [reflector.network/pulse](https://reflector.network/pulse) and call `assets()` on your contract.

### Asset encoding rules (top cause of “no price”)

| Feed type | How to pass the asset |
| --- | --- |
| DEX (pubnet or testnet) | `Asset::Stellar(<SAC contract C…>)` — **not** the ticker `"XLM"` |
| CEX/DEX | `Asset::Other(Symbol)` e.g. `BTC` |
| FX | `Asset::Other(Symbol)` e.g. `GBP`, `BRL` |

On **testnet**, pubnet SAC addresses on the “Pubnet DEX (on testnet)” feed are still **pubnet** `C…` addresses. Testnet-native tokens use the **Stellar Testnet DEX** feed and **testnet** `C…` addresses.

---

## Stellar building blocks (assets, data, dapp)

Reflector sits on top of normal Stellar primitives. These three areas explain most integration bugs at HackMeridian.

### Assets + SAC → DEX feed keys (`C…`, not `G…`)

Pulse **DEX** feeds price **Stellar Assets** by their **Stellar Asset Contract (SAC)** address — a `C…` contract ID — not by classic `code:issuer` and not by the issuer’s `G…` account.

| You have | What Reflector needs on a DEX feed |
| --- | --- |
| `USDC` + issuer `G…` (wallet / Horizon balance line) | SAC `C…` for that asset on the **same network** as the feed |
| Ticker `"XLM"` or `"USDC"` string | Wrong on DEX feeds — use `assets()` or derive SAC |
| Your own issued test asset | Trustline + payments on classic; for oracle + Soroban, deploy or derive SAC |

Derive SAC from a classic asset (must match `networkPassphrase` / network of the Pulse feed):

```typescript
import { Asset, Networks } from "@stellar/stellar-sdk";

const usdc = new Asset(
  "USDC",
  "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN", // pubnet issuer — example only
);
const sacContractId = usdc.contractId(Networks.PUBLIC); // C… for Pubnet DEX Pulse

// @reflector/contract-client accepts C… as Stellar, tickers as Other:
import { buildAsset } from "@reflector/contract-client";
buildAsset(sacContractId); // { tag: "Stellar", values: ["C…"] }
buildAsset("BTC");         // { tag: "Other", values: ["BTC"] } — CEX/FX feeds only
```

**Hackathon rule:** If your UI shows `USDC (G…)`, your Reflector call still needs the matching `C…` from `contractId()` or from `await client.assets()`. Trustlines and `changeTrust` are unrelated to oracle reads — you do not need a trustline to **simulate** `lastPrice`, but you **do** need SAC IDs to match the feed.

Further reading: [Stellar assets & SAC](https://developers.stellar.org/docs/build/apps/asset) (issuance, trustlines, `contractId`).

### Data → Soroban RPC, not Horizon

`PulseClient` / `lastprice` in a contract use **Soroban RPC** (`simulateTransaction` for off-chain reads). **Horizon** is for classic accounts, payments, and history — it cannot replace RPC for oracle simulation.

| Task | API |
| --- | --- |
| Read Pulse price (JS, no wallet) | Soroban RPC + `@reflector/contract-client` |
| Load account sequence / classic payment | Horizon (or RPC `getAccount` for sequence only) |
| Submit Soroban tx (your consumer contract) | RPC `sendTransaction` + poll |
| Staleness vs “now” off-chain | Compare `PriceData.timestamp` to `Math.floor(Date.now()/1000)` or RPC `getLatestLedger()` |

Testnet default (hackathon):

```typescript
import { rpc } from "@stellar/stellar-sdk"; // rpc.Server

const server = new rpc.Server("https://soroban-testnet.stellar.org");
await server.getHealth(); // quick connectivity check before demo
```

Mainnet: pick a provider from the [RPC providers directory](https://developers.stellar.org/docs/data/apis/rpc/providers) and use the **same network** as your `contractId`.

Further reading: [Stellar RPC](https://developers.stellar.org/docs/data/apis/rpc).

### dapp → when you need a wallet vs server-only

| Action | Wallet / `signTransaction`? |
| --- | --- |
| `PulseClient.lastPrice`, `assets()`, `decimals()` | **No** — server or script; any `G…` as simulation source |
| `extendAssetTtl` (sponsor feed TTL) | **Yes** — funded account signs |
| User invokes **your** Soroban contract that reads Reflector | **Yes** — user (or relayer) signs the invoke |
| Show reference price in Next.js | Prefer **Server Components / API route**; keep `REFLECTOR_RPC_URL` out of `NEXT_PUBLIC_*` |

Pattern aligned with [reflector-market-board](../reflector-market-board/lib/reflector/client.ts): one shared `PulseClient` on the server, Freighter only when the user submits on-chain txs.

For invoking your own contract from the browser, use `contract.Client` from `@stellar/stellar-sdk` with the wallet’s `signTransaction` — Reflector stays a **read** inside that contract, not a separate wallet call.

Further reading: [JS SDK — invoke a contract](https://stellar.github.io/js-stellar-sdk/guides/06-invoke-a-contract).

### Quick decision tree

```text
Pricing on-chain Stellar token (XLM, USDC, pool asset)?
  → Pubnet or Testnet DEX Pulse + SAC (C…) from contractId() or assets()

Pricing BTC/ETH or fiat FX?
  → CEX/DEX or FX Pulse + Asset::Other(symbol)

Only showing price in UI?
  → Path A below (RPC + PulseClient, server-side)

Enforcing price in Soroban (liquidation, mint)?
  → Path B (consumer contract lastprice + staleness check)
```

---

## Path A — Fastest demo (TypeScript, read-only)

**Time budget:** ~30–60 minutes to first price on screen.

### 1. Install

```bash
npm install @reflector/contract-client @stellar/stellar-sdk
```

Peer: `@stellar/stellar-sdk` ≥ 17.

### 2. Environment (testnet FX example)

```env
REFLECTOR_PUBLIC_KEY=GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REFLECTOR_RPC_URL=https://soroban-testnet.stellar.org
REFLECTOR_PULSE_CONTRACT_ID=CCSSOHTBL3LEWUCBBEB5NJFC2OKFRC74OWEIJIZLRJBGAAU4VMU5NV4W
REFLECTOR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

`REFLECTOR_PUBLIC_KEY` is only the **source account on a simulated transaction** — reads do not sign. Any valid `G…` is fine.

### 3. Read BTC or FX

```typescript
import { PulseClient } from "@reflector/contract-client";
import { Networks } from "@stellar/stellar-sdk";

const client = new PulseClient({
  publicKey: process.env.REFLECTOR_PUBLIC_KEY!,
  rpcUrl: process.env.REFLECTOR_RPC_URL!,
  contractId: process.env.REFLECTOR_PULSE_CONTRACT_ID!,
  networkPassphrase: Networks.TESTNET,
});

const decimals = await client.decimals();
const resolution = await client.resolution();
const data = await client.lastPrice("BTC"); // undefined if missing/stale

if (!data) {
  throw new Error("No usable BTC quote from Reflector");
}

const maxAgeSec = resolution * 2;
const nowSec = Math.floor(Date.now() / 1000);
if (nowSec - data.timestamp > maxAgeSec) {
  throw new Error("Reflector quote is too old for this action");
}

// data.price is bigint — format with decimals, not Number(price)
```

### 4. Clone the reference app

```bash
cd reflector-market-board
cp .env.example .env.local
# edit .env.local, then:
npm install && npm run dev
```

Live demo: [reflector-market-board.vercel.app](https://reflector-market-board.vercel.app/)

Patterns to copy: `lib/reflector/client.ts`, `lib/reflector/assets.ts`, `lib/reflector/format-price.ts`.

**Next.js tip:** keep Pulse reads in **Server Components** or API routes (`import "server-only"`). Do not put RPC URLs in `NEXT_PUBLIC_*` unless you accept public abuse.

---

## Path B — Soroban consumer contract

**Time budget:** half a day with the [smart contracts](https://developers.stellar.org/docs/build/smart-contracts) flow already working.

1. Copy the SEP-40 client trait from [Reflector interface docs](https://reflector.network/docs/interface) into your crate (`ReflectorClient` / `ReflectorPulseClient` — same methods, different generated name).
2. Store the oracle `C…` as a constant (testnet table above).
3. In your entrypoint:

```rust
let client = ReflectorClient::new(&e, &oracle_address);
let asset = ReflectorAsset::Other(Symbol::new(&e, "BTC"));
let Some(quote) = client.lastprice(&asset) else {
    panic_with_error!(&e, Error::NoOraclePrice);
};
let max_age = client.resolution() as u64 * 2;
if e.ledger().timestamp().saturating_sub(quote.timestamp) > max_age {
    panic_with_error!(&e, Error::StaleOraclePrice);
}
// use quote.price with client.decimals()
```

Worked patterns (liquidation, peg, TWAP): [Reflector examples](https://reflector.network/docs/examples).

**Cross-contract call:** your contract invokes the oracle contract’s `lastprice` during your transaction; the oracle address must match the network you deploy on.

---

## Path C — Compose with other Stellar tools (judging angle)

Reflector is often **composed** with escrow, DEX, or wallet flows rather than standing alone.

| Pattern | Reflector role | Ecosystem piece |
| --- | --- | --- |
| P2P marketplace | Show **reference** FX; trade at **offer** price | Escrow (e.g. Trustless Work) |
| Swap + hedge | Quote collateral in USD | Soroswap / pool + Pulse CEX/DEX |
| Treasury bot | Rebalance when FX moves | Flare webhook + server signer |

Example in this repo: [UPEER Reflector integration](../upeer/docs/integration-reflector.md) — reference rates on the server, settlement price from the offer.

In your README, spell out: **what is executable on-chain vs informational**.

---

## Pulse vs Beam (hackathon default)

| | **Pulse** | **Beam** |
| --- | --- | --- |
| Speed | ~5 min | Faster, configurable |
| Read cost | Free (simulate) | XRF burned per read |
| Setup | Pick public `contractId` | Per-use Beam contract + `track` |
| Rust call | `lastprice(asset)` | `lastprice(caller, asset)` |

Stay on Pulse unless mentors agree you need Beam latency.

---

## Feed health and sponsorship (don’t get caught at demo)

- Pulse data has **TTL** in contract storage. If a feed is expired, reads return nothing.
- Anyone can **`extend_asset_ttl`** (costs XRF on mainnet). For a weekend hack, pick assets that already show fresh prices on [Pulse](https://reflector.network/pulse).
- Off-chain, call `expires(asset)` when building ops dashboards.

---

## 15-minute smoke test

Run this checklist before you rely on Reflector in your demo path:

1. **RPC** — Soroban RPC responds (not Horizon alone).
2. **`decimals()` and `resolution()`** — succeed for your `contractId`.
3. **`assets()`** — your asset appears exactly (compare `C…` vs symbol).
4. **`lastPrice` / `lastprice`** — returns a value, not `undefined` / `None`.
5. **Staleness** — `timestamp` within `2 × resolution` for any user-facing “live price”.
6. **Wrong-feed test** — deliberately use the wrong SAC on a DEX feed; confirm you handle missing price gracefully.

---

## Mainnet cutover (after testnet works)

Change **all** of these together:

1. `contractId` → mainnet row in the table above  
2. `networkPassphrase` / RPC → `Networks.PUBLIC` and a mainnet Soroban RPC  
3. Asset keys → pubnet `C…` on DEX feeds  

Consumer logic stays the same.

---

## Tell judges you integrated Reflector

Include in README or demo script:

1. **Which Pulse feed** (DEX / CEX / FX) and **why** it matches your assets.  
2. **Snippet or screen** of `lastPrice` / `lastprice` with **timestamp + decimals**.  
3. **Failure behavior** when price is missing or stale (revert, disable button, fallback copy).  
4. **Network** (testnet for hackathon; mainnet plan if Scale track).  

Optional: link to [SEP-40](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0040.md) and note Reflector as your oracle provider.

---

## Links and support

| Resource | URL |
| --- | --- |
| Docs | https://reflector.network/docs |
| Interface (Rust trait) | https://reflector.network/docs/interface |
| Examples | https://reflector.network/docs/examples |
| JS client | https://github.com/reflector-network/contract-client-js |
| Contract source | https://github.com/reflector-network/reflector-contract |
| Stellar oracles overview | https://developers.stellar.org/docs/data/oracles/oracle-providers |
| **Stellar Skills** | [skills.stellar.org](https://skills.stellar.org/) — official agent skills (RPC, assets/SAC, dapps, Soroban); install `stellar/stellar-dev-skill` or browse per-topic `SKILL.md` URLs |
| **Stellar Raven** | [raven.stellar.org](https://raven.stellar.org/) — SDF MCP: docs search, live ecosystem catalog, playbooks (`https://raven.stellar.org/mcp`) |
| **Reflector agent skill** | [github.com/Bran18/reflector-skill](https://github.com/Bran18/reflector-skill) — Cursor/Claude skill with deployments, clients, and DeFi patterns |
| **Vibe-coding guide** | [github.com/Bran18/reflector-vibe-coding-guide](https://github.com/Bran18/reflector-vibe-coding-guide) — prompts and workflows for AI-assisted Reflector integration |
| Live Pulse demo | [reflector-market-board](https://github.com/Bran18/reflector-market-board) |
| Community | [Reflector Discord](https://discord.gg/reflector) (also linked from reflector.network) |

**On-site:** use mentor office hours and workshops on the [HackMeridian schedule](https://www.hackmeridian.com/schedule). For teammate search, use the portal builder directory or MCP `search_builders`.

---

## Common mistakes (save hours)

| Mistake | What you see |
| --- | --- |
| Ticker `"XLM"` on a DEX feed | `undefined` / `AssetMissing` |
| Testnet SAC on pubnet DEX oracle | No price |
| Mainnet `contractId` on testnet RPC | Simulation errors |
| `Number(bigint)` for display | Rounded wrong prices |
| Liquidate/mint on `undefined` quote | Critical bug — always abort |

---

## AI-assisted building

HackMeridian allows AI copilots. Give your agent:

1. This guide (or the HackMeridian web copy under `hackguide/web`)  
2. [Official Reflector docs](https://reflector.network/docs)  
3. **[skills.stellar.org](https://skills.stellar.org/)** — tell the agent to read it before building; add [`stellar/stellar-dev-skill`](https://github.com/stellar/stellar-dev-skill) or open the topic you need (`assets`, `data`, `dapp` for SAC + RPC + wallets)  
4. **[Stellar Raven](https://raven.stellar.org/)** — one MCP for Stellar docs and ecosystem context (`claude mcp add --transport http stellar-raven https://raven.stellar.org/mcp`, or add the URL in Cursor `mcp.json`)  
5. The [**reflector-skill**](https://github.com/Bran18/reflector-skill) agent skill (`npx skills add Bran18/reflector-skill`) — contract IDs, `PulseClient` / Soroban consumer traits, staleness rules  
6. [**reflector-vibe-coding-guide**](https://github.com/Bran18/reflector-vibe-coding-guide) — vibe-coding prompts and checklists aligned with HackMeridian-style builds  
7. [reflector-market-board](https://github.com/Bran18/reflector-market-board) for a working Next.js read path  

Hard rule for agents: **never invent contract IDs** — always cross-check [Pulse](https://reflector.network/pulse) and `assets()` on the oracle you call.
