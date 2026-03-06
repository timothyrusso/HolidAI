# Architecture

## Philosophy

This project follows a **feature-first Clean Architecture**. Each self-contained piece of functionality lives in its own feature folder with a consistent internal structure. Dependencies always point inward: `ui` → `hooks` / `state` → `useCases` → `domain`. Nothing in `domain` ever imports from `data`, `hooks`, `state`, or `ui`.

The app uses two complementary dependency injection patterns:

- **tsyringe** for stateless singletons: Logger, Storage, AI client, HTTP client, image repositories. These are registered once at app startup inside each feature's own `di/` folder and resolved via the feature's `di/resolve.ts`.
- **Hook-based repositories** for Convex data access. Convex is reactive by design — `useQuery`/`useMutation` are hooks that subscribe to real-time updates and depend on Clerk auth context. Forcing them into a class singleton would lose reactivity and break auth. Repository interfaces are defined in `domain/` and implemented as hooks in `data/repositories/`.

---

## Feature Module Structure

Every feature follows this internal layout. Not every folder is required — only create what the feature actually needs.

```
features/<name>/
├── domain/
│   ├── entities/
│   │   ├── repositories/
│   │   └── services/
│   └── schemas/
├── data/
│   ├── dto/
│   ├── adapters/
│   ├── validators/
│   ├── repositories/
│   └── services/
├── di/               (only in features with injectable singletons)
│   ├── types.ts
│   ├── config.ts
│   └── resolve.ts
├── libraries/
├── useCases/
├── hooks/
├── state/
└── ui/
    ├── components/
    └── pages/
```

---

## Folder Purposes

### `domain/`

The core of the feature. Contains only pure TypeScript — no external library imports, no side effects, no framework code. Everything here is stable and fully independent of infrastructure decisions.

#### `domain/entities/`

Pure domain models — TypeScript interfaces, types, and enums that represent the concepts of this feature in the app's own language, not in an external API's language.

```ts
// features/trips/domain/entities/Trip.ts
export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  isFavorite: boolean;
}
```

##### `domain/entities/repositories/`

Repository interfaces. Define the contract for data access without specifying how it is implemented. The feature's `data/repositories/` implements these contracts.

```ts
// features/trips/domain/entities/repositories/ITripRepository.ts
export interface ITripRepository {
  getUserTrips(): Trip[] | undefined;
  createTrip(data: CreateTripData): Promise<void>;
  toggleFavorite(tripId: string): Promise<void>;
  deletTrip(tripId: string): Promise<void>;
}
```

##### `domain/entities/services/`

Service interfaces. While repository interfaces define contracts for **data access** (how to read and write domain data), service interfaces define contracts for **capabilities** — cross-cutting concerns that a feature needs but doesn't own the implementation of.

A feature declares "I need to be able to log things" or "I need to generate AI content" without caring how it works. The interface is the contract; `data/services/` provides the implementation and the DI container wires them together. This means the implementation can change (e.g. swap `BasicLogger` for a remote logging service) without touching any feature code.

```ts
// features/shared/domain/entities/services/ILogger.ts
export interface ILogger {
  log(message: string, ...args: unknown[]): void;
  error(error: Error, ...args: unknown[]): void;
  warning(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
```

#### `domain/schemas/`

Zod schema definitions. Schemas are a domain concern because they describe what valid data looks like for this feature. They serve as the single source of truth for both runtime validation and TypeScript types via `z.infer<>`.

`data/validators/` uses these schemas to execute validation. The schema itself does not run validation — it only defines the rules.

**Why not abstract Zod behind an interface?** Zod acts as a type-system extension for TypeScript rather than a swappable infrastructure dependency. `z.infer<>` is the mechanism that derives static types from schema definitions — abstracting it away would mean duplicating every type definition separately, which defeats the purpose. The separation that matters is already in place: schemas *define* rules here in `domain/schemas/`, validators *run* them in `data/validators/`. If the validation library ever changes, only those two locations need updating — no feature code is affected.

