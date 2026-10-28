# Architecture: HolidAI deltas

The generic architecture (feature modules, tiers, layers, the ViewModel contract, the rules
table, naming, imports, comments) is the kit's
[ARCHITECTURE.md](https://github.com/timothyrusso/agentic-kit/blob/main/ARCHITECTURE.md). Read
it first. This file holds only what HolidAI does differently or adds; where the two disagree,
this file wins.

> **Diagram:** [Architecture overview](diagrams/architecture.mermaid)

HolidAI does not use Effect yet. Every delta marked **until Night 4** describes today's code and
is replaced by the kit's version in the Effect migration (#504): `Result<T>` instead of
`Effect<A, E, R>`, Inversify instead of Layers and `core/runtime`, Zod instead of Effect Schema.
Until then the kit's Effect rules (`effect-only-in-inner-layers`, `arch/no-effect-*`,
`domain/errors/`, `di/layer.ts`, the Tier 5 runtime) have nothing to check. The short rule list
agents follow is in [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md); this file explains it.

## Features and tiers

Tiers are the `FEATURE_TIER` constants in each `index.ts`, typed with `FeatureTier` re-exported
from `features/core/featureTier.ts`. HolidAI uses Tiers 0 to 3; there is no Tier 4 and no
`core/runtime` (Tier 5) until Night 4.

| Feature | Tier | Owns |
| --- | --- | --- |
| `core/*` (`container`, `dates`, `design-system`, `error`, `http`, `images`, `navigation`, `network`, `performance`, `query`, `sentry`, `state`, `storage`, `toast`, `translations`) | 0 | Infrastructure; `container` is the shared Inversify container |
| `ai` | 1 | The Gemini client (`geminiAiClient`) behind `IAiClient` |
| `auth` | 1 | Welcome and sign-in screens over Clerk's native `AuthView` |
| `user` | 1 | The Convex user record and the monthly generation tokens |
| `trips` | 2 | The trip entity and its Convex repository |
| `trip-generation` | 3 | The create-trip wizard and `GenerateTripUseCase` (AI search, extraction, save) |
| `profile` | 3 | Profile, account settings and language screens over `user` and `trips` |

## Two DI modes (until Night 4)

The kit has no container: Tags, Live Layers and one runtime. HolidAI today has two DI modes.

### Mode 1: Inversify singletons

Services, HTTP repositories and use cases are classes, registered as singletons in the shared
container from `features/core/container` (whose first import is `reflect-metadata`). Features with
a `di/` folder: `ai`, `trip-generation`, and the core concerns `dates`, `error`, `http`,
`images`, `navigation`, `network`, `performance`, `query`, `sentry`, `storage`.

```text
features/<name>/di/
├── types.ts       tokens: FEATURE_TYPES = { Xxx: Symbol.for('Xxx') }
├── config.ts      a ContainerModule; the only file that binds; ends with container.load(module)
├── factories/     optional: one pure module per instance that needs setup (no Inversify imports)
└── resolve.ts     first line imports ./config; exports container.get(...) results as constants
```

- **Self-bootstrapping.** Each `resolve.ts` imports its own `config.ts` first, so the bindings
  exist before any `container.get()`. `config.ts` never calls `container.get()`; when it needs
  another feature's tokens bound first, it side-effect imports that feature's `di/config.ts`.
  There is no central bootstrap file.
- **Factories or inline.** A plain `new Foo()` is bound inline in `config.ts`. Anything that
  reads `Constants`/env, validates, calls an SDK factory, or is one of several instances of a
  type goes in `di/factories/` (`ai/di/factories/gemini.ts`, `storage/di/factories/mmkvClient.ts`).
  A library instance injected through the container lives in `di/factories/`; one imported
  directly by a single `data/services/` file lives in `libraries/`.
- **Empty constructors.** A constructor only declares `@inject()` parameters. Building clients in
  the composition root keeps every dependency swappable in a test, keeps the class to one job,
  and makes the constructor signature the whole dependency list.
