# Error Handling

This document is the authoritative reference for error handling in the project. Every layer of the architecture has a defined role. Read this before writing any code that can fail.

---

## Philosophy

**Errors are values, not surprises.** Functions that can fail return a `Result<T>` instead of throwing. This makes the failure path visible in the type signature, forces callers to handle it, and prevents unexpected crashes from propagating unchecked across layer boundaries.

**No layer throws across a boundary.** Use cases always return `Result<T>` — they never throw. The only place a `throw` is acceptable is inside a facade, and only for unrecoverable errors that should terminate the current screen by triggering the `ErrorBoundary`. For all other failures, facades handle the `Result<T>` directly (toast or inline state).

**Logging happens once, at the layer where the error is first caught.** Do not log the same error multiple times as it propagates. The use case logs it; the facade does not log it again.

**Never use `console.error` or `console.log` directly.** Always use the injected `ILogger`. This ensures production errors reach Sentry and development errors are readable in the terminal.

---

## Core Types

### `Result<T>`

A discriminated union that represents either a successful value or a `BaseError`. It is a pure domain type — no external dependencies.

```ts
export type Result<T> =
  | { success: true;  data: T }
  | { success: false; error: BaseError };
```

**Factory helpers** — defined alongside `Result<T>` in the same file:

```ts
export const ok   = <T>(data: T): Result<T>         => ({ success: true,  data  });
export const fail = (error: BaseError): Result<never> => ({ success: false, error });
```

`ok(data)` and `fail(error)` reduce boilerplate at every call site. `fail` returns `Result<never>`, which is assignable to any `Result<T>` — so a function can return `fail(error)` regardless of its `T`.

### `BaseError`

Extends the native `Error` with a typed code, optional context, and an optional cause chain. Always use `BaseError` (or a subclass) — never pass raw `Error` to the logger.

```ts
export class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode = ErrorCode.UnexpectedError,
    options?: { context?: Record<string, unknown>; cause?: Error },
  ) {
    super(message, { cause: options?.cause });
    this.context = options?.context;
  }

  public readonly context?: Record<string, unknown>;
}
```

### `ErrorCode`

A `const` object (never an `enum`) of typed string codes. Add new codes here when a failure mode is domain-specific and needs to be handled differently by the UI.

```ts
export const ErrorCode = {
  UnexpectedError:  'UnexpectedError',
  NotFound:         'NotFound',
  Unauthorized:     'Unauthorized',
  NetworkFailure:   'NetworkFailure',
  GenerationFailed: 'GenerationFailed',
  Unknown:          'Unknown',
  ...
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
```

Do not use `Unknown` for genuinely unexpected errors caught in a `catch` block — use `UnexpectedError` for those. `Unknown` is only for explicit, named failure states that have not yet been assigned a final code.

### `ensureError`

Converts any unknown caught value into a `BaseError`. Use this in every `catch` block — never cast with `error as Error`.

```ts
export const ensureError = (value: unknown): BaseError => {
  if (value instanceof BaseError) return value;
  if (value instanceof Error)
    return new BaseError(value.message, ErrorCode.UnexpectedError, { cause: value });
  return new BaseError(String(value), ErrorCode.UnexpectedError);
};
```

---

## Feature-Specific Errors

When a feature has failure modes that benefit from a named type — for logging clarity, programmatic discrimination, or consistent message phrasing — create a dedicated error class in the feature's `domain/entities/errors/` folder.

### Convention

```ts
// features/<name>/domain/entities/errors/XxxError.ts
import { BaseError, ErrorCode } from '@/features/core/error';

export class XxxError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.SomeCode, { cause });
  }
}
```

**Rules:**
- Extend `BaseError` — never extend the native `Error` directly.
- The constructor `message` is for **logging and debugging only** — the UI never reads it. User-facing text always goes through `useErrorMessage` → `errorCodeToMessageKey` → localized string.
- Use an **existing `ErrorCode`** when the failure category is already represented (e.g. `GenerationFailed` for any AI pipeline failure). Add a new code to `ErrorCode` only when the UI needs to handle it differently from all existing codes.
- Pass `cause` when wrapping a lower-level error — this preserves the full stack trace chain.

### When to create a feature-specific error class

- The failure has a meaningful name that aids debugging (e.g. `GeminiSearchError` vs a generic `BaseError`)
- The same failure mode appears in multiple places within the feature and a shared class avoids duplication
- The caller may need type discrimination (`error instanceof GeminiSearchError`)

### When NOT to create one

- The failure is a one-off and a plain `new BaseError(message, ErrorCode.UnexpectedError)` is sufficient
- The error is only ever logged and never discriminated on

### Example — `features/ai`

```ts
// features/ai/domain/entities/errors/GeminiSearchError.ts
export class GeminiSearchError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.GenerationFailed, { cause });
  }
}

// features/ai/domain/entities/errors/GeminiExtractionError.ts
export class GeminiExtractionError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.GenerationFailed, { cause });
  }
}
```

