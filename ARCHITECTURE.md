# Architecture

## Philosophy

This project follows a **feature-first Clean Architecture**. Each self-contained piece of functionality lives in its own feature folder with a consistent internal structure. Dependencies always point inward: `ui` → `hooks` / `state` → `useCases` → `domain`. Nothing in `domain` ever imports from `data`, `hooks`, `state`, or `ui`.

The app uses two complementary dependency injection patterns:

- **IoC container singletons** (e.g. tsyringe) for stateless services: Logger, Storage, AI client, HTTP client, image repositories. These are registered once at app startup inside each feature's own `di/` folder and resolved via the feature's `di/resolve.ts`.
- **Hook-based repositories** for reactive backend data access (e.g. Convex). The backend client exposes reactive hooks that subscribe to real-time updates and depend on the auth context provided by the app's auth provider (e.g. Clerk). Forcing them into a class singleton would lose reactivity and break auth. Repository interfaces are defined in `domain/` and implemented as hooks in `data/repositories/`.

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
  deleteTrip(tripId: string): Promise<void>;
}
```

##### `domain/entities/services/`

Service interfaces. While repository interfaces define contracts for **data access** (how to read and write domain data), service interfaces define contracts for **capabilities** — cross-cutting concerns that a feature needs but doesn't own the implementation of.

A feature declares "I need to be able to log things" or "I need to generate AI content" without caring how it works. The interface is the contract; `data/services/` provides the implementation and the IoC container wires them together. This means the implementation can change (e.g. swap a console logger for a remote logging service) without touching any feature code.

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

Schema definitions. Schemas are a domain concern because they describe what valid data looks like for this feature. They serve as the single source of truth for both runtime validation and TypeScript types derived via type inference.

`data/validators/` uses these schemas to execute validation. The schema itself does not run validation — it only defines the rules.

**Why not abstract the schema library behind an interface?** The schema library (e.g. Zod) acts as a type-system extension for TypeScript rather than a swappable infrastructure dependency. Type inference from schemas (e.g. `z.infer<>`) is the mechanism that derives static types from schema definitions — abstracting it away would mean duplicating every type definition separately, which defeats the purpose. The separation that matters is already in place: schemas *define* rules here in `domain/schemas/`, validators *run* them in `data/validators/`. If the schema library ever changes, only those two locations need updating — no feature code is affected.

```ts
// features/trips/domain/schemas/GenerateTripSchema.ts
// e.g. using Zod
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

Concrete implementations of everything defined in `domain/`. This layer knows about external systems — reactive backends (e.g. Convex), HTTP APIs, device storage, SDKs. It imports from `domain/` but `domain/` never imports from `data/`.

#### `data/dto/`

Data Transfer Objects. Raw data shapes that come from external sources — HTTP responses, backend query results (e.g. Convex), third-party APIs. DTOs live in `data/` because they represent the external world's format, not the app's domain language. The domain layer is completely unaware of them — only `data/adapters/` consumes DTOs to transform them into domain entities.

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

For **reactive backends** (e.g. Convex), repositories are implemented as hooks — not classes. This preserves real-time subscriptions and auth context, which would be lost in a class singleton:

```ts
// features/trips/data/repositories/useTripRepository.ts
// e.g. using Convex + Clerk
export const useTripRepository = (): ITripRepository => {
  const { user } = useAuthUser();
  const trips = useReactiveQuery(api.trips.getAllByUserId, { userId: user?.id ?? '' });
  const createMutation = useMutation(api.trips.create);
  const toggleMutation = useMutation(api.trips.toggleFavorite);

  return {
    getUserTrips: () => trips,
    createTrip: (data) => createMutation(data),
    toggleFavorite: (tripId) => toggleMutation({ tripId }),
  };
};
```

For **HTTP APIs** (non-reactive), repositories are singleton classes registered in the IoC container:

