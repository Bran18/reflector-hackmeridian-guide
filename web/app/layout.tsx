import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat, Oswald } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600"],
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reflector at HackMeridian — integration guide",
    template: "%s · Reflector",
  },
  description:
    "Ship Reflector Pulse price feeds during HackMeridian 2026: testnet setup, Soroban RPC, SAC keys, and demo checklist for Lisbon.",
  openGraph: {
    title: "Reflector at HackMeridian",
    description:
      "28-hour hackathon guide for Stellar builders integrating Reflector oracles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${oswald.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="fixed left-3 top-0 z-[200] -translate-y-[150%] rounded bg-rf-cyan px-4 py-2.5 text-xs font-semibold text-rf-deep focus:translate-y-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