```ts
// features/trips/domain/schemas/GenerateTripSchema.ts
export const generateTripSchema = z.object({
  tripDetails: z.object({
    destination: z.string(),
    startDate: z.string().describe('Date in ISO format YYYY-MM-DD'),
    endDate: z.string().describe('Date in ISO format YYYY-MM-DD'),
  }),
  dayPlans: z.array(dayPlanSchema),
});

export type GeneratedTrip = z.infer<typeof generateTripSchema>;
```

---

### `data/`

Concrete implementations of everything defined in `domain/`. This layer knows about external systems — Convex, HTTP APIs, device storage, SDKs. It imports from `domain/` but `domain/` never imports from `data/`.

#### `data/dto/`

Data Transfer Objects. Raw data shapes that come from external sources — HTTP responses, Convex query results, third-party APIs. DTOs live in `data/` because they represent the external world's format, not the app's domain language. The domain layer is completely unaware of them — only `data/adapters/` consumes DTOs to transform them into domain entities.

```ts
// features/trips/data/dto/TripResponseDTO.ts
export type TripResponseDTO = {
  _id: string;
  userId: string;
  tripAiResp: { tripDetails: { destination: string; startDate: string; }; dayPlans: DayPlan[]; };
  isFavorite: boolean;
};
```

#### `data/repositories/`

Implementations of repository interfaces from `domain/entities/repositories/`.

For **Convex** (reactive data), repositories are implemented as hooks — not classes. This preserves real-time subscriptions and Clerk auth context, which would be lost in a class singleton:

```ts
// features/trips/data/repositories/useConvexTripRepository.ts
export const useConvexTripRepository = (): ITripRepository => {
  const { user } = useUser();
  const trips = useQuery(api.trips.getAllTripsbyUserId, { userId: user?.id ?? '' });
  const createMutation = useMutation(api.trips.createTrip);
  const toggleMutation = useMutation(api.trips.toggleFavoriteTrip);

  return {
    getUserTrips: () => trips,
    createTrip: (data) => createMutation(data),
    toggleFavorite: (tripId) => toggleMutation({ tripId }),
  };
};
```

For **HTTP APIs** (non-reactive), repositories are `@singleton()` classes registered in the DI container:

```ts
// features/shared/data/repositories/UnsplashImageRepository.ts
@singleton()
export class UnsplashImageRepository implements IImageRepository {
  constructor(@inject(TYPES.HttpClient) private http: IHttpClient) {}

  async getImage(placeName: string, urlType: UrlType): Promise<string> {
    const data = await this.http.get('https://api.unsplash.com/search/photos', { ... }).json();
    return data.results[0]?.urls[urlType] ?? noImage;
  }
}
```

#### `data/services/`

Implementations of service interfaces from `domain/entities/services/`. These are stateless, decorated with `@singleton()`, and registered in the DI container. They may use `libraries/` wrappers internally.

```ts
// features/shared/data/services/BasicLogger.ts
@singleton()
export class BasicLogger implements ILogger {
  log(message: string, ...args: unknown[]) { console.log(message, ...args); }
  error(error: Error, ...args: unknown[]) { console.error(error, ...args); }
  warning(message: string, ...args: unknown[]) { console.warn(message, ...args); }
}
```

#### `data/adapters/`

Pure functions that transform data between shapes — typically a DTO (external shape) into a domain entity (internal shape). Keeps transformation logic out of repositories and use cases.

```ts
// features/trips/data/adapters/tripAdapter.ts
import type { TripResponseDTO } from '@/features/trips/data/dto/TripResponseDTO';
import type { Trip } from '@/features/trips/domain/entities/Trip';

export const toTrip = (dto: TripResponseDTO): Trip => ({
  id: dto._id,
  destination: dto.tripAiResp.tripDetails.destination,
  startDate: dto.tripAiResp.tripDetails.startDate,
  endDate: dto.tripAiResp.tripDetails.endDate,
  isFavorite: dto.isFavorite,
});
```

#### `data/validators/`

Functions that execute validation — running Zod schemas against untrusted input, checking business rules, sanitizing data. Validators use schemas from `domain/schemas/` as their rules.

