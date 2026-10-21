import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownGuide } from "@/components/markdown-guide";
import { getReflectorGuideMarkdown } from "@/lib/content";

export const metadata: Metadata = {
  title: "Integration guide",
  description:
    "Full Reflector integration guide for HackMeridian: feeds, TypeScript, Soroban, smoke tests.",
};

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractSectionLinks(markdown: string) {
  const links: { title: string; id: string }[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^## (.+)$/.exec(line);
    if (match) {
      const title = match[1].replace(/\*\*/g, "").trim();
      links.push({ title, id: slugifyHeading(title) });
    }
  }
  return links;
}

export default function GuidePage() {
  const markdown = getReflectorGuideMarkdown();
  const sections = extractSectionLinks(markdown);

  return (
    <div className="bg-rf-ice text-rf-ink">
      <div className="border-b border-rf-line-paper bg-rf-paper px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-semibold text-rf-primary underline underline-offset-4"
          >
            ← Home
          </Link>
          <p className="mt-6 text-sm font-semibold text-rf-primary">
            Developer guide
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
            Reflector at HackMeridian
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5a7278]">
            Source:{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-rf-ink">
              hackguide/reflector.md
            </code>
            . After edits, run{" "}
            <code className="font-mono text-xs">npm run sync:content</code>.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <p className="text-xs font-semibold text-[#5a7278]">On this page</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm" aria-label="Sections">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="leading-snug text-rf-ink hover:text-rf-primary"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 pb-20">
          <MarkdownGuide markdown={markdown} />
        </div>
      </div>
    </div>
  );
}
