import Link from "next/link";
import { ReflectorMark } from "@/components/reflector-mark";
import { getBtcTick } from "@/lib/pulse";

export async function Hero() {
  const tick = await getBtcTick();

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
              <p className="hero-tick-pair">
                BTC / {tick?.baseLabel ?? "USD"}
              </p>
              <p className="hero-tick-feed">
                Pulse · CEX/DEX · mainnet lastPrice
              </p>
            </div>
          </div>
          {tick ? (
            <p className="hero-tick-price">
              <span>{tick.whole}</span>
              {tick.fraction ? (
                <span className="hero-tick-frac">.{tick.fraction}</span>
              ) : null}
            </p>
          ) : (
            <p className="hero-tick-price hero-tick-missing">no usable quote</p>
          )}
          <dl className="hero-tick-meta">
            <div>
              <dt>method</dt>
              <dd>lastPrice(&quot;BTC&quot;)</dd>
            </div>
            <div>
              <dt>decimals</dt>
              <dd>{tick ? String(tick.decimals) : "—"}</dd>
            </div>
            <div>
              <dt>age</dt>
              <dd>
                {tick
                  ? tick.stale
                    ? `${tick.ageSec}s (stale)`
                    : `${tick.ageSec}s`
                  : "—"}
              </dd>
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
