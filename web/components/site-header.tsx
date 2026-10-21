import Link from "next/link";
import { ReflectorMark } from "@/components/reflector-mark";

type NavLink =
  | { href: string; label: string; external?: false }
  | { href: string; label: string; external: true };

const LINKS: NavLink[] = [
  { href: "/guide", label: "Guide" },
  { href: "https://reflector.network/docs", label: "Docs", external: true },
  { href: "https://reflector.network/pulse", label: "Pulse", external: true },
  { href: "https://reflector.network/flare", label: "Flare", external: true },
];

export function SiteHeader() {
  return (
    <header className="relative z-50 border-b border-rf-line bg-rf-deep/90 px-5 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <ReflectorMark className="h-8 w-8" />
          <span className="font-display text-lg tracking-wide">Reflector</span>
          <span className="hidden text-sm text-rf-muted sm:inline">
            for HackMeridian
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium md:flex"
          aria-label="Primary"
        >
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rf-text/90 hover:text-rf-cyan"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-rf-text/90 hover:text-rf-cyan"
              >
                {link.label}
              </Link>
            ),
          )}
          <a
            href="https://www.hackmeridian.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rf-chip"
          >
            Lisbon 25–26 Oct
          </a>
        </nav>

        <Link href="/guide" className="rf-button rf-button--cyan md:hidden">
          Guide
        </Link>
      </div>
    </header>
  );
}
