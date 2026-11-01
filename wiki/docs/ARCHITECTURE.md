# Architecture: HolidAI deltas

HolidAI follows the agentic-kit `ARCHITECTURE.md`, `ERROR_HANDLING.md`, `TESTING.md` and
`EFFECT_PRIMER.md` (shipped in the plugin as `${CLAUDE_PLUGIN_ROOT}/docs/`, and on
[GitHub](https://github.com/timothyrusso/agentic-kit/blob/main/ARCHITECTURE.md)). Read them first.
This file lists only what HolidAI decides on top of them; where the two disagree, this file wins.
[ERROR_HANDLING.md](ERROR_HANDLING.md) holds the error deltas,
[EFFECT_NOTES.md](EFFECT_NOTES.md) points at the HolidAI file that is the worked example of each
primer section, and [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) is the short rule list agents
follow.

> **Diagram:** [Architecture overview](diagrams/architecture.mermaid)

## Layout

`featuresRoot` is `features`, `appRoot` is `app`, and `@/` points at the repository root. Convex
functions live in `convex/` at the root, next to them (see Convex below). Route files in `app/`
re-export a page from a feature's `pages.ts`, except the layouts, which mount the providers and
the route guards.

## Tiers

| Tier | Features | What they own |
| --- | --- | --- |
| 0 | `core/*` (below) | the shared concerns |
| 1 | `ai`, `auth`, `user` | the `AiService` over Gemini; the welcome and sign-in screens over Clerk's native `AuthView`; the Clerk user, the Convex generation tokens and the session follower |
| 2 | `trips` | the trip entity, its Convex hook repository, the trip screens and the image retries |
| 3 | `trip-generation`, `profile` | the create-trip wizard and the `generateTrip`, `enrichTrip` and `saveTrip` use cases; the profile, account settings and language screens |
| 5 | `core/runtime` | `AppLayer`, `runtime`, `bootRuntime` and the `Register` augmentation |

There is no tier 4.

## Core concerns

| Concern | What it holds |
| --- | --- |
| `core/error` | the `AppError` union over `AppErrorRegistry`, the core tagged errors, `errorTagToMessageKey`, `useErrorMessage`, the two crash views; `kit.ts` re-exports `AppErrorBase` and `toAppError` for `domain/` files |
| `core/config` | `AppConfig` from `makeConfig`, decoding `extra` of `app.config.js`; `requireConfigKey` for the optional keys |
| `core/logger` | `LoggerLive` (`ConsoleLogger` in development, `SentryLoggerLive` in release), `logBackgroundFailure`, `useReportFailure` |
| `core/sentry` | the `Sentry` Tag (`captureException`, `withSpan`) and `SentryLive`; the SDK bootstrap (`initSentry`, `wrap`, `registerNavigationContainer`, `reportBootFailure`) |
| `core/performance` | the `PerformanceTracker` Tag (Sentry in release, a no-op in development) and the `startSpan` combinator; see [PERFORMANCE_CONVENTIONS.md](PERFORMANCE_CONVENTIONS.md) |
| `core/http` | the `HttpClient` Tag: a 10 second timeout per attempt, two retries on no response or a 5xx |
| `core/network` | the `Network` Tag over `expo-network` |
| `core/storage` | the `Storage` Tag over one encrypted MMKV instance (`holidai.expo.storage`), keyed from `AppConfig`; objects go through Schema |
| `core/images` | the `ImageRepository` Tag over Unsplash, Google Places and Wikimedia, `fetchImage`, `useGetImage`, `usePlacePhotoUrls` |
| `core/query` | `queryClient`: no TanStack retry for an app error |
| `core/state` | `createSelectors`, `registerStore`, `resetAllStores` |
| `core/translations` | i18next, the `en` and `it` catalogs, `useChangeLanguage`, `languageToRestore` |
| `core/dates`, `core/navigation`, `core/toast` | date formatting for prompts and screens; routes and `navigationService`; the toast |
| `core/design-system` | components, tokens, assets and their Storybook stories |
| `core/testing` | `makeTestAppLayer`, `makeTestRuntime`, `renderWithLayer`, `routerFake`, `convexFake`, `clerkFake`, and the core fakes (`ImageRepositoryFake`, `NetworkFake`, `StorageFake`) |
| `core/runtime` | the composition root (tier 5) |

## Layers plus hook repositories

HolidAI wires dependencies two ways.

- **Layers** for everything swappable that is not Convex or Clerk: `AiService`, `ImageRepository`,
  `HttpClient`, `Network`, `Storage`, `Sentry`, `PerformanceTracker`, `Logger`, `AppConfig`. `ai`,
  `core/images`, `core/logger` and `core/performance` have a `di/layer.ts` (the last two pick the
  release or development Layer); the other core concerns export their Live Layer from `index.ts`,
  and `core/runtime/runtime.ts` merges them all. `trips`, `user` and `trip-generation` have no
  Layer of their own: their `di/` holds only test fakes.
- **Hook repositories** for Convex and Clerk, as in the kit's
  [hook repositories](https://github.com/timothyrusso/agentic-kit/blob/main/ARCHITECTURE.md#hook-repositories-hook-only-sdks):
  `trips/data/repositories/useTripRepository.ts` and `user/data/repositories/useUserRepository.ts`,
  typed by `ITripRepository` and `IUserRepository` in `domain/entities/repositories/`.

### Convex boundary

- Queries are subscriptions, so they stay `useQuery` values: `undefined` while loading, never an
  Effect. The trips query is skipped (`'skip'`) until Clerk has a user.
- Every mutation is wrapped in its hook repository and nowhere else, as one
  `Effect.tryPromise({ try: () => mutate(args), catch: cause => toAppError(cause) })` (`run` in
  `useTripRepository`). A Convex rejection becomes an `UnexpectedError`; Convex has no typed
  failure the UI reads.
- The optimistic updates (favourite, cover, dish image, activity photos) stay on the Convex
  mutation with `withOptimisticUpdate`, inside the hook repository.
- `Id<'trips'>` is Convex's branded string type, used as is in `trips/domain/` (a `// NOTE:` in
  `Trip.ts` gives the reason).

### Clerk boundary

- Clerk is hooks and native views only: `useUser`, `useAuth`, `useClerk`, and the native
  `AuthView` (`SignInOrUpPage`) and `UserProfileView` (`AccountSettingsPage`). It has no Tag and no
  Layer.
- `useUserRepository` maps the Clerk user to the app's user; nothing else should read `useUser`.
- `useSessionChanges` (`user/facades/`), called by `app/(main)/_layout.tsx` for the route guards,
  follows the session: a sign-in goes home, and a sign-out from anywhere (Clerk's own account
  screen included) calls `resetAllStores()`, so the next user starts with an empty wizard.
- Users are created and deleted in Convex by the Clerk webhook (`convex/http.ts`), not by the app.
- The session survives relaunches through `tokenCache` from `@clerk/expo/token-cache`. The QA
  account and its fixed code are in `qa.baseline.setup` of `kit.config.json`.

## Patterns

- **A hook repository's mutation handed to a use case.** A hook cannot be a Layer, so a use case
  that ends in a Convex write takes the write as a parameter: `saveTrip(trip, save)` and the
  `retryCoverImage`, `retryDishImage` and `retryActivityPhotos` use cases receive the repository's
  Effect from their facade. `trips` exposes `addTrip` to `trip-generation` through `useAddTrip`
  for that reason.
- **The trip entity is the AI's answer.** `TripAiResp` in `trips/domain/entities/Trip.ts` is
  `GeneratedTrip`, the type `GeneratedTripSchema` decodes in `ai`. The extract step asks the model
  for a Zod schema (`ai/data/dtos/GeneratedTripResponseDTO.ts`, the format the Vercel AI SDK
  takes), and `GeneratedTripSchema` re-decodes its answer; a test keeps the two accepting the same
  fixtures.
- **Optional config keys fail late.** The Convex URL, the Clerk key and the MMKV key are required
  at boot; the provider keys and the Sentry DSN are optional, and the feature that needs one fails
  with `ConfigMissing` when it runs (`requireConfigKey`). The Gemini client is built on the first
  call through `Effect.cached`, so a checkout without the key still starts.
- **The wizard resets when generation succeeds**, in `useGenerateTrip`, before enrichment and
  save. A save that fails after that loses the wizard's inputs.
- **Generation runs in two timed steps.** See [EFFECT_NOTES.md](EFFECT_NOTES.md) for the retry
  schedule and the timeouts.

## Exceptions

Each is a deliberate departure from a kit rule, with the reason.

1. **Logging at a fork point.** `languageToRestore` (`core/translations/useCases/language.ts`)
   logs a storage failure through `logBackgroundFailure` and falls back to the device language.
   Restoring the language is a best-effort launch step that `bootRuntime` awaits outside any
   `useEffectQuery` or `useEffectMutation`, so there is no boundary to log it; a preference never
   stops the app launching.
2. **SDK callback failures through a mutation.** `useReportFailure` (`core/logger`) runs
   `reportFailure(cause)`, an Effect that only fails, through `useEffectMutation`, so a failure an
   SDK hands to a callback is logged once by the boundary like any other. Its one caller is the
   `PlacesAutocomplete` ViewModel (the Google Places SDK's `onFail`).
3. **`bootRuntime` runs an Effect in the composition root.** After `runtime.boot()`,
   `core/runtime/runtime.ts` reads `AppConfig` and `languageToRestore` through
   `runtime.runPromise`, because the providers above the runtime (Convex, Clerk) need the decoded
   config before any facade exists. A boot failure is reported by `reportBootFailure` and shown by
   `RootAppCrashView`.
4. **`ai` in `domainPublicApiExceptions`** (`.dependency-cruiser.js`): `trips/domain/` imports the
   `GeneratedTrip` type from `ai`, and `domain-no-cross-feature-runtime-import` flags type-only
   imports (Kit gaps below).
5. **A toast in a ViewModel.** `GenerateTripPage.logic.ts` shows the `TokensExhausted` toast
   itself (a `// NOTE:` says so): it is a check before any mutation runs, with no facade failure to
   hang it on.
6. **Console in Convex.** `convex/http.ts` and `convex/users.ts` run on Convex's servers with no
   `Logger`; their `console.error` carries a `biome-ignore`.

## Behaviour notes

- **Release builds send only `Logger.error` to Sentry.** `SentryLoggerLive` drops `warn`, `info`
  and `debug`, so a typed failure (which the boundary logs as `warn`, an image fetch for example)
  no longer reaches Sentry; only defects do.
- **`generateText` with `Output.object`**, not `generateObject`, which `ai@6` deprecates.
- **The generation timeouts are estimates** (1 minute for search, 4 minutes for extract); the
  `ai.search` and `ai.extract` spans make them tunable from Sentry data.
- **`features/ai/__fixtures__/generatedTripAnswer.json` is hand-written**, because no key was
  available to capture a real answer. Replace it with a captured one.

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

- Convex bundles its functions without the `@/` alias, so `convex/` keeps relative imports (the
  `arch/no-relative-imports` allow list in `eslint.config.js`). `convex/_generated` is ignored by
  Biome and ESLint.
- The client is a `ConvexReactClient` built from the decoded `convexUrl` once the runtime has
  booted, mounted with `ConvexProviderWithClerk` in `app/_layout.tsx`.

## Views and state

- `lint.allowedHooksInViews` is empty.
- Styles are static `StyleSheet.create` objects built from the design-system tokens (`spacing`,
  `fontSize`, `components`), not `createStyles(theme)`: the app has one theme.
- Stores use `createWithEqualityFn` with `shallow` and register with `registerStore`, which
  snapshots the initial state by reference: call it before any render and never mutate nested
  state in place. `resetAllStores()` clears memory only, not MMKV.
- The design system's stories run in the web Storybook (`.storybook/`, Vite and react-native-web)
  and on device (`.rnstorybook/`); see the [README](../../README.md#storybook).

## Routes

```text
app/
├── _layout.tsx                    boot, providers, Sentry wrap, root ErrorBoundary
└── (main)/                        useSessionChanges and the signed-in route guards
    ├── (not_authenticated)/       welcome, sign-in-or-sign-up
    └── (authenticated)/           route-level ErrorBoundary for everything signed in
        ├── (tabs)/                home-page, trips, activities, profile
        ├── create-trip/           the wizard: search-place, select-dates, select-traveler,
        │                          select-budget, review-trip, generate-trip, trip-details,
        │                          activity-details, dish and typical-dishes modals
        └── profile/               account-settings, change-language
```

## Tests

- Use case tests fake Tags as Layers (`aiServiceFake`, `tripImagesFake` in the feature's
  `di/__tests__/`, the core fakes in `core/testing`); facade and ViewModel tests render with
  `renderWithLayer`.
- **Convex and Clerk are faked behind root `__mocks__/`** (`convex/react.ts`, `@clerk/expo.ts`),
  which hand out `convexFake` and `clerkFake` from `core/testing`. TESTING.md allows `__mocks__`
  only for a native module with no Tag and leaves hook repositories to device QA; HolidAI goes
  further so the mutating facades and their optimistic updates have hook tests. A feature's
  backend fake (`tripsBackendFake`, `userBackendFake`) answers each Convex function over in-memory
  tables; `convexFake.hold` and `release` show an optimistic update before the server answers.
  `jestAfterEnv.ts` resets the router, Convex and Clerk fakes before every test.
- The library mocks in `__mocks__/` are each library's own (`react-native-reanimated`,
  `react-native-worklets`, `react-native-keyboard-controller`, `react-native-safe-area-context`),
  plus a no-op `@sentry/react-native` (the real SDK leaves a timer that keeps jest running).
- Coverage is measured over `features/**/*.ts` (`jest.config.cjs`), not the preset's whole tree:
  the Convex functions run on Convex's servers and the Storybook config on Storybook's.

## Tooling notes

- Zod stays a dependency for the AI SDK's output schema only (`GeneratedTripResponseDTO`);
  domain schemas are Effect Schema.
- `kit.config.json` sets `lint.dashes` to `allow`.

## Kit gaps

What the kit (0.1.2) does not cover yet, and what HolidAI does meanwhile:

- `domain-no-cross-feature-runtime-import` flags type-only imports: `ai` joins
  `domainPublicApiExceptions` (Exceptions above).
- Only the QA agents read `.claude/agent-memory/`; the builder and reviewer agents do not, so the
  Effect lessons for them live in [EFFECT_NOTES.md](EFFECT_NOTES.md) and `.claude/CLAUDE.md`.

## Known leftovers

Recorded, not fixed yet:

- The core `NotFound` and `Unauthorized` errors are in the union and the mapper but never
  constructed.
- Performance spans do not nest: `SentryLive.withSpan` starts them with `startInactiveSpan`, so
  `ai.search` and `ai.extract` are not children of `ai.generate` in the trace view (see
  [PERFORMANCE_CONVENTIONS.md](PERFORMANCE_CONVENTIONS.md)).
- `PlacesAutocomplete.tsx` reads the Places key from `Constants`, not from `AppConfig`.
- `useSessionChanges`, `useGetUserTokens` and `SignInOrUpPage.logic.ts` call Clerk hooks (and
  `useGetUserTokens` a Convex query) directly, not through `useUserRepository`.
