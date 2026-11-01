# Error handling: HolidAI deltas

The error strategy (tagged errors, the closed `AppError` union, `toAppError`, logging once at the
runtime boundary, boot failures, error boundaries, toast or inline or boundary) is the kit's
`ERROR_HANDLING.md` (in the plugin's `docs/`, and on
[GitHub](https://github.com/timothyrusso/agentic-kit/blob/main/ERROR_HANDLING.md)). Read it first.
This file holds only what HolidAI adds; where the two disagree, this file wins. The departures
from the kit's logging rule are listed under Exceptions in [ARCHITECTURE.md](ARCHITECTURE.md).

## The union

`AppErrorRegistry` (`features/core/error/appError.ts`) has three entries:

| Key | Members | Declared in |
| --- | --- | --- |
| `core` | the kit's `UnexpectedError` and `ConfigError`, `ConfigMissing`, `NetworkFailure`, `Unauthorized`, `NotFound`, `StorageFailure`, `ImageFetchFailed` | `core/error/domain/errors/CoreErrors.ts` |
| `ai` | `GeminiSearchError`, `GeminiExtractionError` (`GenerationFailed`), each with a `transient` flag the retry reads | `ai/domain/errors/AiErrors.ts` |
| `user` | `TokensExhausted` | `user/domain/errors/UserErrors.ts` |

- `domain/` files import `AppErrorBase` and `toAppError` from `@/features/core/error` (whose
  `kit.ts` re-exports them), because `domain-pure-except-effect` keeps
  `@timothyrusso/effect-core` out of `domain/`.
- The two generation errors share `ERRORS.GENERATION`: the user sees one message, Sentry sees two
  tags. The kit's `UnexpectedError` maps to `ERRORS.GENERIC`.
- Convex mutations fail only with `UnexpectedError` (see the Convex boundary in
  [ARCHITECTURE.md](ARCHITECTURE.md)).

## Logging

- `LoggerLive` is `ConsoleLogger` in development and `SentryLoggerLive` in release builds, which
  sends `error` to Sentry's `captureException` and drops `warn`, `info` and `debug`. A typed
  failure therefore never reaches Sentry; a defect does.
- A boot failure is reported with `reportBootFailure` from `core/sentry`, tagged `phase: boot`.

## Boundaries and boot

- `bootRuntime()` in `core/runtime` boots the runtime, then reads the config and the language;
  `app/_layout.tsx` builds the Convex client and mounts Clerk only after it resolves. On a
  rejection it reports the error (a `ConfigError` names the missing key) and renders
  `RootAppCrashView`, which shows the generic message and whose retry reloads the app.
- Root: `RootAppCrashView`.
- Route: `app/(main)/(authenticated)/_layout.tsx` exports `ErrorBoundary`, rendering
  `GenericCrashView` with a retry and a way back home. It covers every signed-in screen, trip
  generation included.
- Both crash views come from `core/error/pages.ts`.

## Trip generation

A failed generation or save shows the error toast from its facade (`useGenerateTrip`,
`useSaveTrip`) and the page goes home. Running out of tokens is checked before generating and
shown as a `TokensExhausted` toast by `GenerateTripPage.logic.ts` (Exceptions in
[ARCHITECTURE.md](ARCHITECTURE.md)).
