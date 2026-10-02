# Error handling: HolidAI deltas

The generic error strategy (nothing throws across a layer, one class per failure mode, the UI
never reads `error.message`, error boundaries, toast for mutations and inline for forms) is the
kit's [ERROR_HANDLING.md](https://github.com/timothyrusso/agentic-kit/blob/main/ERROR_HANDLING.md).
Read it first. This file holds what HolidAI does differently; where the two disagree, this file
wins.

**Until Night 4** (#504) HolidAI has no Effect: failures are `Result<T>` values, errors are
`BaseError` subclasses with an `ErrorCode`, and the logging point is the use case, because there
is no runtime boundary to log at.

## Kit concept to HolidAI today

| Kit | HolidAI until Night 4 | Where |
| --- | --- | --- |
| `Effect<A, E, R>` | `Result<T>` (`Promise<Result<T>>` when async) with `ok()` / `fail()` | `core/error/domain/entities/Result.ts` |
| `Data.TaggedError` via `AppErrorBase` | A `BaseError` subclass carrying an `ErrorCode` | `<feature>/domain/entities/errors/` |
| The closed `AppError` union | The `ErrorCode` const object | `core/error/domain/entities/ErrorCode.ts` |
| `errorTagToMessageKey` (exhaustive) | `errorCodeToMessageKey` (partial; missing codes fall back to `ERRORS.GENERIC`) | `core/error/mappers/` |
| `toAppError(cause)` | `ensureError(value)` in every `catch` | `core/error/domain/utils/ensureError.ts` |
| `Logger` at the runtime boundary | Injected `ILogger`, called in `useCases/` | `core/error/di/` |
| `useAppErrorMessage(error)` | `useErrorMessage(error)` | `core/error/hooks/` |
| `runtime.boot()` and the fatal screen | None: DI resolves at module load | |

## Types

```ts
type Result<T> = { success: true; data: T } | { success: false; error: BaseError };
const ok = <T>(data: T): Result<T> => ({ success: true, data });
const fail = (error: BaseError): Result<never> => ({ success: false, error });

class BaseError extends Error {
  constructor(message: string, code: ErrorCode = ErrorCode.UnexpectedError,
              options?: { context?: Record<string, unknown>; cause?: Error });
}
```

- `ErrorCode` values: `UnexpectedError`, `NotFound`, `Unauthorized`, `NetworkFailure`,
  `GenerationFailed`, `Unknown`, `AuthSignInFailed`, `AuthSignUpFailed`,
  `AuthVerificationFailed`, `AuthPasswordResetFailed`, `TokensExhausted`. Add a code only when the
  UI must treat the failure differently from every existing one.
- `UnexpectedError` is for anything caught that was not anticipated; `Unknown` only for a named
  failure state that has no final code yet.
- `ensureError` returns a `BaseError` as is, wraps an `Error` as `UnexpectedError` with it as
  `cause`, and turns anything else into an `UnexpectedError` (a string becomes the message, other
  values go in `context.raw`).
- A feature error extends `BaseError`, never `Error`, and reuses an existing code when the UI
  shows the same message: `GeminiSearchError` and `GeminiExtractionError` in `ai` both use
  `GenerationFailed`, so the user sees one message and Sentry sees two names. The constructor
  message is for logs only.

## Layer by layer

| Layer | HolidAI until Night 4 |
| --- | --- |
| `data/repositories/` (class and hook) | Catch, `fail(ensureError(err))`, return `Result<T>`. Hook repositories' reactive reads return `undefined` while loading, no `Result` |
| `useCases/` | Propagate a failed `Result` unchanged (`if (!result.success) return result;`); catch, `logger.error(error, context)`, return `fail(error)`; never re-throw. **The one logging point** |
| `facades/` | Branch on `result.success`; the toast is `showErrorToast(error)` from `core/toast`. No `try/catch` around repositories or use cases: their contract is that nothing escapes |
| `.logic.ts`, `.tsx` | As in the kit, with `useErrorMessage` for text |

## Logging

`ILogger` (`log`, `error(error, context)`, `warning`, `info`, `debug`) is bound in
`core/error/di/config.ts`: `BasicLogger` in development, `SentryLogger` in release builds.
`SentryLogger` forwards `error()` to Sentry's `captureException` through `ISentryErrorClient`
and drops the other levels. Pass a `BaseError` to `logger.error()`, never a raw `Error`.

Outside use cases, three ViewModels log because no use case saw the error: the two crash views
(the render error a boundary caught) and the design-system `PlacesAutocomplete` (its library's
failure callback).

Convex functions run on the server without the app's logger; `convex/http.ts` uses
`console.error` behind a `biome-ignore`.

## Boundaries in HolidAI

- Root: `app/_layout.tsx` exports `ErrorBoundary`, rendering `RootAppCrashView`, whose retry
  reloads the app (`reloadAppAsync`).
- Route: `app/(main)/(authenticated)/_layout.tsx` exports `ErrorBoundary`, rendering
  `GenericCrashView` with a retry and a way back to the home page. It covers every signed-in
  screen, including trip generation.
- Both crash views come from `core/error/pages.ts`.
