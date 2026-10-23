# Speechify for OpenClaw

Give [OpenClaw](https://openclaw.ai) a Speechify voice.

This plugin adds Speechify as a text-to-speech provider. Once it is on,
OpenClaw speaks its replies with Speechify's Simba models: as voice notes on
Telegram, WhatsApp, Matrix and Feishu, as audio attachments everywhere else,
in Talk mode, in Discord voice, and on phone calls through Voice Call.

- **One request per reply.** Audio streams from `POST /v1/audio/stream`, so
  Discord voice starts playing before the clip is finished.
- **Voice bubbles that just work.** Voice notes are Ogg Opus, which Telegram
  and WhatsApp play inline.
- **Telephony ready.** Raw 16-bit PCM at 24 kHz for Voice Call.
- **Every voice your key can use**, including your own cloned voices, with
  the models that render each one listed in the picker.

## Install

You need a Speechify API key. Create one at
[console.sws.speechify.com](https://console.sws.speechify.com/?utm_source=github&utm_medium=readme&utm_campaign=openclaw).

```bash
openclaw plugins install clawhub:@speechify/openclaw-speech
```

Then set the key, either in the environment or in `openclaw.json`:

```bash
export SPEECHIFY_API_KEY="sk_..."
```

```json5
{
  tts: {
    auto: "always",
    provider: "speechify",
    providers: {
      speechify: {
        apiKey: "${SPEECHIFY_API_KEY}",
        speakerVoiceId: "geffen_32",
        model: "simba-3.5",
      },
    },
  },
}
```

Try it from any chat with `/tts audio Hello from Speechify`.

## Configuration

All keys live under `tts.providers.speechify`.

| Key              | Default                    | Notes                                                                                   |
| ---------------- | -------------------------- | --------------------------------------------------------------------------------------- |
| `apiKey`         | `SPEECHIFY_API_KEY`        | Supports `${ENV}` and secret references.                                                |
| `speakerVoiceId` | `geffen_32`                | Any voice id from the catalog. `voiceId` is accepted as an alias.                       |
| `model`          | `simba-3.5`                | Passed through to the API, so new models work the day they ship. `modelId` is an alias. |
| `language`       | unset                      | Optional locale such as `pt-BR`. On `simba-3.5` the voice's own locale applies when omitted. |
| `baseUrl`        | `https://api.speechify.ai` | HTTPS on a Speechify API host only.                                                     |

The same keys work under `talk.providers.speechify` for Talk mode.

### Models

| Model                | Use                                                                                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `simba-3.5`          | Default, and the model Speechify recommends. 48 languages on one id; every catalog voice, cloned voices included, speaks all of them. Set `language` to choose; without it the voice's own locale decides. |
| `simba-3.2`          | English only, with the lowest time to first byte. Pairs with the `_32` voices such as `geffen_32`. A non-English voice returns HTTP 400.                                        |
| `simba-3.0`          | German, Spanish, French, Italian and Portuguese, plus English. The API's own default when `model` is omitted.                                                                   |
| `simba-english`      | Legacy. New workspaces get HTTP 400 `model_retired`; from 2026-11-21 the id is served by `simba-3.2`.                                                                           |
| `simba-multilingual` | Legacy. New workspaces get HTTP 400 `model_retired`; from 2026-11-21 the id is served by `simba-3.5`.                                                                           |

### Per-message overrides

When the speech policy allows it, switch voice, model or language inline:

```text
/voice:harper_32
/model:simba-3.2
/lang:pt-BR
```

### Output by surface

| Target         | Format   | Sample rate |
| -------------- | -------- | ----------- |
| Standard audio | MP3      | 24 kHz      |
| Voice note     | Ogg Opus | 48 kHz      |
| Telephony      | PCM s16  | 24 kHz      |

## Limits

- Up to 20,000 characters of spoken text per request; SSML tags do not count.
  Set `tts.maxTextLength` at or below that.
- Speechify bills per character. HTTP 402 means the workspace's allowance or
  spend cap is exhausted. HTTP 429 means the per-minute request limit was hit.

## Attribution

Every request carries `Speechify-Caller: openclaw` and
`Speechify-Caller-Version` set to this package's version, following Speechify's
[integration guide](https://docs.speechify.ai/build/guides/integrations/build-an-integration).
It lets Speechify see this plugin's traffic as one integration and warn before
a model retirement or default change reaches OpenClaw users. It is attribution
only: it never changes limits, pricing or access, and the request still
authenticates as the workspace whose key it carries.

## Development

```bash
pnpm install
pnpm test                 # unit tests, mocked API
pnpm typecheck
pnpm build                # dist/ for the published package
pnpm validate             # ClawHub plugin inspector
SPEECHIFY_API_KEY=sk_... pnpm test:live   # hits the real API
```

The source layout follows OpenClaw's bundled speech plugins (Gradium, Inworld,
Fish Audio) so the code can move into the OpenClaw repository unchanged if
that door opens.

## Links

- [Speechify API docs](https://docs.sws.speechify.com/?utm_source=github&utm_medium=readme&utm_campaign=openclaw)
- [Speechify text-to-speech API](https://speechify.com/text-to-speech-api/?utm_source=github&utm_medium=readme&utm_campaign=openclaw)
- [OpenClaw text-to-speech docs](https://docs.openclaw.ai/tools/tts)
