# Architecture

## Folder Structure

```
HolidAI/
├── app/          # Routing (Expo Router file-based)
├── modules/      # Feature modules (business logic, UI pages)
├── ui/           # Shared UI (reusable components, state, queries, styles)
├── di/           # Dependency injection (tsyringe)
├── convex/       # Backend (serverless functions, DB schema)
└── types/        # Global TypeScript type declarations
```

---

## `app/` — Routing

Expo Router uses file-based routing. Each file in `app/` becomes a route.

```
app/
└── (main)/
    ├── (login)/           # Public screens: welcome, sign-in, sign-up
    └── (authenticated)/   # Protected screens (requires auth)
        ├── (tabs)/        # Tab navigator: home-page, profile, create-trip
        ├── create-trip/   # Multi-step trip creation wizard
        ├── home-page/      # Show the next trip
        └── profile/       # Profile settings
```

Route files are **thin entry points** — they import and render a `Page` component from `modules/`.

---

## `modules/` — Feature Modules

Each feature is a self-contained module. Modules own their domain logic and UI.

```
modules/
├── trips/          # Trip creation & details
├── home/           # Home / my trips list
├── authentication/ # Login, sign-up, welcome
├── profile/        # Profile & language settings
├── ai/             # AI client (Gemini integration)
├── shared/         # Cross-module utilities (hooks, storage, logger, error, platform)
├── navigation/     # Route constants and screen options
├── dates/          # Date formatting use cases
├── translations/   # i18n setup (react-i18next)
└── fligths/        # Flight search integration
```

Each module follows a consistent internal structure:

```
modules/<feature>/
├── domain/        # Entities, interfaces, DTOs — pure business logic, no side effects
├── infra/         # Implementations (API calls, SDKs, adapters)
└── ui/
    ├── pages/     # Full-screen components + their .logic.ts and .style.ts
    └── components/ # Feature-specific components
```

`modules/shared/` is special: it holds cross-cutting concerns used by multiple modules.

```
modules/shared/
├── domain/        # PlatformOS, Languages, AppKeys (storage key constants)
├── infra/         # logger/, storage/, error/ — infrastructure interfaces + implementations
└── hooks/         # Shared React hooks (useLocale, useChangeLanguage, useToast, useKeyboardEffect…)
```

**Rule:** `domain/` never imports from `infra/`. Consumers depend on interfaces, never on concrete classes.

---

## `ui/` — Shared UI

Reusable building blocks used across multiple modules.

```
ui/
├── components/
│   ├── basic/      # Atomic: CustomButton, CustomText, CustomIcon, CustomTextInput…
│   ├── composite/  # Composed: CustomHeader, CustomScrollView, PlacesAutocomplete…
│   ├── dialogs/    # Modals: ActionModal, InfoModal, ResetPasswordModal…
│   └── view/       # Page wrappers: BasicView
├── queries/        # TanStack Query hooks (server state): trips, user, images…
├── state/          # Zustand stores (client state): app, trip, modal
├── style/          # Design tokens: colors, fonts, spacing, shadows, animations
└── assets/         # Static files: images/, lottie/ — import via @/ui/assets/…
```

**Page component pattern:**

```
PageName/
├── PageName.tsx        # JSX — layout and rendering only
├── PageName.logic.ts   # Hook with state, handlers, and derived data
└── PageName.style.ts   # StyleSheet definitions
```

---

## `di/` — Dependency Injection

Services are registered once, resolved by token, and consumed as interfaces.

```
di/
├── types/    # Tokens (TYPES.Logger, TYPES.Storage, TYPES.AiClient…)
├── config/   # Registers implementations with the container
└── resolve/  # Exports resolved instances for consumption
```

**Flow:** `di/config` → register → `di/resolve` → import in hooks/pages.

Never instantiate services directly — always import from `@/di/resolve`.

---

## `convex/` — Backend

Serverless backend using Convex.

```
convex/
├── schema.ts      # Database tables: users, trips
├── users.ts       # User queries and mutations
├── trips.ts       # Trip queries and mutations
├── validators/    # Input validation (Zod)
└── auth.config.ts # Clerk authentication integration
```

---

## Date Handling

### Storage convention

All trip dates (`startDate`, `endDate`) are stored in Convex as **`YYYY-MM-DD` strings** (ISO 8601 date-only, no time component).

### Full pipeline