Both use `ErrorCode.GenerationFailed` — the UI shows the same localized message for both. The distinct class names make logs and Sentry reports immediately actionable.

The `message` parameter is for **logging and debugging only** — pass a developer-facing description at the call site. Use a dynamic message when additional context is available (e.g. a Zod validation error message), and a static string when the failure mode is fixed.

---

## Layer-by-Layer Rules

### `data/repositories/`

Repositories interact with external systems (Convex, HTTP APIs). They catch low-level failures and return `Result<T>`.

**Hook-based repositories** (Convex): mutations return `Result<T>`. Queries surface loading state via `undefined` — no `Result` needed for reactive data.

```ts
export const useTripRepository = (): ITripRepository => {
  const trips = useQuery(api.trips.getAll);           // called at hook top level — undefined while loading
  const createMutation = useMutation(api.trips.create);

  return {
    getUserTrips: () => trips,

    createTrip: async (data): Promise<Result<void>> => {
      try {
        await createMutation(data);
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
```

**Class-based repositories** (HTTP): wrap every request in try/catch and return `Result<T>`.

```ts 
async getImage(placeName: string, urlType: UrlType): Promise<Result<string>> {
  try {
    const data = await this.http.get('/search/photos', { query: placeName }).json();
    return ok(data.results[0]?.urls[urlType] ?? noImage);
  } catch (err) {
    return fail(ensureError(err));
  }
}
```

**Rules:**
- Never log in repositories — the use case will log.
- Never throw across the repository boundary — always return `Result`.
- Never pass raw `Error` values — always wrap with `ensureError`.

---

### `useCases/`

Use cases receive results from repositories, apply business logic, log on failure, and return `Result<T>`.

```ts
import { buildPromptUseCase } from '@/features/ai';

export class GenerateTripUseCase {
  constructor(
    private aiService: IAiService,
    private logger: ILogger,
  ) {}

  async execute(formData: TripFormData): Promise<Result<GeneratedTrip>> {
    try {
      const prompt = buildPromptUseCase.execute(formData);
      const trip = await this.aiService.generateObject(prompt, generateTripSchema, AiModel.Default);
      return ok(trip);
    } catch (err) {
      const error = ensureError(err);
      this.logger.error(error, { context: 'GenerateTripUseCase', formData });
      return fail(error);
    }
  }
}
```

**Rules:**
- **Log here** — use cases are the single logging point for each failure.
- Return `fail(error)` — never re-throw after logging.
- Propagate errors from repositories: `if (!result.success) return result;` — do not re-wrap.

---

### `facades/`

Facades coordinate repositories and use cases. They receive `Result<T>` and decide how to surface failure to the UI — either as an error state, a toast, or by letting it propagate to an error boundary.

```ts
import { generateTripUseCase } from '@/features/trips/di/resolve';
import { useToast } from '@/features/core/toast';

export const useGenerateTrip = () => {
  const repo = useTripRepository();
  // showErrorToast(error: BaseError) — translates internally, safe to call in callbacks
  const { showErrorToast } = useToast();

  const generate = async (formData: TripFormData) => {
    const result = await generateTripUseCase.execute(formData);

    if (!result.success) {
      showErrorToast(result.error);
      return;
    }

    const saveResult = await repo.createTrip(result.data);
    if (!saveResult.success) {
      showErrorToast(saveResult.error);
    }
  };

  return { generate };
};
```

**Rules:**
- Do not log — the use case already logged.
- Decide here: toast, error state, or throw for the error boundary.
- Throw to the boundary only for unrecoverable errors that should terminate the current screen.
- Never call `console.error`.
- Do not wrap repository or use case calls in `try/catch` or `try/finally` — the repository contract guarantees no exceptions escape its boundary. If a repository violates this contract, fix the repository, not the facade.

---

### `.logic.ts` (ViewModel)

The ViewModel consumes facades and maps failures to view state — loading, error message, empty state.

```ts
export const useGenerateTripPageLogic = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { generate } = useGenerateTrip();

  const handleGenerate = async (formData: TripFormData) => {
    setErrorMessage(null);
    await generate(formData);
    // facade already handles the error display (toast/state)
  };

  return { handleGenerate, errorMessage };
};
```

**Rules:**
- Never import repositories or use cases directly for error-producing operations — always go through a facade.
- Never use `try/catch` in `.logic.ts` — if needed, that logic belongs in a facade.
- Never call `console.error`.

---

### `.tsx` (View)

Views render error state from the ViewModel. They never handle raw errors.

```tsx
// ✅ Correct — renders error state from ViewModel
export const GenerateTripPage = () => {
  const { handleGenerate, errorMessage } = useGenerateTripPageLogic();

  return (
    <View>
      {errorMessage && <ErrorText message={errorMessage} />}
      <GenerateButton onPress={handleGenerate} />
    </View>
  );
};
```

---

## Logging

### The logger interface

