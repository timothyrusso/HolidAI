# Effect notes

Where each section of the kit's `EFFECT_PRIMER.md` (in the plugin's `docs/`) applies in HolidAI,
with the file to read as the worked example. The primer explains the idiom; this file says where
it lives here. [ARCHITECTURE.md](ARCHITECTURE.md) lists the deltas.

| Primer section | Where it applies in HolidAI | Read first |
| --- | --- | --- |
| Why Effect here | the shared core (config, logger, runtime, storage, http, images), the AI pipeline and the mutation side of the Convex repositories; Convex queries and Clerk stay hooks | `features/trip-generation/useCases/generateTrip.ts` |
| `Effect<A, E, R>` read aloud | every Tag method and use case: `AiService.search` is `Effect<string, GeminiSearchError \| ConfigMissing>` | `features/ai/domain/services/AiService.ts` |
| `Effect.gen` and `yield*` | use cases and Live Layers; `yield* new GeminiSearchError(...)` fails | `features/trips/useCases/retryImage.ts`, `features/ai/data/services/geminiAiServiceLive.ts` |
| Tagged errors and the closed union | `AppErrorBase` in each feature's `domain/errors/`, joined through `AppErrorRegistry` and mapped in `errorTagToMessageKey` | `features/ai/domain/errors/AiErrors.ts`, `features/core/error/appError.ts`, `features/core/error/mappers/errorTagToMessageKey.ts` |
| `Context.Tag` services and `Layer` | `AiService`, `ImageRepository`, `HttpClient`, `Network`, `Storage`, `Sentry`, `PerformanceTracker`, the kit's `Logger`, `AppConfig` | `features/core/images/domain/repositories/ImageRepository.ts`, `features/core/runtime/runtime.ts` |
| The runtime and the two React hooks | one `ManagedRuntime` in `core/runtime`, booted by `bootRuntime`; facades use `useEffectQuery` and `useEffectMutation` from `@timothyrusso/effect-core/react` | `features/core/images/facades/useGetImage.ts`, `features/trip-generation/facades/useGenerateTrip.ts`, `app/_layout.tsx` |
| Schema: decode, encode, brand | the app config, the AI's trip answer, stored objects (`Schema.parseJson` in `Storage`); no brands (Convex's `Id` is its own) | `features/core/config/domain/schemas/AppConfigSchema.ts`, `features/ai/domain/schemas/GeneratedTripSchema.ts`, `features/core/storage/data/services/storageLive.ts` |
| Retry and timeout | the AI steps and the HTTP client, each with its own `Schedule`; TanStack never re-runs an app error | `features/trip-generation/useCases/generateTrip.ts`, `features/core/http/data/services/httpClientLive.ts`, `features/core/query/queryClient.ts` |
| Testing with Layers | `itEffect` with fake Layers for use cases and Live Layers, `advanceClock` for the retry schedules, `renderWithLayer` for facades and ViewModels | `features/trip-generation/useCases/__tests__/generateTrip.test.ts`, `features/trip-generation/facades/__tests__/useGenerateTrip.test.ts` |
| Ten mistakes agents make | all of them apply; the ones HolidAI has paid for are in `.claude/CLAUDE.md` | |
| Cheat sheet | as is | |

## HolidAI specifics

- **Convex mutation wrapping.** A Convex mutation becomes an Effect inside its hook repository,
  once: `run` in `features/trips/data/repositories/useTripRepository.ts` wraps every trip
  mutation as `Effect.tryPromise({ try: () => mutate(), catch: cause => toAppError(cause) })`, and
  `useUserRepository.decrementTokens` does the same. The facade passes the method to
  `useEffectMutation` (`useToggleFavoriteTrip`), or hands it to a use case that ends in the write
  (`useSaveTrip` gives `addTrip` to `saveTrip`; the image retries give `updateCoverImage` and the
  rest to `retryImage.ts`). The optimistic update stays on the Convex mutation.
- **Clerk** has no Effect. Its hooks are read in `useUserRepository` and `useSessionChanges`; a
  use case that needs the user gets the id as an argument from its facade (`useSaveTrip`).
- **The AI retry schedule.** `RETRY_SCHEDULE` in `generateTrip.ts` is
  `Schedule.exponential('2 seconds')` composed with `Schedule.recurs(2)`: a transient failure is
  tried twice more, 2 then 4 seconds later. `Effect.retry` runs it `while: isTransient`, so only an
  error whose `transient` flag is set retries: the AI SDK's `APICallError.isRetryable` (a 429, a
  5xx) or React Native's bare `TypeError('Network request failed')`. Each attempt has its own
  timeout (`SEARCH_TIMEOUT` 1 minute, `EXTRACT_TIMEOUT` 4 minutes) that fails non-transient. The
  SDK's own retries are off (`maxRetries: 0`), so the schedule is the only one. The AI calls take
  the fiber's `AbortSignal` (`try: signal => generateText({ ..., abortSignal: signal })`), so a
  timeout or an unmount cancels the request.
- **The Sentry Layer.** `Sentry` (`features/core/sentry`) is one Tag with `captureException` and
  `withSpan`, provided by `SentryLive` over the SDK. The `Logger` and `PerformanceTracker` Layers
  are built on it (`SentryLoggerLive`, `SentryPerformanceTrackerLive`) and swapped for
  `ConsoleLogger` and a no-op in development by `__DEV__` in their `di/layer.ts`. `initSentry`,
  `wrap` and `reportBootFailure` stay plain functions: they run before, or without, the runtime.
- **A client built on first use.** `GeminiAiServiceLive` keeps the Gemini client in
  `Effect.cached`, so the key is read when the first generation runs and a missing key fails that
  generation with `ConfigMissing`, not the boot.
- **Late config.** `bootRuntime` reads `AppConfig` after `runtime.boot()` because Convex and Clerk
  are mounted from it above the runtime provider (Exceptions in [ARCHITECTURE.md](ARCHITECTURE.md)).