```ts
// features/shared/data/repositories/ImageRepository.ts
// registered as singleton in di/config.ts (e.g. using tsyringe @singleton())
export class ImageRepository implements IImageRepository {
  constructor(private http: IHttpClient) {}

  async getImage(placeName: string, urlType: UrlType): Promise<string> {
    const data = await this.http.get('/search/photos', { query: placeName }).json();
    return data.results[0]?.urls[urlType] ?? noImage;
  }
}
```

#### `data/services/`

Implementations of service interfaces from `domain/entities/services/`. These are stateless, registered as singletons in the IoC container, and may use `libraries/` wrappers internally.

```ts
// features/shared/data/services/Logger.ts
// registered as singleton in di/config.ts (e.g. using tsyringe @singleton())
export class Logger implements ILogger {
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

Functions that execute validation — running schemas (e.g. Zod `.parse()`) against untrusted input, checking business rules, sanitizing data. Validators use schemas from `domain/schemas/` as their rules.

```ts
// features/trips/data/validators/validateGeneratedTrip.ts
export const validateGeneratedTrip = (data: unknown): GeneratedTrip => {
  return generateTripSchema.parse(data);
};
```

---

### `libraries/`

Thin wrappers around external libraries. No business logic — only API normalization and simplification. The goal is to isolate the app from third-party library APIs so that swapping a library only requires changing its wrapper, not every file that uses it.

`data/services/` and `data/repositories/` always use library wrappers, never raw libraries directly.

```ts
// features/shared/libraries/httpClient.ts
// e.g. wrapping ky
export const httpClient = ky.create({
  timeout: 10_000,
  retry: 1,
});
```

```ts
// features/shared/libraries/storageClient.ts
// e.g. wrapping MMKV
export const storageClient = new MMKV({
  id: 'app-storage',
  encryptionKey: '...',
});
```

---

### `useCases/`

Application logic that orchestrates domain entities, repositories, and services to perform a specific action or compute a specific result. Use cases contain business rules that don't belong to any single entity.

**All use cases are classes**, registered in the feature's `di/` folder. This ensures consistency — adding a dependency later only requires updating the constructor and DI config, not the calling code.

Use cases can depend on both **repository interfaces** (data access) and **service interfaces** (capabilities) — both are infrastructure concerns injected via their interfaces.

Use cases with no external dependencies have an empty constructor. They still receive runtime data as method parameters:

```ts
// features/trips/useCases/GetUpcomingTripUseCase.ts
// registered in di/config.ts
export class GetUpcomingTripUseCase {
  execute(trips: Trip[]): Trip | undefined {
    const today = getTodayInLocalTimezoneUseCase.toISOString().split('T')[0];
    return trips
      .filter(trip => trip.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  }
}
```

Use cases that need services inject them via the constructor:

```ts
// features/trips/useCases/GenerateTripUseCase.ts
// registered in di/config.ts
export class GenerateTripUseCase {
  constructor(
    private aiService: IAiService,  // service
    private logger: ILogger,        // service
  ) {}

