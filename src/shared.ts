import { createRequire } from "node:module";

const DEFAULT_SPEECHIFY_BASE_URL = "https://api.speechify.ai";
/** Hosts the API key may be sent to; the second is the legacy name of the same service. */
export const SPEECHIFY_API_HOSTNAMES = ["api.speechify.ai", "api.sws.speechify.com"] as const;
export const DEFAULT_SPEECHIFY_VOICE_ID = "geffen_32";
export const DEFAULT_SPEECHIFY_MODEL = "simba-3.5";
/**
 * Known models for pickers, recommended first. The API validates the model, so
 * newer ids still pass through. The two legacy ids are retired for new
 * workspaces and are served by simba-3.2 and simba-3.5 from 2026-11-21.
 */
export const SPEECHIFY_MODELS = [
  "simba-3.5",
  "simba-3.2",
  "simba-3.0",
  "simba-english",
  "simba-multilingual",
] as const;
/** The streaming endpoint rejects longer inputs with HTTP 400. SSML tags do not count. */
export const SPEECHIFY_MAX_INPUT_CHARS = 20_000;

export function normalizeSpeechifyBaseUrl(baseUrl?: string): string {
  const raw = baseUrl?.trim() || DEFAULT_SPEECHIFY_BASE_URL;
  const url = URL.parse(raw);
  if (!url) {
    throw new Error("Speechify baseUrl must be a valid https URL");
  }

  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";

  if (url.protocol !== "https:") {
    throw new Error("Speechify baseUrl must use https");
  }
  const hostname = url.hostname.toLowerCase();
  if (!SPEECHIFY_API_HOSTNAMES.some((allowed) => allowed === hostname)) {
    throw new Error("Speechify baseUrl must target api.speechify.ai");
  }

  return url.toString().replace(/\/+$/, "");
}

/**
 * Integration attribution, per https://docs.speechify.ai/build/guides/integrations/build-an-integration.
 * The slug names the installed thing and never changes; the version rides in its
 * own header. Attribution only: it never affects limits, pricing or access.
 */
export const SPEECHIFY_CALLER = "openclaw";
export const SPEECHIFY_CALLER_VERSION: string = readPackageVersion();

// src/shared.ts sits one level below the package root; the built copy at
// dist/src/shared.js sits two levels below. Try both.
function readPackageVersion(): string {
  const require = createRequire(import.meta.url);
  for (const candidate of ["../package.json", "../../package.json"]) {
    try {
      const version = (require(candidate) as { version?: unknown }).version;
      if (typeof version === "string" && version.trim()) {
        return version;
      }
    } catch {
      // Try the next layout.
    }
  }
  return "0.0.0";
}

export function speechifyRequestHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Speechify-Caller": SPEECHIFY_CALLER,
    "Speechify-Caller-Version": SPEECHIFY_CALLER_VERSION,
  };
}
