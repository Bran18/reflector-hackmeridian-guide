import Link from "next/link";
import { Hero } from "@/components/hero";

const DEADLINES = [
  { label: "Sun 25 Oct", detail: "Check-in from 09:00 at ONE16" },
  { label: "Overnight", detail: "Build with mentors on site" },
  { label: "Mon 12:00", detail: "Submissions close — no extensions" },
  { label: "Wed 28 Oct", detail: "Finalists pitch at Meridian" },
];

const CLIENTS = [
  {
    name: "PulseClient",
    use: "Hack default",
    body: "Public 5-min oracles. Reads are free simulations — no signTransaction. You must pass contractId.",
  },
  {
    name: "BeamClient",
    use: "Prepaid / faster",
    body: "Same SEP-40 reads plus track(). Every lastPrice needs a caller with active access. Skip unless you need it.",
  },
  {
    name: "FlareClient",
    use: "Webhooks",
    body: "Price-move and heartbeat subscriptions. contractId optional (mainnet default). Needs XRF.",
  },
  {
    name: "DaoClient",
    use: "Governance",
    body: "Ballots and XRF claims. Not needed to demo a price in your dapp.",
  },
];

const PULSE_SNIPPET = `import { PulseClient } from "@reflector/contract-client";

const client = new PulseClient({
  publicKey: process.env.REFLECTOR_PUBLIC_KEY!,
  rpcUrl: "https://soroban-testnet.stellar.org",
  contractId: "CCYOZJCOPG34LLQQ7N24YXBM7LL62R7ONMZ3G6WZAAYPB5OYKOMJRN63",
  networkPassphrase: "Test SDF Network ; September 2015",
});

const quote = await client.lastPrice("BTC");
// undefined if missing or stale — do not treat as 0`;

const STELLAR_AI = [
  {
    name: "skills.stellar.org",
    href: "https://skills.stellar.org/",
    note: "Official Stellar agent skills — assets, RPC, dapps, Soroban",
  },
  {
    name: "Stellar Raven",
    href: "https://raven.stellar.org/",
    note: "Official Stellar MCP — docs, ecosystem catalog, playbooks",
  },
];