```ts
// features/trips/data/validators/validateGeneratedTrip.ts
export const validateGeneratedTrip = (data: unknown): GeneratedTrip => {
  return generateTripSchema.parse(data);
};
```

---

### `libraries/`

Thin wrappers around external libraries. No business logic — only API normalization and simplification. The goal is to isolate the app from third-party library APIs so that swapping a library (e.g. `ky` → `axios`) only requires changing its wrapper, not every file that uses it.

`data/services/` and `data/repositories/` always use library wrappers, never raw libraries directly.

```ts
// features/shared/libraries/httpClient.ts
import ky from 'ky';

export const httpClient = ky.create({
  timeout: 10_000,
  retry: 1,
});
```

```ts
// features/shared/libraries/storageClient.ts
import { MMKV } from 'react-native-mmkv';

export const storageClient = new MMKV({ id: 'app-storage', encryptionKey: '...' });
```

---

### `useCases/`

Application logic that orchestrates domain entities, repositories, and services to perform a specific action or compute a specific result. Use cases contain business rules that don't belong to any single entity.

Pure utility functions that have no side effects and don't require DI also live here.

```ts
// features/trips/useCases/getUpcomingTripUseCase.ts
export const getUpcomingTripUseCase = (trips: Trip[]): Trip | undefined => {
  const today = getTodayInLocalTimezoneUseCase.toISOString().split('T')[0];
  return trips
    .filter(trip => trip.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
};
```

---

### `hooks/`

React integration layer. Hooks connect components to use cases, repositories, and DI-resolved services. They handle React-specific concerns — lifecycle, derived state, memoization — and are the only layer that components directly interact with.

For **hook-based repositories** (Convex), hooks compose the repository hook with use case logic:

```ts
// features/trips/hooks/useGetUserTrips.ts
export const useGetUserTrips = () => {
  const repo = useConvexTripRepository();
  const trips = repo.getUserTrips();

  return {
    isLoading: trips === undefined,
    getUpcomingTrip: () => trips ? getUpcomingTripUseCase(trips) : undefined,
    getTotalTrips: () => trips?.length ?? 0,
    getFavouriteTrips: () => trips?.filter(t => t.isFavorite) ?? [],
    getTripById: (id: string) => trips?.find(t => t.id === id),
  };
};
```

For **DI-resolved services** (tsyringe), hooks resolve the singleton from the container:

```ts
// features/shared/hooks/useVercelAi.ts
import { aiClient } from '@/features/ai/di/resolve';

export const useVercelAi = () => ({
  generateAiObject: (prompt: string, schema: ZodType, model: AiModels) =>
    aiClient.generateObject(prompt, schema, model),
});
```

---

### `state/`

Zustand stores for UI state that belongs to this feature. Only domain-specific state lives here — wizard steps, selected options, local UI flags. Cross-cutting global state (app theme, modal visibility, store utilities) lives in `features/shared/state/`.

```ts
// features/trips/state/tripStore.ts
export const useTripStore = create<TripState & TripActions>()(set => ({
  locationInfo: { name: '', coordinates: undefined },
  datesInfo: { startDate: null, endDate: null, totalNoOfDays: 0 },
  budgetInfo: 'Cheap',
  actions: {
    setLocationInfo: (info) => set({ locationInfo: info }),
    resetTripState: () => set(initialState),
  },
}));
```

`features/shared/state/` also holds the `createStore` and `createSelectors` utilities used by all stores across the app.

---

### `ui/`

React Native components and pages for this feature. This layer only imports from `hooks/`, `state/`, and the global `ui/` — never directly from `domain/`, `data/`, or `useCases/`.

#### `ui/components/`

Feature-specific React Native components. Not intended for reuse across features — if a component is needed by multiple features, it moves to the global `ui/components/`.

#### `ui/pages/`

Full screens. Each page is split into three files to keep concerns separated:

```
PageName/
├── PageName.tsx        → JSX only — layout and rendering, no logic
├── PageName.logic.ts   → custom hook with all state, handlers, derived data
└── PageName.style.ts   → StyleSheet definitions
```