- **Bindings.** `@injectable()` on every bound class, `@inject(token)` on every interface-typed
  parameter (a missing one fails silently at runtime), `.inSingletonScope()` on the binding,
  never `@singleton()`.
- **Use cases are classes** with an `execute()` method, resolved in `di/resolve.ts`; the kit's
  plain-function use cases come with Night 4.
- **IoC repositories are reached only through a use case**, which logs and applies the rules.
  `core/images` is the example: `UnsplashImageRepository`, `GooglePlacesImageRepository` and
  `WikimediaDishImageRepository` are injected into use cases, and facades call the use cases.
- **Public API exception.** The kit forbids exporting use cases from `index.ts`. HolidAI's
  `index.ts` files re-export resolved singletons where another feature needs to call them:
  `logger` (`core/error`), the image use cases such as `fetchUnsplashImageUseCase` (`core/images`), `geminiAiClient`
  (`ai`), `generateTripUseCase` (`trip-generation`). `di/resolve.ts` itself is never imported
  from outside its feature.

### Mode 2: hook repositories (Convex and Clerk)

Convex queries are real-time subscriptions and Clerk exposes only hooks, so data access over them
is a hook repository, as in the kit's
[hook repositories](https://github.com/timothyrusso/agentic-kit/blob/main/ARCHITECTURE.md#hook-repositories-hook-only-sdks).
The deltas:

- Mutations return `Promise<Result<T>>` (try, `ensureError`, `fail`), not Effects; reactive reads
  return the hook value (`undefined` while loading). See [ERROR_HANDLING.md](ERROR_HANDLING.md).
- The repositories are `trips/data/repositories/useTripRepository.ts` and
  `user/data/repositories/useUserRepository.ts`, typed by interfaces in
  `domain/entities/repositories/`.
- Hook repositories are called only from `facades/`, never from a `.logic.ts`.
- Known deviation: the facades `user/facades/useDecrementTokens.ts` and
  `user/facades/useGetUserTokens.ts` call `convex/react` directly instead of going through
  `useUserRepository`.

## Library wrappers

The kit lets any `data/` file import `libraries/`. In HolidAI only `data/services/` does; class
repositories receive a service interface instead. Two documented exceptions:

1. **Hook-only service.** `core/toast/hooks/useToast.ts` wraps `toastClient` from `libraries/`
   directly, because a toast is a UI concern with no second implementation to swap.
2. **SDK bootstrap.** `initSentry`, `wrap` and `registerNavigationContainer` from `core/sentry`
   are one-time startup calls, re-exported from its `index.ts` and called once in
   `app/_layout.tsx`. Runtime Sentry calls go through `ISentryErrorClient` and
   `ISentryPerfClient`, injected from the container.

## Convex

```text
convex/
├── schema.ts         tables: trips, users
├── validators/       Trips.ts, Users.ts (table shapes)
├── trips.ts          trip queries and mutations
├── users.ts          user queries and mutations, token reset
├── http.ts           POST /clerk-users-webhook: user.created, user.deleted
├── crons.ts          resets every user's tokens monthly (day 1, 00:00 UTC)
└── auth.config.ts    Clerk JWT issuer (CLERK_JWT_ISSUER_DOMAIN), applicationID "convex"
```

- Convex bundles its functions itself without the `@/` alias, so `convex/` is allowed relative
  imports (`arch/no-relative-imports` override in `eslint.config.js`). `convex/_generated` is
  ignored by Biome and ESLint.
- `convex/http.ts` has no logger, so its one `console.error` carries a `biome-ignore`.
- The client is a `ConvexReactClient` mounted with `ConvexProviderWithClerk` in `app/_layout.tsx`.

## Clerk

- `@clerk/expo`: `ClerkProvider` with the `tokenCache` from `@clerk/expo/token-cache`, and
  `ClerkLoaded`, in `app/_layout.tsx`. The session survives relaunches through that cache.
- Sign-in and account screens are Clerk's native views (`AuthView` in `SignInOrUpPage`,
  `UserProfileView` in `AccountSettingsPage`).