const REPOS = [
  {
    name: "@reflector/contract-client",
    href: "https://github.com/reflector-network/contract-client-js",
    note: "Official Pulse / Beam / Flare / DAO JS client",
  },
  {
    name: "reflector-skill",
    href: "https://github.com/Bran18/reflector-skill",
    note: "Agent skill — deployments, clients, DeFi patterns",
  },
  {
    name: "reflector-vibe-coding-guide",
    href: "https://github.com/Bran18/reflector-vibe-coding-guide",
    note: "AI vibe-coding prompts and checklists",
  },
  {
    name: "reflector-market-board",
    href: "https://github.com/Bran18/reflector-market-board",
    note: "Next.js Server Components + PulseClient",
  },
];

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="band-ice border-y border-[#9ec5ce]">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
          {DEADLINES.map((item) => (
            <div
              key={item.label}
              className="border-b border-[#9ec5ce] px-6 py-7 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <p className="font-mono text-xs text-rf-cyan">{item.label}</p>
              <p className="mt-2 text-sm leading-snug">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band-void px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
                @reflector/contract-client
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-rf-muted">
                Official JS client for Pulse, Beam, Flare, and DAO. For this
                hackathon, install it, pick a Pulse{" "}
                <code className="font-mono text-rf-cyan">contractId</code>, and
                simulate <code className="font-mono text-rf-cyan">lastPrice</code>
                . Peer:{" "}
                <code className="font-mono text-xs">@stellar/stellar-sdk</code> ≥
                17.
              </p>
            </div>
            <a
              href="https://github.com/reflector-network/contract-client-js"
              target="_blank"
              rel="noopener noreferrer"
              className="rf-button rf-button--ghost shrink-0"
            >
              GitHub README
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {CLIENTS.map((client) => (
              <div
                key={client.name}
                className="border border-rf-line bg-rf-panel p-5"
              >
                <p className="font-mono text-xs text-rf-cyan">{client.use}</p>
                <h3 className="mt-1 font-display text-xl tracking-wide">
                  {client.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-rf-muted">
                  {client.body}
                </p>
              </div>
            ))}
          </div>

          <pre className="mt-8 overflow-x-auto rounded-[0.3rem] border border-rf-line bg-[#041014] p-4 font-mono text-[0.78rem] leading-relaxed text-rf-ice">
            npm i @reflector/contract-client @stellar/stellar-sdk
          </pre>
          <pre className="mt-3 overflow-x-auto rounded-[0.3rem] border border-rf-line bg-[#041014] p-5 font-mono text-[0.78rem] leading-relaxed text-rf-ice">
            {PULSE_SNIPPET}
          </pre>
          <p className="mt-3 text-xs text-rf-muted">
            Testnet CEX/DEX Pulse{" "}
            <code className="font-mono">CCYOZ…NV63</code> ·{" "}
            <code className="font-mono">publicKey</code> is only the simulation
            source — any valid G… works. Confirm assets on{" "}
            <a
              href="https://reflector.network/pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rf-cyan underline underline-offset-2"
            >
              Pulse
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/guide#path-a-fastest-demo-typescript-read-only"
              className="rf-button rf-button--cyan"
            >
              Full TypeScript walkthrough
            </Link>
            <a
              href="https://reflector.network/pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="rf-button rf-button--ghost"
            >
              Verify feeds
            </a>
          </div>
        </div>
      </section>

      <section className="band-ice border-y border-[#9ec5ce] px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl tracking-wide">
              Stellar building blocks
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-rf-muted">
              Assets (SAC <span className="font-mono text-rf-cyan">C…</span>),
              Soroban RPC (not Horizon), and server-only reads vs wallet signing —
              the guide maps each to Reflector so missing prices stop eating the
              night.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="border-l-2 border-rf-cyan pl-4">
              DEX Pulse →{" "}
              <code className="font-mono text-rf-cyan">contractId()</code> per
              network
            </li>
            <li className="border-l-2 border-rf-cyan pl-4">
              CEX / FX Pulse →{" "}
              <code className="font-mono text-rf-cyan">BTC</code>,{" "}
              <code className="font-mono text-rf-cyan">BRL</code> as Other symbols
            </li>
            <li className="border-l-2 border-rf-cyan pl-4">
              Handle <code className="font-mono text-rf-cyan">undefined</code> —
              never liquidate on a stale quote
            </li>
          </ul>
        </div>
      </section>

      <section className="band-void px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl tracking-wide">
            Stellar context for AI agents
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-rf-muted">
            Load skills from skills.stellar.org and connect Raven for live docs
            and ecosystem data (OAuth sign-in, no API keys). Then add
            reflector-skill for oracle IDs and staleness rules.
          </p>
          <ul className="mt-8 divide-y divide-rf-line border border-rf-line">
            {STELLAR_AI.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-rf-panel sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm text-rf-muted">{item.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band-ice border-t border-[#9ec5ce] px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl tracking-wide">Clone and ship</h2>
          <ul className="mt-8 divide-y divide-[#9ec5ce] border border-[#9ec5ce] bg-white">
            {REPOS.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 px-6 py-5 transition-colors hover:bg-[#c5ebf4] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold">{repo.name}</span>
                  <span className="text-sm text-rf-muted">{repo.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band-cyan px-5 py-14 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-display text-3xl tracking-wide md:max-w-lg">
            Read the checklist before submissions close Monday at 12:00.
          </h2>
          <Link href="/guide" className="rf-button rf-button--cyan shrink-0 !bg-rf-deep !text-rf-cyan">
            Open full guide
          </Link>
        </div>
      </section>
    </>
  );
}
