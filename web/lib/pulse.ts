import "server-only";

import { PulseClient } from "@reflector/contract-client";
import { Keypair, Networks } from "@stellar/stellar-sdk";

/** Mainnet CEX/DEX Pulse — BTC, ETH, … as Asset::Other, quoted in USD */
const MAINNET_CEX_DEX =
  "CAFJZQWSED6YAWZU3GWRTOCNPPCGBN32L7QV43XX5LZLFTK6JLN34DLN";

const DEFAULT_RPC = "https://rpc.lightsail.network/";

export type PulseTick = {
  asset: string;
  whole: string;
  fraction: string;
  decimals: number;
  resolution: number;
  timestamp: number;
  ageSec: number;
  stale: boolean;
  baseLabel: string;
};

function formatParts(value: bigint, decimals: number): { whole: string; fraction: string } {
  const scale = BigInt(10) ** BigInt(decimals);
  const abs = value < BigInt(0) ? -value : value;
  const whole = abs / scale;
  const fraction = abs % scale;
  const wholeStr = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fracStr =
    decimals === 0 ? "" : fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  return {
    whole: value < BigInt(0) ? `-${wholeStr}` : wholeStr,
    fraction: fracStr,
  };
}

function baseLabel(base: unknown): string {
  if (!base || typeof base !== "object") return "USD";
  const tagged = base as { tag?: string; values?: unknown[] };
  if (tagged.tag === "Other" && typeof tagged.values?.[0] === "string") {
    return tagged.values[0];
  }
  return "USD";
}

export async function getBtcTick(): Promise<PulseTick | null> {
  const client = new PulseClient({
    publicKey: Keypair.random().publicKey(),
    rpcUrl: process.env.REFLECTOR_RPC_URL?.trim() || DEFAULT_RPC,
    contractId:
      process.env.REFLECTOR_PULSE_CONTRACT_ID?.trim() || MAINNET_CEX_DEX,
    networkPassphrase:
      process.env.REFLECTOR_NETWORK_PASSPHRASE?.trim() || Networks.PUBLIC,
  });

  try {
    const [quote, decimals, resolution, base] = await Promise.all([
      client.lastPrice("BTC"),
      client.decimals(),
      client.resolution(),
      client.base(),
    ]);

    if (!quote) return null;

    const timestamp = Number(quote.timestamp);
    const now = Math.floor(Date.now() / 1000);
    const ageSec = Math.max(0, now - timestamp);
    const { whole, fraction } = formatParts(quote.price, decimals);

    return {
      asset: "BTC",
      whole,
      fraction,
      decimals,
      resolution,
      timestamp,
      ageSec,
      stale: ageSec > resolution * 2,
      baseLabel: baseLabel(base),
    };
  } catch {
    return null;
  }
}