- Clerk's hooks (`useUser`, `useAuth`, `useClerk`) are read in the hook repositories, in facades
  and in a few ViewModels; they are the only Clerk API.
- Users are created and deleted in Convex by the Clerk webhook, not by the app.
- The QA test account and its fixed code are in `qa.baseline.setup` of `kit.config.json`.

## Other deltas

- **Schemas are Zod** (until Night 4) in `domain/schemas/`, run by `data/validators/`. A service
  interface may use Zod only as `import type` for inference. Three domain files still import a
  library and are downgraded to `warn` for `domain-pure-except-effect` in
  `.dependency-cruiser.js`.
- **Server data.** Trips and users come from Convex hook repositories; TanStack Query
  (`queryClient` from `core/query`) caches only the HTTP image facades in `core/images`.
- **State.** Stores use `createWithEqualityFn` with `shallow`; `createSelectors`, `registerStore`,
  `resetAllStores` and `createZustandStorage` come from `core/state`. `registerStore` snapshots
  the initial state by reference, so call it before any render and never mutate nested state in
  place. `resetAllStores()` runs in the logout facade (`user/facades/useLogout.ts`) and clears memory only,
  not MMKV. App-wide state is `core/state/app/`. MMKV is one encrypted instance
  (`holidai.expo.storage`, key `MMKV_ENCRYPTION_KEY`).
- **Styles** are static `StyleSheet.create` objects built from the design-system tokens
  (`spacing`, `fontSize`, `components`), not `createStyles(theme)`.
- **Temporary lint downgrade.** `arch/stable-row-handlers` is `warn` on three
  `trip-generation` files until #504 moves their handlers into the ViewModels.
- **TSDoc** is required on every public method, not only when the name falls short: every use
  case `execute()`, every repository and service interface method, and any facade or hook return
  value that is not self-evident. Private methods get one when they throw or have constraints.
- **Rule names.** The rules once in the local `holidai` ESLint plugin (`tools/eslint/`) and
  `scripts/architecture/` now come from the kit packages, so `holidai/viewmodel-return-shape`,
  `holidai/prefer-viewmodel` and `holidai/no-inline-comments` are `arch/viewmodel-return-shape`,
  `arch/prefer-viewmodel` and `arch/no-inline-comments`; see the kit's
  [rules table](https://github.com/timothyrusso/agentic-kit/blob/main/ARCHITECTURE.md#rules-table).

## Design system and Storybook

`features/core/design-system/` holds `components/` (`basic/`, `composite/`, `providers/`,
`view/`), `style/` (tokens: colours, typography, dimensions, shadows, blur, opacity, animations) and
`assets/` (badges, fonts, images, lottie). Each component's `*.stories.tsx` sits next to it; the same stories run in the web
Storybook (`.storybook/`, Vite and react-native-web) and on device (`.rnstorybook/`). How to run
both and where the per-PR previews are published is in the [README](../../README.md#storybook).

## Sentry

- Logging: `SentryLogger` is bound to `ILogger` in release builds and `BasicLogger` in
  development (`core/error/di/config.ts`); see [ERROR_HANDLING.md](ERROR_HANDLING.md).
- Performance spans go through `IPerformanceTracker` from `core/performance` (Sentry in release,
  no-op in development), never `@sentry/react-native` directly. Span names and `op` values are in
  [PERFORMANCE_CONVENTIONS.md](PERFORMANCE_CONVENTIONS.md).
- Startup wiring is the SDK bootstrap exception above.

## Routes

```text
app/
├── _layout.tsx                    providers, Sentry wrap, root ErrorBoundary
└── (main)/
    ├── (not_authenticated)/       welcome, sign-in-or-sign-up
    └── (authenticated)/           route-level ErrorBoundary for everything signed in
        ├── (tabs)/                home-page, trips, activities, profile
        ├── create-trip/           the wizard: search-place, select-dates, select-traveler,
        │                          select-budget, review-trip, generate-trip, trip-details,
        │                          activity-details, dish and typical-dishes modals
        └── profile/               account-settings, change-language
```
