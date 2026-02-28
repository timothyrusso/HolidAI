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
        ├── (tabs)/        # Tab navigator: my-trips, profile
        ├── create-trip/   # Multi-step trip creation wizard
        ├── my-trips/      # Show all trips
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
├── shared/         # Cross-module utilities (hooks, storage, logger, error)
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
└── style/          # Design tokens: colors, fonts, spacing, shadows, animations
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
