// The published `openclaw` package exports these plugin-sdk subpaths at runtime
// but ships no declaration files for them (checked against openclaw@2026.10.6).
// The shapes below are copied from the OpenClaw repository:
//   src/tts/provider-types.ts, src/plugins/capability-provider.types.ts,
//   src/agents/provider-http-errors.ts, src/media/configured-max-bytes.ts.
// Remove a block here as soon as the package starts shipping its own .d.ts.

declare module "openclaw/plugin-sdk/speech" {
  export type SpeechProviderId = string;
  export type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";
  export type SpeechProviderConfig = Record<string, unknown>;
  export type SpeechProviderOverrides = Record<string, unknown>;
  export type OpenClawConfig = Record<string, unknown>;
  export type TalkProviderConfig = Record<string, unknown>;

  export type SpeechModelOverridePolicy = {
    enabled: boolean;
    allowProvider: boolean;
    allowText: boolean;
    allowVoice: boolean;
    allowModelId: boolean;
    allowVoiceSettings: boolean;
    allowNormalization: boolean;
    allowSeed: boolean;
  };

  export type SpeechProviderConfiguredContext = {
    cfg?: OpenClawConfig;
    providerConfig: SpeechProviderConfig;
    timeoutMs: number;
  };

  export type SpeechSynthesisRequest = {
    text: string;
    cfg: OpenClawConfig;
    providerConfig: SpeechProviderConfig;
    target: SpeechSynthesisTarget;
    providerOverrides?: SpeechProviderOverrides;
    timeoutMs: number;
  };

  export type SpeechSynthesisResult = {
    audioBuffer: Buffer;
    outputFormat: string;
    fileExtension: string;
    voiceCompatible: boolean;
  };

  export type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;

  export type SpeechSynthesisStreamResult = Omit<SpeechSynthesisResult, "audioBuffer"> & {
    audioStream: ReadableStream<Uint8Array>;
    release?: () => Promise<void>;
  };

  export type SpeechTelephonySynthesisRequest = Omit<SpeechSynthesisRequest, "target">;

  export type SpeechTelephonySynthesisResult = {
    audioBuffer: Buffer;
    outputFormat: string;
    sampleRate: number;
  };

  export type SpeechProviderPrepareSynthesisContext = SpeechSynthesisRequest & {
    persona?: Record<string, unknown>;
    personaProviderConfig?: SpeechProviderConfig;
  };

  export type SpeechProviderPreparedSynthesis = {
    text?: string;
    providerConfig?: SpeechProviderConfig;
    providerOverrides?: SpeechProviderOverrides;
  };

  export type SpeechVoiceOption = {
    id: string;
    name?: string;
    category?: string;
    description?: string;
    locale?: string;
    gender?: string;
    personalities?: string[];
  };

  export type SpeechListVoicesRequest = {
    cfg?: OpenClawConfig;
    providerConfig?: SpeechProviderConfig;
    apiKey?: string;
    baseUrl?: string;
    timeoutMs?: number;
  };

  export type SpeechProviderResolveConfigContext = {
    cfg: OpenClawConfig;
    rawConfig: Record<string, unknown>;
    timeoutMs: number;
  };

  export type SpeechDirectiveTokenParseContext = {
    key: string;
    value: string;
    policy: SpeechModelOverridePolicy;
    selectedProvider?: SpeechProviderId;
    providerConfig?: SpeechProviderConfig;
    currentOverrides?: SpeechProviderOverrides;
  };

  export type SpeechDirectiveTokenParseResult = {
    handled: boolean;
    overrides?: SpeechProviderOverrides;
    warnings?: string[];
  };

  export type SpeechProviderResolveTalkConfigContext = {
    cfg: OpenClawConfig;
    baseTtsConfig: Record<string, unknown>;
    talkProviderConfig: TalkProviderConfig;
    timeoutMs: number;
  };

  export type SpeechProviderResolveTalkOverridesContext = {
    talkProviderConfig: TalkProviderConfig;
    params: Record<string, unknown>;
  };

  export type SpeechProviderPlugin = {
    id: SpeechProviderId;
    label: string;
    aliases?: string[];
    autoSelectOrder?: number;
    defaultTimeoutMs?: number;
    defaultModel?: string;
    models?: readonly string[];
    voices?: readonly string[];
    resolveConfig?: (ctx: SpeechProviderResolveConfigContext) => SpeechProviderConfig;
    parseDirectiveToken?: (
      ctx: SpeechDirectiveTokenParseContext,
    ) => SpeechDirectiveTokenParseResult;
    resolveTalkConfig?: (ctx: SpeechProviderResolveTalkConfigContext) => SpeechProviderConfig;
    resolveTalkOverrides?: (
      ctx: SpeechProviderResolveTalkOverridesContext,
    ) => SpeechProviderConfig | undefined;
    prepareSynthesis?: (
      ctx: SpeechProviderPrepareSynthesisContext,
    ) =>
      | SpeechProviderPreparedSynthesis
      | undefined
      | Promise<SpeechProviderPreparedSynthesis | undefined>;
    /** @deprecated Use isConfiguredAsync. Final compatibility day: 2026-12-31. */
    isConfigured: (ctx: SpeechProviderConfiguredContext) => boolean;
    isConfiguredAsync?: (ctx: SpeechProviderConfiguredContext) => Promise<boolean>;
    synthesize: (req: SpeechSynthesisRequest) => Promise<SpeechSynthesisResult>;
    streamSynthesize?: (
      req: SpeechSynthesisStreamRequest,
    ) => Promise<SpeechSynthesisStreamResult>;
    synthesizeTelephony?: (
      req: SpeechTelephonySynthesisRequest,
    ) => Promise<SpeechTelephonySynthesisResult>;
    listVoices?: (req: SpeechListVoicesRequest) => Promise<SpeechVoiceOption[]>;
  };
}

declare module "openclaw/plugin-sdk/speech-provider" {
  export type { SpeechProviderPlugin } from "openclaw/plugin-sdk/speech";
  export const MAX_AUDIO_BYTES: number;
  export function resolveSpeechProviderApiKey(
    ...candidates: Array<string | undefined>
  ): string | undefined;
}

declare module "openclaw/plugin-sdk/provider-http" {
  export type ProviderResponseReadOptions = {
    maxBytes?: number;
    onOverflow?: (params: { maxBytes: number }) => Error;
    requestHeaders?: HeadersInit;
  };
  export type ProviderHttpErrorOptions = {
    signal?: AbortSignal;
    maxBodyBytes?: number;
    requestHeaders?: HeadersInit;
  };
  export function assertOkOrThrowProviderError(
    response: Response,
    label: string,
    options?: ProviderHttpErrorOptions,
  ): Promise<void>;
  export function assertProviderBinaryResponseContent(
    response: Response,
    label: string,
    kind?: string,
  ): void;
  export function readProviderBinaryResponse(
    response: Response,
    label: string,
    kind?: string,
    opts?: ProviderResponseReadOptions,
  ): Promise<Buffer>;
  export function readProviderJsonResponse<T>(
    response: Response,
    label: string,
    opts?: ProviderResponseReadOptions,
  ): Promise<T>;
}

declare module "openclaw/plugin-sdk/media-generation-runtime" {
  export function resolveGeneratedMediaMaxBytes(cfg: unknown, kind: "audio" | "image" | "video" | "music"): number;
}
