import Link from "next/link";
import { ReflectorMark } from "@/components/reflector-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-rf-line bg-rf-deep px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2 font-display text-xl tracking-wide">
            <ReflectorMark className="h-7 w-7" />
            Reflector
          </p>
          <p className="mt-3 text-sm leading-relaxed text-rf-muted">
            Decentralized price oracles on Stellar. This guide is for builders at
            HackMeridian 2026 — Pulse, Soroban RPC, and a demo path that holds up
            under judging.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <Link href="/guide" className="text-rf-cyan hover:underline">
            Full guide
          </Link>
          <a
            href="https://reflector.network/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rf-cyan"
          >
            reflector.network/docs
          </a>
          <a
            href="https://skills.stellar.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rf-cyan"
          >
            skills.stellar.org
          </a>
          <a
            href="https://raven.stellar.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rf-cyan"
          >
            Stellar Raven
          </a>
          <a
            href="https://www.hackmeridian.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rf-cyan"
          >
            hackmeridian.com
          </a>
          <a
            href="https://github.com/Bran18/reflector-skill"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rf-cyan"
          >
            reflector-skill
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-rf-muted">
        Visual language follows{" "}
        <a
          href="https://reflector.network/"
          className="underline underline-offset-2 hover:text-rf-cyan"
        >
          reflector.network
        </a>
        . Lisbon dates and venue are from HackMeridian; this site is not an
        official event property.
      </p>
    </footer>
  );
}