  async execute(formData: TripFormData): Promise<GeneratedTrip> {
    try {
      const prompt = buildPromptUseCase(formData);
      return await this.aiService.generateObject(prompt, generateTripSchema, AiModel.Default);
    } catch (error) {
      this.logger.error(ensureError(error));
      throw error;
    }
  }
}
```

Note that `GenerateTripUseCase` handles AI generation but knows nothing about the reactive backend. Saving the result is handled by the repository, coordinated at the **hook layer**:

```ts
// features/trips/hooks/useGenerateTrip.ts
import { generateTripUseCase, getUpcomingTripUseCase } from '@/features/trips/di/resolve';

export const useGenerateTrip = () => {
  const repo = useTripRepository();                       // reactive backend hook

  const generate = async (formData: TripFormData) => {
    const generated = await generateTripUseCase.execute(formData);  // IoC use case
    await repo.createTrip(generated);                               // reactive repo
  };

  return { generate };
};
```

This keeps each layer focused: use cases handle business logic, repositories handle data persistence, hooks coordinate them.

---

### `hooks/`

Feature hooks exist for **reusable composition** — they follow the same promotion rule as components: start logic local in `.logic.ts`, and promote it to a feature hook only when the same combination of repositories, use cases, or data is needed in more than one page, or when the composition is complex enough to justify naming it.

Feature hooks can import hook-based repositories, IoC-resolved use cases and services, and other feature hooks.

```ts
// features/trips/hooks/useGetUserTrips.ts
import { getUpcomingTripUseCase } from '@/features/trips/di/resolve';

export const useGetUserTrips = () => {
  const repo = useTripRepository();
  const trips = repo.getUserTrips();

  return {
    isLoading: trips === undefined,
    upcomingTrip: trips ? getUpcomingTripUseCase.execute(trips) : undefined,
    totalTrips: trips?.length ?? 0,
    favouriteTrips: trips?.filter(t => t.isFavorite) ?? [],
    getTripById: (id: string) => trips?.find(t => t.id === id),
  };
};
```

```ts
// features/trips/hooks/useGenerateTrip.ts
import { generateTripUseCase } from '@/features/trips/di/resolve';

export const useGenerateTrip = () => {
  const repo = useTripRepository();

  const generate = async (formData: TripFormData) => {
    const generated = await generateTripUseCase.execute(formData);
    await repo.createTrip(generated);
  };

  return { generate };
};
```

For **IoC-resolved services** consumed directly in hooks (without a repository):

```ts
// features/shared/hooks/useAiGeneration.ts
import { aiClient } from '@/features/ai/di/resolve';

export const useAiGeneration = () => ({
  generateObject: (prompt: string, schema: Schema, model: AiModel) =>
    aiClient.generateObject(prompt, schema, model),
});
```

---

### `state/`

State stores (e.g. Zustand) for UI state that belongs to this feature. Only domain-specific state lives here — wizard steps, selected options, local UI flags. Cross-cutting global state (app theme, modal visibility, store utilities) lives in `features/shared/state/`.

```ts
// features/trips/state/tripStore.ts
export const useTripStore = createStore<TripState & TripActions>(set => ({
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

React Native components and pages for this feature. `.tsx` files only import from `hooks/`, `state/`, and the global `ui/` — never directly from `domain/`, `data/`, or `useCases/`.

#### `ui/components/`

Feature-specific React Native components. They follow a **promotion rule**: a component always starts in the feature that needs it. The moment a second feature needs the same component, it gets promoted to the global `ui/components/`. This prevents premature abstraction while keeping duplication visible — before building a new component, check `ui/components/` first, then the feature you're drawing inspiration from.

#### `ui/pages/`

Full screens. Each page is split into three files to keep concerns separated:

```
PageName/
├── PageName.tsx        → JSX only — layout and rendering, no logic
├── PageName.logic.ts   → custom hook with all state, handlers, derived data
└── PageName.style.ts   → StyleSheet definitions
```

`PageName.tsx` never imports repositories, use cases, or domain entities directly. All logic lives in `PageName.logic.ts`, which acts as the page's **ViewModel**. It can import:
- **Feature hooks** (`features/<name>/hooks/`) — for reused data and actions
- **Hook-based repositories** (`features/<name>/data/repositories/`) — for page-specific reactive data (when not shared across pages)
- **IoC-resolved use cases** (`features/<name>/di/resolve`) — for page-specific business logic (when not shared across pages)
- **State** (`features/<name>/state/`) — for local UI state

When the same combination of repositories + use cases appears in more than one page, promote it to a feature hook in `hooks/`.

```ts
// ✅ PageName.logic.ts — using a feature hook (logic shared across pages)
import { useGetUserTrips } from '@/features/trips/hooks/useGetUserTrips';
import { useTripStore } from '@/features/trips/state/tripStore';

export const usePageNameLogic = () => {
  const { upcomingTrip, isLoading } = useGetUserTrips();  // reused → promoted to feature hook
  const { actions } = useTripStore();                     // local UI state

  return { upcomingTrip, isLoading, actions };
};
```

```ts
// ✅ PageName.logic.ts — using a hook-based repo directly (page-specific logic)
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';
import { getUpcomingTripUseCase } from '@/features/trips/di/resolve';

export const usePageNameLogic = () => {
  const repo = useTripRepository();
  const trips = repo.getUserTrips();
  const upcoming = trips ? getUpcomingTripUseCase.execute(trips) : undefined;

  return { upcoming, isLoading: trips === undefined };
};
```

```ts
// ❌ PageName.logic.ts — never imports IoC repositories directly
import { imageRepository } from '@/features/shared/di/resolve';
```

---

## DI Container

Each feature that has injectable singletons owns its DI configuration. There is no global `di/` folder — configuration lives alongside the code it belongs to.

```
features/shared/
└── di/
    ├── types.ts    → SHARED_TYPES = { Logger: Symbol.for('Logger'), Storage: Symbol.for('Storage'), … }
    ├── config.ts   → container.registerSingleton(SHARED_TYPES.Logger, Logger)
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

Features that use only hook-based repositories (e.g. trips, user) have no `di/` folder — they don't need one.

**Bootstrap** — all `config.ts` files are imported once at app startup in the correct order:

```ts
// app/_layout.tsx
import 'reflect-metadata'; // e.g. required by tsyringe
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

### Pattern 1 — IoC container singletons (e.g. tsyringe)

Used for: services, HTTP-based repositories, and use cases. Stateless, no React lifecycle dependency, safe to resolve once at startup.

All three follow the same three-file DI pattern inside the owning feature's `di/` folder:

**Services** (e.g. Logger, Storage, AI client):

| Layer | Location |
|---|---|
| Interface | `features/<name>/domain/entities/services/IXxx.ts` |
| Implementation | `features/<name>/data/services/Xxx.ts` |
| Library wrapper | `features/<name>/libraries/xxxClient.ts` |
| DI types / config / resolve | `features/<name>/di/` |

**HTTP-based repositories**:

| Layer | Location |
|---|---|
| Interface | `features/<name>/domain/entities/repositories/IXxxRepository.ts` |
| Implementation | `features/<name>/data/repositories/XxxRepository.ts` |
| DI types / config / resolve | `features/<name>/di/` |

**Use cases**:

| Layer | Location |
|---|---|
| Class | `features/<name>/useCases/XxxUseCase.ts` |
| DI types / config / resolve | `features/<name>/di/` |

### Pattern 2 — Hook-based repositories (e.g. Convex)

Used for: reactive backend data access (queries and mutations).

The reactive backend client (e.g. Convex) exposes hooks that establish real-time subscriptions tied to the auth provider context (e.g. Clerk). This cannot be replicated in a class singleton without losing reactivity and breaking auth.

| Layer | Location |
|---|---|
| Interface | `features/<name>/domain/entities/repositories/IXxxRepository.ts` |
| Implementation | `features/<name>/data/repositories/useXxxRepository.ts` (hook) |
| Consumed by | `features/<name>/hooks/useXxx.ts` or `PageName.logic.ts` (page-specific) |

No IoC container entry needed — the hook is the injection mechanism.

---

## Global UI (`/ui`)

Reusable building blocks shared across multiple features.

```
ui/
├── components/
│   ├── basic/      → Atomic: buttons, text, icons, inputs…
│   ├── composite/  → Composed: headers, scroll views, autocomplete…
│   ├── dialogs/    → Modals and overlays
│   └── view/       → Page wrapper components
├── style/          → Design tokens: colors, fonts, spacing, shadows, animations
└── assets/         → Static files: images/, fonts/, lottie/
```

---

## `app/` — Routing

File-based routing. Route files are **thin entry points** — they import and render a `Page` component from `features/`.

```
app/
└── (main)/
    ├── (login)/           → Public screens: welcome, sign-in, sign-up
    └── (authenticated)/   → Protected screens (requires auth)
        ├── (tabs)/        → Tab navigator: home, profile
        ├── create-trip/   → Multi-step trip creation wizard
        ├── home-page/     → Show all trips
        └── profile/       → Language settings
```

---

## Backend (`/convex`)

Serverless backend functions and database schema.

```
convex/
├── schema.ts       → Database tables: users, trips
├── users.ts        → User queries and mutations
├── trips.ts        → Trip queries and mutations
├── validators/     → Input validation
└── auth.config.ts  → Auth provider integration
```

---

## How a Screen Works (End to End)

```
app/(authenticated)/create-trip/search-place.tsx
  └── renders <SearchPlacePage />                         ← features/trips/ui/pages/
        ├── uses useSearchPlacePageLogic()                ← SearchPlacePage.logic.ts
        │     ├── reads/writes useTripStore()             ← features/trips/state/
        │     └── calls useGooglePlaceImages()            ← features/shared/hooks/
        │           └── imageRepository.getImage()        ← features/shared/di/resolve (IoC container)
        └── renders <PlacesAutocomplete />                ← ui/components/composite/
```

---

## Date Handling

### Storage convention

All trip dates (`startDate`, `endDate`) are stored as **`YYYY-MM-DD` strings** (ISO 8601 date-only, no time component).

### Full pipeline

```
Date picker
  → Date object (midnight UTC)
  → getTimezoneFormattedDateUseCase()     adjusts to local timezone
  → tripStore.datesInfo                   stored as Date | null
  → formatDateForPromptUseCase()          extracts "YYYY-MM-DD"
  → AI model                              receives unambiguous ISO date
  → generateTripSchema                    schema transform as safety net
  → Database                              always stored as "YYYY-MM-DD"
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
| `normalizeDateToISOUseCase` | Converts `DD/MM/YYYY` → `YYYY-MM-DD`. Pass-through for already-correct formats. Used as schema transform. | `string` → `string` |
| `formatDateForPromptUseCase` | Extracts `YYYY-MM-DD` from a timezone-adjusted `Date` for AI prompt placeholders. | `Date \| null` → `string` |

### Comparing dates

ISO date strings are lexicographically sortable — string comparison is correct and avoids timezone issues:

```ts
const todayStr = getTodayInLocalTimezoneUseCase.toISOString().split('T')[0];
trips.filter(trip => trip.startDate >= todayStr);
```

---

## Rules

1. **Dependencies point inward.** `ui` → `hooks` / `state` → `useCases` → `domain`. Never the reverse. See import rules below.

   | Layer | Can import |
   |---|---|
   | `.tsx` | feature hooks, state |
   | `.logic.ts` (ViewModel) | feature hooks, hook-based repos, IoC use cases, state |
   | `features/<name>/hooks/` | hook-based repos, IoC use cases, IoC services, other feature hooks |
   | `useCases/` | IoC repository interfaces, IoC service interfaces, domain entities |
   | `data/repositories/` | domain interfaces, DTOs, adapters |

   **The one rule that never bends: IoC repositories must only be imported inside `useCases/` — never in `.logic.ts`, `hooks/`, or anywhere in `ui/`.**
2. **`domain/` is pure.** No external library imports, no framework code, no side effects.
3. **`data/` owns external systems.** Only `data/` imports from backend clients (e.g. Convex), HTTP libraries (e.g. ky), device storage SDKs (e.g. MMKV).
4. **`libraries/` isolates third-party APIs.** `data/` uses library wrappers, never raw libraries directly.
5. **Schemas in `domain/schemas/`.** Schemas (e.g. Zod) define domain rules — they are not infrastructure concerns.
6. **Adapters transform, validators execute.** Adapters convert DTOs to entities; validators run schemas against data.
7. **Pages are thin.** All logic in `.logic.ts` hooks, all styles in `.style.ts` files.
8. **Feature state in `state/`.** Global state (store utils, app state, modal state) in `features/shared/state/`.
9. **Never instantiate services directly.** Always import from the feature's `di/resolve.ts`.
10. **Reactive backends = hook-based repositories.** Never wrap reactive backend hooks (e.g. Convex `useQuery`) in a class singleton.
