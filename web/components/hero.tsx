import Link from "next/link";
import { ReflectorMark } from "@/components/reflector-mark";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-rings" aria-hidden />
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="rf-chip">HackMeridian · 25–26 Oct · ONE16</p>
          <h1>
            Wire Pulse
            <br />
            before Monday.
          </h1>
          <p className="hero-lede">
            A builder guide for Reflector on Stellar: pick the right oracle
            contract, call <code>lastPrice</code> over Soroban RPC, and have a
            quote on screen before submissions close at 12:00.
          </p>
          <div className="hero-actions">
            <Link href="/guide" className="rf-button rf-button--cyan">
              Open the guide
            </Link>
            <a
              href="https://github.com/reflector-network/contract-client-js"
              target="_blank"
              rel="noopener noreferrer"
              className="rf-button rf-button--ghost"
            >
              JS client
            </a>
          </div>
        </div>

        <div className="hero-tick">
          <div className="hero-tick-head">
            <ReflectorMark className="h-10 w-10" spin />
            <div>
              <p className="hero-tick-pair">BTC / USD</p>
              <p className="hero-tick-feed">Pulse · CEX/DEX · testnet example</p>
            </div>
          </div>
          <p className="hero-tick-price">
            <span>79,601</span>
            <span className="hero-tick-frac">.303732035</span>
          </p>
          <dl className="hero-tick-meta">
            <div>
              <dt>method</dt>
              <dd>lastPrice(&quot;BTC&quot;)</dd>
            </div>
            <div>
              <dt>decimals</dt>
              <dd>14</dd>
            </div>
            <div>
              <dt>resolution</dt>
              <dd>300s</dd>
            </div>
            <div>
              <dt>if undefined</dt>
              <dd>do not use</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