All use cases and services depend on this interface — never on a concrete implementation.

```ts
export interface ILogger {
  log(message: string, ...args: unknown[]): void;
  error(error: Error, context?: Record<string, unknown>): void;
  warning(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
```

### Implementations

| Environment | Implementation |
|---|---|
| Development | `BasicLogger` |
| Production | `SentryLogger` |

The DI config selects the right implementation at startup:

```ts
if (__DEV__) {
  container.registerSingleton<ILogger>(ERROR_TYPES.Logger, BasicLogger);
} else {
  container.registerSingleton<ILogger>(ERROR_TYPES.Logger, SentryLogger);
}
```

**`SentryLogger`** wraps Sentry's `captureException` and enriches errors with breadcrumbs.

```ts
export class SentryLogger implements ILogger {
  error(error: Error, context?: Record<string, unknown>): void {
    sentryClient.captureException(error, { extra: context });
  }
  // ...
}
```

### Rules

- **Always inject `ILogger`** — never import `BasicLogger` or `SentryLogger` directly.
- **Always pass a `BaseError`** to `logger.error()` — never a raw `Error` or cast `error as Error`.
- **Never use `console.error`** — not in use cases, not in facades, not anywhere.

---

## Error Boundaries

### Strategy

Two levels of error boundaries — **root** (crash recovery) and **route-level** (graceful degradation):

| Boundary | Where | Catches | Shows |
|---|---|---|---|
| Root | `app/_layout.tsx` | Any uncaught render error across the entire app | Full-screen error + restart button |
| Route-level | Individual route files | Errors scoped to that route's tree | Inline fallback, preserves the rest of the app |

### Expo Router `ErrorBoundary`

Expo Router provides first-class support via a named export. No custom React class component needed in most cases.

```tsx
// app/_layout.tsx — root boundary
import { ErrorBoundaryProps } from 'expo-router';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <AppCrashView error={error} onRetry={retry} />;
}

export default function RootLayout() { ... }
```

```tsx
// app/(authenticated)/generate-trip.tsx — route-level boundary
import { ErrorBoundaryProps } from 'expo-router';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return <FeatureErrorView message={error.message} onRetry={retry} />;
}

export default function GenerateTripRoute() {
  return <GenerateTripPage />;
}
```

### When to add a route-level boundary

Add a route-level `ErrorBoundary` when:
- The feature performs a high-risk operation (AI generation, external API call) and its failure should not crash the tab bar or other screens.
- The route can meaningfully offer a retry without restarting the app.

Do **not** add one when:
- The error is already handled at the facade level (toast / inline state).
- The route is simple and the root boundary is sufficient.

---

## Error-to-UI Mapping

### `useErrorMessage`

A utility hook that translates a `BaseError` into a localized user-facing string. The view never renders `error.message` directly — it always goes through this hook.

```ts
export const useErrorMessage = (error: BaseError | null): string | null => {
  const { t } = useTranslation();
  if (!error) return null;

  const messageKey = errorCodeToMessageKey[error.code] ?? 'ERRORS.GENERIC';
  return t(messageKey);
};
```

The mapping object lives in `mappers/` — it translates domain `ErrorCode` values into i18n key strings, which is a presentation concern and cannot live in `domain/`:

```ts
export const errorCodeToMessageKey: Partial<Record<ErrorCode, string>> = {
  [ErrorCode.NetworkFailure]:    'ERRORS.NETWORK',
  [ErrorCode.Unauthorized]:      'ERRORS.UNAUTHORIZED',
  [ErrorCode.GenerationFailed]: 'ERRORS.GENERATION',
  [ErrorCode.NotFound]:          'ERRORS.NOT_FOUND',
};
// Unmapped codes fall back to 'ERRORS.GENERIC'
```

### Toast vs inline error state

| Scenario | Pattern |
|---|---|
| Background mutation failure (save, toggle) | Toast — non-blocking, does not disrupt the current screen |
| Form submission failure | Inline error state — displayed near the form, gives the user context to fix it |
| Full-screen operation failure (AI generation, onboarding) | Route-level `ErrorBoundary` with retry — replaces the screen content |
| Catastrophic / unexpected crash | Root `ErrorBoundary` — full-screen crash view with app restart |

---

## Rules

1. **`Result<T>` at every layer boundary.** Functions that can fail return `Result<T>`, not a plain value and not a throw.
2. **Log once.** The use case logs. Facades and `.logic.ts` do not log.
3. **`ensureError` in every catch.** Never cast `error as Error`. Never pass `unknown` to the logger.
4. **Never `console.error`.** Always use the injected `ILogger`.
5. **Never render `error.message` directly.** Always go through `useErrorMessage`.
6. **Root boundary always present.** `app/_layout.tsx` always exports an `ErrorBoundary`.
7. **Route boundaries for high-risk operations.** Add one when the feature can fail without taking down the rest of the app.
8. **Toast for mutations, inline for forms, boundary for screens.** Match the error surface to the interaction model.