---

## DI Container

Each feature that has injectable singletons owns its DI configuration. There is no global `di/` folder — configuration lives alongside the code it belongs to.

```
features/shared/
└── di/
    ├── types.ts    → SHARED_TYPES = { Logger: Symbol.for('Logger'), Storage: Symbol.for('Storage'), … }
    ├── config.ts   → container.registerSingleton(SHARED_TYPES.Logger, BasicLogger)
    └── resolve.ts  → export const logger = container.resolve<ILogger>(SHARED_TYPES.Logger)

features/ai/
└── di/
    ├── types.ts
    ├── config.ts
    └── resolve.ts

features/flights/
└── di/
    ├── types.ts
    ├── config.ts
    └── resolve.ts
```

Features that use only hook-based repositories (trips, user) have no `di/` folder — they don't need one.

**Bootstrap** — all `config.ts` files are imported once at app startup in the correct order:

```ts
// app/_layout.tsx
import 'reflect-metadata';
import '@/features/shared/di/config';
import '@/features/ai/di/config';
import '@/features/flights/di/config';
```

**Usage** — import from the owning feature's `resolve.ts`. The import path makes ownership explicit:

```ts
import { logger } from '@/features/shared/di/resolve';
import { aiClient } from '@/features/ai/di/resolve';
```

Never instantiate services directly — always import from the feature's `di/resolve.ts`.

---

## DI Patterns

### Pattern 1 — tsyringe singletons

Used for: Logger, Storage, AI client, HTTP client, image repositories.

Stateless, no React lifecycle dependency, safe to resolve once at startup.

| Layer | Location |
|---|---|
| Interface | `features/<name>/domain/entities/services/IXxx.ts` |
| Implementation | `features/<name>/data/services/Xxx.ts` (`@singleton()`) |
| Library wrapper | `features/<name>/libraries/xxxClient.ts` |
| DI types | `features/<name>/di/types.ts` |
| DI config | `features/<name>/di/config.ts` |
| DI resolve | `features/<name>/di/resolve.ts` |

### Pattern 2 — Hook-based repositories

Used for: all Convex queries and mutations (trips, user).

Convex is reactive by design. `useQuery` establishes a real-time subscription and depends on Clerk auth context from `ConvexProviderWithClerk`. This cannot be replicated in a class singleton without losing reactivity and breaking auth.

| Layer | Location |
|---|---|
| Interface | `features/<name>/domain/entities/repositories/IXxxRepository.ts` |
| Implementation | `features/<name>/data/repositories/useConvexXxxRepository.ts` (hook) |
| Consumed by | `features/<name>/hooks/useXxx.ts` |

No DI container entry needed — the hook is the injection mechanism.

---

## Global UI (`/ui`)

Reusable building blocks shared across multiple features.

```
ui/
├── components/
│   ├── basic/      → Atomic: CustomButton, CustomText, CustomIcon, CustomTextInput…
│   ├── composite/  → Composed: CustomHeader, CustomScrollView, PlacesAutocomplete…
│   ├── dialogs/    → Modals: ActionModal, InfoModal, ResetPasswordModal…
│   └── view/       → Page wrappers: BasicView
├── style/          → Design tokens: colors, fonts, spacing, shadows, animations
└── assets/         → Static files: images/, fonts/, lottie/
```

---

## `app/` — Routing

Expo Router uses file-based routing. Route files are **thin entry points** — they import and render a `Page` component from `features/`.

```
app/
└── (main)/
    ├── (login)/           → Public screens: welcome, sign-in, sign-up
    └── (authenticated)/   → Protected screens (requires Clerk auth)
        ├── (tabs)/        → Tab navigator: home, profile
        ├── create-trip/   → Multi-step trip creation wizard
        ├── home-page/     → Show all trips
        └── profile/       → Language settings
```

---

## `convex/` — Backend

Serverless backend using Convex.

```
convex/
├── schema.ts       → Database tables: users, trips
├── users.ts        → User queries and mutations
├── trips.ts        → Trip queries and mutations
├── validators/     → Input validation
└── auth.config.ts  → Clerk authentication integration
```