```
CalendarPicker (react-native-calendar-picker)
  → Date object (midnight UTC)
  → getTimezoneFormattedDateUseCase()     adjusts to local timezone (timezone correction happens here)
  → tripStore.datesInfo                   stored as Date | null
  → formatDateForPromptUseCase()          extracts "YYYY-MM-DD" via .toISOString().split('T')[0]
  → AI model (Gemini)                     receives unambiguous ISO date, instructed via schema .describe()
  → generatedTripSchema (Zod)             .transform(normalizeDateToISOUseCase) as safety net
  → Convex DB                             always stored as "YYYY-MM-DD"
  → translateDate(locale, "YYYY-MM-DD")   formats for display (locale-specific)
  → UI
```

### Utilities (`modules/dates/application/`)

| File | Purpose | Input → Output |
|---|---|---|
| `getTodayInLocalTimezoneUseCase` | Current date in local timezone. **Module-level constant** (evaluated once at import time, not a function). | — → `Date` |
| `getTimezoneFormattedDateUseCase` | Adjusts a `Date` by subtracting the timezone offset so it represents local time correctly. Applied to CalendarPicker output. | `Date` → `Date` |
| `convertFromUTCToLocaleUseCase` | Formats full UTC datetime strings (e.g. `2024-01-01T09:00:00Z`) into `"DD MMMM YYYY"`. **Not used for trip date strings.** | `string (datetime)` → `string` |
| `getTranslatedDate` (`translateDate`) | Parses a `Date` or date string (supports 6 formats) and returns a locale-specific display string via `toLocaleDateString(locale)`. Used everywhere for display. | `Date \| string` → `string` |
| `normalizeDateToISOUseCase` | Converts `DD/MM/YYYY` → `YYYY-MM-DD`. Pass-through for already-correct formats. Used as a Zod transform in `generatedTripSchema`. | `string` → `string` |
| `formatDateForPromptUseCase` | Extracts `YYYY-MM-DD` from a timezone-adjusted `Date` object (from tripStore) for use in AI prompt placeholders. Does not modify the date — timezone correction already happened upstream via `getTimezoneFormattedDateUseCase`. | `Date \| null` → `string` |

### Why normalization is needed

The AI prompt now receives dates already in `YYYY-MM-DD` via `formatDateForPromptUseCase`, so the model gets an unambiguous input. Two safeguards still exist as a safety net in `generatedTripSchema`:

1. **Schema description** — `z.string().describe('Date in ISO format YYYY-MM-DD')` instructs the model explicitly.
2. **Zod transform** — `.transform(normalizeDateToISOUseCase)` normalizes at parse time in case the model still returns a different format.

### Comparing dates

`getUpcomingTrip()` in `useGetUserTrips` compares dates as plain strings:

```ts
const todayStr = getTodayInLocalTimezoneUseCase.toISOString().split('T')[0];
userTrips?.filter(trip => trip.tripAiResp.tripDetails.startDate >= todayStr)
```

ISO date strings are lexicographically sortable, so string comparison is correct and avoids timezone/time-of-day issues. Today's trips are included because `"2026-03-01" >= "2026-03-01"` is `true`.

### Caveats

- `getTodayInLocalTimezoneUseCase` is a **module-level constant**. If the app runs past midnight without reloading the module, the "today" value will be stale.
- `getTranslatedDate` tries 6 formats sequentially (`dd/MM/yyyy` first). Safe for `YYYY-MM-DD` strings because the `-` separator never matches the `/`-based formats, so it always falls through to `yyyy-MM-dd`.
- `normalizeDateToISOUseCase` assumes all `/`-delimited dates are `DD/MM/YYYY`. For `MM/DD/YYYY` (US locale) this would produce wrong results, but the schema `.describe()` prevents the model from returning that format in practice.

---

## How a Screen Works (End to End)

```
app/(authenticated)/create-trip/search-place.tsx
  └── renders <SearchPlacePage />                    ← from modules/trips/ui/pages/
        ├── uses useSearchPlacePageLogic()            ← SearchPlacePage.logic.ts
        │     ├── reads/writes useTripState()         ← ui/state/trip/
        │     └── calls useGooglePlaceImagesQuery()   ← ui/queries/googlePlaceImages/
        └── renders <PlacesAutocomplete />            ← ui/components/composite/
```

---

## Path Aliases

| Alias       | Resolves to     |
|-------------|-----------------|
| `@/*`       | project root    |
| `@ui/*`     | `ui/`           |
| `@configs/*`| `configs/`      |