---

## How a Screen Works (End to End)

```
app/(authenticated)/create-trip/search-place.tsx
  └── renders <SearchPlacePage />                         ← features/trips/ui/pages/
        ├── uses useSearchPlacePageLogic()                ← SearchPlacePage.logic.ts
        │     ├── reads/writes useTripStore()             ← features/trips/state/
        │     └── calls useGooglePlaceImages()            ← features/shared/hooks/
        │           └── googlePlacesRepository.getImage() ← features/shared/di/resolve (tsyringe)
        └── renders <PlacesAutocomplete />                ← ui/components/composite/
```

---

## Date Handling

### Storage convention

All trip dates (`startDate`, `endDate`) are stored in Convex as **`YYYY-MM-DD` strings** (ISO 8601 date-only, no time component).

### Full pipeline

```
CalendarPicker (react-native-calendar-picker)
  → Date object (midnight UTC)
  → getTimezoneFormattedDateUseCase()     adjusts to local timezone
  → tripStore.datesInfo                   stored as Date | null
  → formatDateForPromptUseCase()          extracts "YYYY-MM-DD"
  → AI model (Gemini)                     receives unambiguous ISO date
  → generateTripSchema (Zod)              .transform(normalizeDateToISOUseCase) as safety net
  → Convex DB                             always stored as "YYYY-MM-DD"
  → translateDate(locale, "YYYY-MM-DD")   formats for display
  → UI
```

### Utilities (`features/dates/useCases/`)

| File | Purpose | Input → Output |
|---|---|---|
| `getTodayInLocalTimezoneUseCase` | Current date in local timezone. **Module-level constant** (evaluated once at import time). | — → `Date` |
| `getTimezoneFormattedDateUseCase` | Adjusts a `Date` by subtracting the timezone offset so it represents local time correctly. | `Date` → `Date` |
| `convertFromUTCToLocaleUseCase` | Formats full UTC datetime strings into `"DD MMMM YYYY"`. Not used for trip date strings. | `string (datetime)` → `string` |
| `getTranslatedDate` (`translateDate`) | Parses a `Date` or date string and returns a locale-specific display string. | `Date \| string` → `string` |
| `normalizeDateToISOUseCase` | Converts `DD/MM/YYYY` → `YYYY-MM-DD`. Pass-through for already-correct formats. Used as Zod transform. | `string` → `string` |
| `formatDateForPromptUseCase` | Extracts `YYYY-MM-DD` from a timezone-adjusted `Date` for AI prompt placeholders. | `Date \| null` → `string` |

### Comparing dates

ISO date strings are lexicographically sortable — string comparison is correct and avoids timezone issues:

```ts
const todayStr = getTodayInLocalTimezoneUseCase.toISOString().split('T')[0];
trips.filter(trip => trip.startDate >= todayStr);
```

---

## Rules

1. **Dependencies point inward.** `ui` → `hooks` / `state` → `useCases` → `domain`. Never the reverse.
2. **`domain/` is pure.** No external library imports, no framework code, no side effects.
3. **`data/` owns external systems.** Only `data/` imports from Convex, ky, MMKV, SDKs.
4. **`libraries/` isolates third-party APIs.** `data/` uses library wrappers, never raw libraries directly.
5. **Schemas in `domain/schemas/`.** Zod schemas define domain rules — they are not infra concerns.
6. **Adapters transform, validators execute.** Adapters convert DTOs to entities; validators run schemas against data.
7. **Pages are thin.** All logic in `.logic.ts` hooks, all styles in `.style.ts` files.
8. **Feature state in `state/`.** Global state (store utils, app state, modal state) in `features/shared/state/`.
9. **Never instantiate services directly.** Always import from the feature's `di/resolve.ts`.
10. **Convex = hook-based repositories.** Never wrap Convex hooks in a class singleton.

---

## Path Aliases

| Alias | Resolves to |
|---|---|
| `@/*` | project root |
| `@ui/*` | `ui/` |
