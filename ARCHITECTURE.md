# Architecture

## Guiding Principles

- **Feature-first** — code is grouped by business capability, not by technical layer. Open a feature folder and understand its full scope end to end.
- **Inward dependencies** — outer layers depend on inner ones, never the reverse. `ui` → `facades/hooks/state` → `useCases` → `domain`.
- **Abstraction over coupling** — feature code depends on interfaces, not concrete implementations. Swapping a library only affects its wrapper, not any feature.
- **Two DI modes** — IoC container for stateless singletons (services, HTTP repos); hook-based repositories for reactive backends that require React lifecycle and auth context.
- **Feature isolation** — features communicate only through `features/shared/` or another feature's explicit public API (`index.ts`). Internal folders are never imported across features.
- **Start simple, promote when needed** — components, facades, and hooks start local. They move to a shared location only when a second consumer appears.

---

## Philosophy

This project follows a **feature-first Clean Architecture**. Each self-contained piece of functionality lives in its own feature folder with a consistent internal structure. Dependencies always point inward: `ui` → `facades` / `hooks` / `state` → `useCases` → `domain`. Nothing in `domain` ever imports from `data`, `facades`, `hooks`, `state`, or `ui`.

The app uses two complementary dependency injection patterns:

- **IoC container singletons** (e.g. tsyringe) for stateless services: Logger, Storage, AI client, HTTP client, image repositories. These are registered once at app startup inside each feature's own `di/` folder and resolved via the feature's `di/resolve.ts`.
- **Hook-based repositories** for reactive backend data access (e.g. Convex). The backend client exposes reactive hooks that subscribe to real-time updates and depend on the auth context provided by the app's auth provider (e.g. Clerk). Forcing them into a class singleton would lose reactivity and break auth. Repository interfaces are defined in `domain/` and implemented as hooks in `data/repositories/`.

### What is an IoC container?

An **IoC (Inversion of Control) container** is a tool that manages the creation and wiring of class dependencies automatically. Without it, a class that needs a Logger and an HTTP client would have to create them itself (`new Logger()`, `new HttpClient()`) — tightly coupling it to concrete implementations. With an IoC container, the class simply declares what it needs in its constructor (typed to interfaces), and the container resolves and injects the right implementations at startup. This means:

- Classes never call `new` on their dependencies
- Swapping an implementation (e.g. a remote logger replacing the console logger) requires changing only the DI registration, not the class
- Testing becomes trivial — pass mock implementations directly to the constructor, no container needed

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
│   ├── dtos/
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
├── facades/
├── hooks/
├── state/
└── ui/
    ├── components/
    └── pages/
```

---

## `features/shared/`

`features/shared/` is the **designated shared feature** — it owns cross-cutting infrastructure (logger, storage, HTTP client, image repositories) and shared utilities (`createStore`, global state, shared hooks). Like every other feature, it exposes a public `index.ts`. Consumers always import from `@/features/shared`, never from its internal sub-paths directly.

Every feature is **isolated**: `features/trips/` cannot reach into `features/user/` internals. If logic or types are needed across features, they either:

- Move into `features/shared/`
- Or are exposed via the target feature's **public API** — an `index.ts` at the feature root that explicitly declares what is shareable

Not every feature needs an `index.ts` — only create one when another feature actually needs to import from it.

### What belongs in a feature's public API (`index.ts`)

| Can export | Why |
|---|---|
| Domain entities and types | Consumers need them to type-check data received from this feature |
| Facades | Ready-to-use hooks that expose data and actions cleanly |
| Utility hooks | Reusable hooks that are genuinely useful to other features |

| Must NOT export | Why |
|---|---|
| Hook-based repositories | Internal data access — consumers must go through facades, never call repos directly |
| Class use cases | Internal business logic — resolved via the feature's own DI container, not consumed cross-feature |
| DTOs | Internal wire format — domain entity types are the shared language, not API shapes |
| Adapters | Internal transformation — no consumer ever needs to transform another feature's data |
| Validators | Internal data validation — consumers receive already-validated domain entities |
| Schemas | Internal domain rules — consumers work with types, not schema definitions |
| `di/resolve.ts` exports | DI internals — IoC resolution is always local to the owning feature |
| State stores | Internal UI state — other features have no business reading or writing another feature's state |
| `libraries/` wrappers | Internal infrastructure — third-party library wrappers are an implementation detail |
| UI components | Promoted to global `ui/components/` when truly shared — never exported from a feature's public API |
| Repository interfaces (`IXxxRepository`) | Internal contracts — the consuming feature needs the facade, not the plumbing behind it |

```ts
// features/user/index.ts
export type { User } from './domain/entities/User';           // ✅ domain type
export { useGetUserStatus } from './facades/useGetUserStatus'; // ✅ facade

// never exported:
// export { useTripRepository } from './data/repositories/...' ❌
// export { getUserUseCase } from './di/resolve'              ❌
// export { UserResponseDTO } from './data/dtos/...'          ❌
```

### What a consuming feature can import

```ts
// ✅ Import domain types from another feature's public API
import type { User } from '@/features/user';

// ✅ Import facades from another feature's public API
import { useGetUserStatus } from '@/features/user';

// ✅ Import from shared via its public API
import { useUnsplashImages, logger } from '@/features/shared';

// ❌ Never reach into another feature's internal folders
import { useTripRepository } from '@/features/user/data/repositories/useConvexUserRepository';
```

### When to use `shared/` vs `index.ts`

| Scenario | Solution |
|---|---|
| Logic or type needed by many features | Move to `features/shared/` |
| Logic or type needed by one specific feature | Expose via `index.ts` of the owning feature |
| UI component needed by many features | Promote to global `ui/components/` |
| UI component needed by one other feature | Before sharing, ask: does the other feature need the component itself, or just the data? If it just needs the data, it can build its own version. If the component is truly needed as-is, promote it to global `ui/components/` — never export UI components via `index.ts` |

---

## Folder Purposes

### `domain/`

The core of the feature. Contains only pure TypeScript — no external library imports, no side effects, no framework code. Everything here is stable and fully independent of infrastructure decisions.

#### `domain/entities/`

Pure domain models — TypeScript interfaces, types, and constants that represent the concepts of this feature in the app's own language, not in an external API's language.

**`interface` vs `type`**
- Use `interface` for object shapes that represent a domain entity — they are readable, clearly named, and easy to extend if needed.
- Use `type` for unions, aliases, or intersections — anything that is not a plain object shape.

```ts
interface Trip { id: string; destination: string; }  // ✅ entity shape → interface
type TripStatus = 'upcoming' | 'past' | 'ongoing';   // ✅ union → type
type TripWithStatus = Trip & { status: TripStatus };  // ✅ intersection → type
```

**`enum` vs `const`**
Avoid TypeScript `enum` — it generates unexpected runtime code, behaves differently between regular and `const enum`, and does not tree-shake well. Use a `const` object with `as const` instead:

```ts
// ❌ Avoid
enum BudgetLevel { Cheap = 'Cheap', Moderate = 'Moderate', Luxury = 'Luxury' }

// ✅ Prefer
export const BudgetLevel = {
  Cheap: 'Cheap',
  Moderate: 'Moderate',
  Luxury: 'Luxury',
} as const;
export type BudgetLevel = typeof BudgetLevel[keyof typeof BudgetLevel];
```

This gives you the same autocompletion and exhaustive checks, with plain string values and zero runtime surprises.

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

The infrastructure layer. `data/` implements the contracts defined in `domain/` and owns all external-world concerns — HTTP APIs, reactive backends (e.g. Convex), device storage, SDKs, data transformation. It imports from `domain/` but `domain/` never imports from `data/`.

This follows the **Dependency Inversion Principle**: both `domain/` and `data/` depend on the interface defined in `domain/` — `data/` never dictates how `domain/` works.

#### `data/dtos/`

Data Transfer Objects. Raw data shapes that come from external sources — HTTP responses, backend query results (e.g. Convex), third-party APIs. DTOs live in `data/` because they represent the external world's format, not the app's domain language. The domain layer is completely unaware of them — only `data/adapters/` consumes DTOs to transform them into domain entities.

```ts
// features/trips/data/dtos/TripResponseDTO.ts
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

**Naming convention:** class-based repositories are named `XxxRepository.ts`; hook-based repositories are prefixed with `use` following the React convention: `useXxxRepository.ts`. This makes the pattern immediately visible without needing a subfolder — a feature rarely has both types simultaneously.

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
import type { TripResponseDTO } from '@/features/trips/data/dtos/TripResponseDTO';
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

Plain functions that execute validation — running schemas against untrusted input, checking business rules, or sanitizing data. Always plain functions, never classes.

When validation is based on a schema (e.g. Zod):

```ts
// features/trips/data/validators/validateGeneratedTrip.ts
export const validateGeneratedTrip = (data: unknown): GeneratedTrip => {
  return generateTripSchema.parse(data);
};
```

When validation is pure TypeScript business logic with no schema:

```ts
// features/trips/data/validators/validateTripDates.ts
export const validateTripDates = (startDate: string, endDate: string): boolean => {
  return startDate <= endDate;
};

// features/trips/data/validators/validateTravelersCount.ts
export const validateTravelersCount = (count: number): boolean => {
  return count >= 1 && count <= 20;
};
```

---

### `libraries/`

Thin wrappers around external libraries. No business logic — only API normalization and simplification. The goal is to isolate the app from third-party library APIs so that swapping a library only requires changing its wrapper, not every file that uses it.

`data/services/` and `data/repositories/` always use library wrappers, never raw libraries directly.

**How to decide if a library needs a wrapper:** ask "if I swap this library for another, how many files change?" If the answer is more than one file, the library needs a wrapper. That wrapper becomes the only file to update on swap.

Wrap when the library:
- Is used in multiple places (e.g. an HTTP client used by several repositories)
- Is core infrastructure (e.g. a storage SDK used across the app)
- Has a complex API you want to normalize (e.g. an HTTP factory with caching and auth)

Do **not** wrap:
- Type-only imports — no runtime coupling
- React / React Native built-ins (`StyleSheet`, `View`, etc.)
- Libraries that are already abstractions by design (e.g. React Query's `useQuery` is itself the abstraction layer — wrapping it adds nothing)

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

Note that `GenerateTripUseCase` handles AI generation but knows nothing about the reactive backend. Saving the result is handled by the repository, coordinated at the **facade layer**:

```ts
// features/trips/facades/useGenerateTrip.ts
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

This keeps each layer focused: use cases handle business logic, repositories handle data persistence, facades coordinate them.

#### IoC repositories — full consumption chain

An IoC (class-based) repository is injected into a use case and never escapes that boundary. This is how it flows end to end:

```ts
// 1. Interface — features/shared/domain/entities/repositories/IImageRepository.ts
export interface IImageRepository {
  getImage(placeName: string, urlType: UrlType): Promise<string>;
}

// 2. Use case — features/shared/useCases/GetPlaceImageUseCase.ts
// registered in di/config.ts (e.g. using tsyringe @injectable())
export class GetPlaceImageUseCase {
  constructor(private imageRepository: IImageRepository) {}  // IoC repo injected

  async execute(placeName: string, urlType: UrlType): Promise<string> {
    return this.imageRepository.getImage(placeName, urlType);
  }
}

// 3. Resolved — features/shared/di/resolve.ts
export const getPlaceImageUseCase =
  container.resolve<GetPlaceImageUseCase>(SHARED_TYPES.GetPlaceImageUseCase);

// 4a. Consumed via facade (when reused across pages)
// features/shared/facades/useGetPlaceImage.ts
import { getPlaceImageUseCase } from '@/features/shared/di/resolve';

export const useGetPlaceImage = (placeName: string) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    getPlaceImageUseCase.execute(placeName, 'regular').then(setUrl);
  }, [placeName]);

  return url;
};

// 4b. Or consumed directly in .logic.ts (page-specific)
import { getPlaceImageUseCase } from '@/features/shared/di/resolve';

export const useSearchPlaceLogic = () => {
  const handleSelect = async (place: string) => {
    const url = await getPlaceImageUseCase.execute(place, 'regular');
    // ...
  };
  return { handleSelect };
};
```

```ts
// ❌ Never import an IoC repository directly in a facade, hook, or .logic.ts
import { imageRepository } from '@/features/shared/di/resolve';  // breaks the rule
```

The key distinction from hook-based repositories: an IoC repository is a class singleton resolved once at startup. It has no React lifecycle and can be called anywhere — but it must always be called through a use case, never directly. A hook-based repository (e.g. Convex) is different: it is a React hook itself and can be called directly in facades.

---

### `facades/`

Facades are **coordination hooks** — they combine hook-based repositories and class use cases into a single, named React hook. The name comes from the Facade design pattern: a simplified interface over a complex subsystem. Callers don't need to know that getting upcoming trips requires both a Convex subscription and a filtering use case — the facade handles it.

**Naming:** facades follow the standard React hook naming convention — `useXxx`. The `facades/` folder is the distinguisher, not the name. Adding a suffix like `useXxxFacade` would be verbose and redundant. Other projects (e.g. NX feature libraries, Angular service facades) use the folder or module boundary to signal the pattern, not the name itself.

**What facades can import:** hook-based repositories, class use cases from `di/resolve.ts`, other facades.

**Why not IoC services?** If a facade needs a service (e.g. logging), that service call belongs inside a use case — not the facade. The facade's only job is coordination: it calls use cases for business logic and hook-based repos for reactive data. Mixing service calls in a facade blurs that boundary.

**Why not IoC repositories?** IoC repositories must always be accessed through use cases, which act as gatekeepers — they validate, log, apply rules. A facade that calls an IoC repository directly bypasses all of that.

**Where does a facade live?**
- Logic specific to one feature → `features/<name>/facades/`
- Logic reused across multiple features → `features/shared/facades/`

**Promotion rule:** every hook-based repository access lives in a facade — even for page-specific logic. The promotion question is about the facade itself: if the same facade would be duplicated across two pages, extract it to `facades/` and import it from both. If it's new logic, write it directly in `facades/` from the start.

**Concrete examples:**

Stay in `.logic.ts` as a direct facade call (not promoted yet):
```ts
// Only TripDetailPage needs this exact combination
export const useTripDetailLogic = () => {
  const { getTripById } = useGetUserTrips(); // already a facade
  const trip = getTripById(tripId);
  return { trip };
};
```

Promote to `facades/` when logic is reused across pages:
```ts
// HomePageLogic and ProfilePageLogic both need upcoming trip + totals
// → extract to features/trips/facades/useGetUserTrips.ts
export const useGetUserTrips = () => {
  const repo = useTripRepository();
  const trips = repo.getUserTrips();
  return {
    upcomingTrip: trips ? getUpcomingTripUseCase.execute(trips) : undefined,
    totalTrips: trips?.length ?? 0,
    favouriteTrips: trips?.filter(t => t.isFavorite) ?? [],
  };
};
```

Promote to `facades/` even if used once when composition is complex enough to name:
```ts
// Coordinates AI generation (IoC use case) + database save (hook-based repo)
// → worth naming even if only one page uses it
// features/trips/facades/useGenerateTrip.ts
export const useGenerateTrip = () => { ... };
```

```ts
// features/trips/facades/useGetUserTrips.ts
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
// features/trips/facades/useGenerateTrip.ts — coordinates AI use case + reactive repo
import { generateTripUseCase } from '@/features/trips/di/resolve';

export const useGenerateTrip = () => {
  const repo = useTripRepository();

  const generate = async (formData: TripFormData) => {
    const generated = await generateTripUseCase.execute(formData);  // class use case
    await repo.createTrip(generated);                               // hook-based repo
  };

  return { generate };
};
```

---

### `hooks/`

Utility hooks — feature-specific stateful or derived logic that is reused across multiple pages within this feature, but does **not** coordinate repositories or use cases. If a utility hook is needed by more than one feature, promote it to `features/shared/hooks/`.

Hooks in this folder do not import from `data/repositories/`, `useCases/`, or `di/resolve.ts`. They may import domain types, state stores, and external library hooks.

```ts
// features/trips/hooks/useTripSearchFilters.ts
export const useTripSearchFilters = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const clearFilters = () => { setQuery(''); setActiveFilter('all'); };

  return { query, setQuery, activeFilter, setActiveFilter, clearFilters };
};
```

---

### `state/`

Client-side state stores (e.g. Zustand) for UI state that belongs to this feature. State is for data that lives on the client only — wizard form inputs, selected filters, modal visibility, UI flags. It is not a cache for server data: server/backend data is owned by hook-based repositories.

**When to use state vs a facade**

| Use state when | Use a facade when |
|---|---|
| Data is client-only (form inputs, UI selection, wizard step) | Data comes from the server/backend |
| Data outlives a single screen but has no server representation | Data needs to be fetched, subscribed to, or mutated on the backend |
| You need to reset or clear the data on user action | The "source of truth" is the database, not the client |

**Store structure — state + actions pattern**

All stores follow the same pattern: a typed state slice plus an `actions` object. Actions are always nested under `actions` to keep the store shape clean and make it obvious what is state vs what is a setter.

```ts
// features/trips/state/tripStore.ts
interface TripState {
  locationInfo: { name: string; coordinates?: Coordinates; };
  datesInfo: { startDate: Date | null; endDate: Date | null; totalNoOfDays: number; };
  budgetInfo: BudgetLevel;
}

interface TripActions {
  actions: {
    setLocationInfo: (info: TripState['locationInfo']) => void;
    setDatesInfo: (info: TripState['datesInfo']) => void;
    setBudgetInfo: (budget: BudgetLevel) => void;
    resetTripState: () => void;
  };
}

const initialState: TripState = {
  locationInfo: { name: '', coordinates: undefined },
  datesInfo: { startDate: null, endDate: null, totalNoOfDays: 0 },
  budgetInfo: BudgetLevel.Cheap,
};

export const useTripStore = createStore<TripState & TripActions>(set => ({
  ...initialState,
  actions: {
    setLocationInfo: (locationInfo) => set({ locationInfo }),
    setDatesInfo: (datesInfo) => set({ datesInfo }),
    setBudgetInfo: (budgetInfo) => set({ budgetInfo }),
    resetTripState: () => set(initialState),
  },
}));
```

**Selectors — avoid unnecessary re-renders**

Import only the slice of state you need. Using `createSelectors` (from `features/shared/state/`) generates fine-grained selectors so a component only re-renders when its specific slice changes:

```ts
// ✅ Only re-renders when locationInfo changes
const locationInfo = useTripStore(state => state.locationInfo);

// ✅ Always access actions via the actions key — actions never change reference
const { setLocationInfo, resetTripState } = useTripStore(state => state.actions);

// ❌ Subscribes to the entire store — re-renders on any state change
const store = useTripStore();
```

**Feature state vs global state**

| State | Location |
|---|---|
| Trip wizard inputs | `features/trips/state/` |
| Feature-specific UI flags | `features/<name>/state/` |
| App-wide theme, language | `features/shared/state/app/` |
| Modal visibility (shared modals) | `features/shared/state/modal/` |
| `createStore` / `createSelectors` utilities | `features/shared/state/` |

**Persistence**

Only persist state that cannot be reconstructed cheaply. Wizard form inputs that survive app restart are a valid use case. Derived data, cached server responses, and anything easily re-fetched should never be persisted.

---

### `ui/`

React Native components and pages for this feature. `.tsx` files only import the ViewModel, and the global `ui/` — never directly from `domain/`, `data/`, or `useCases/`.

#### `ui/components/`

```
ComponentName/
├── ComponentName.tsx        → JSX only — layout and rendering, no logic
├── ComponentName.logic.ts   → custom hook with all state, handlers, derived data (ViewModel)
└── ComponentName.style.ts   → StyleSheet definitions
```

Feature-specific React Native components. They follow a **promotion rule**: a component always starts in the feature that needs it. The moment a second feature needs the same component, it gets promoted to the global `ui/components/`. This prevents premature abstraction while keeping duplication visible — before building a new component, check `ui/components/` first, then the feature you're drawing inspiration from.

#### `ui/pages/`

Full screens. Each page is split into three files to keep concerns separated:

```
PageName/
├── PageName.tsx        → JSX only — layout and rendering, no logic
├── PageName.logic.ts   → custom hook with all state, handlers, derived data (ViewModel)
└── PageName.style.ts   → StyleSheet definitions
```

`PageName.tsx` never imports repositories, use cases, or domain entities directly. All logic lives in `PageName.logic.ts`, which **is** the page's **ViewModel** — a custom hook that provides everything the view needs: data, derived state, and action handlers.

It can import:
- **Facades** (`features/<name>/facades/`) — for reused coordination of repos + use cases
- **Hooks** (`features/<name>/hooks/`) — for reused utility logic
- **Shared hooks** (`features/shared/hooks/`) — for cross-feature utilities (images, formatting…)
- **Class use cases** (`features/<name>/di/resolve`) — for page-specific business logic (when not reused)
- **State** (`features/<name>/state/`) — for local UI state

When the same combination appears in more than one page, promote it to a facade in `facades/`.

```ts
// ✅ PageName.logic.ts — using a facade (coordination reused across pages)
import { useGetUserTrips } from '@/features/trips/facades/useGetUserTrips';
import { useTripStore } from '@/features/trips/state/tripStore';

export const usePageNameLogic = () => {
  const { upcomingTrip, isLoading } = useGetUserTrips();  // reused → promoted to facade
  const { actions } = useTripStore();                     // local UI state

  return { upcomingTrip, isLoading, actions };
};
```

```ts
// ✅ PageName.logic.ts — using a class use case directly (page-specific, not yet promoted)
import { getUpcomingTripUseCase } from '@/features/trips/di/resolve';
import { useGetUserTrips } from '@/features/trips/facades/useGetUserTrips';
import { useTripStore } from '@/features/trips/state/tripStore';

export const usePageNameLogic = () => {
  const { trips } = useGetUserTrips();                             // data via facade
  const upcoming = trips ? getUpcomingTripUseCase.execute(trips) : undefined; // page-specific logic
  const { actions } = useTripStore();

  return { upcoming, actions };
};
```

```ts
// ❌ PageName.logic.ts — never imports hook-based repositories
import { useTripRepository } from '@/features/trips/data/repositories/useTripRepository';

// ❌ PageName.logic.ts — never imports IoC repositories directly
import { imageRepository } from '@/features/shared/di/resolve';
```

---

## DI Container

Each feature that has injectable singletons owns its DI configuration. Configuration lives alongside the code it belongs to.

```
features/
├── shared/
│   └── di/
│       ├── types.ts    → SHARED_TYPES = { Logger: Symbol.for('Logger'), … }
│       ├── config.ts   → container.registerSingleton(SHARED_TYPES.Logger, Logger)
│       └── resolve.ts  → export const logger = container.resolve<ILogger>(SHARED_TYPES.Logger)
├── ai/
│   └── di/
│       ├── types.ts
│       ├── config.ts
│       └── resolve.ts
└── flights/
    └── di/
        ├── types.ts
        ├── config.ts
        └── resolve.ts

bootstrap.ts             ← project root — collects all feature DI registrations
```

Features that use only hook-based repositories (e.g. trips, user) have no `di/` folder — they don't need one.

**Bootstrap** — all feature `config.ts` files are collected in a single root-level file and imported once at app startup. `bootstrap.ts` is the **only file to update** when adding a new feature with injectable singletons:

```ts
// bootstrap.ts (project root)
import 'reflect-metadata'; // e.g. required by tsyringe
import '@/features/shared/di/config';
import '@/features/ai/di/config';
import '@/features/flights/di/config';
// adding a new feature with IoC singletons? register it here
```

```ts
// app/_layout.tsx — stays clean
import '@/bootstrap';
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

Used for: services, HTTP-based repositories, and use cases. All of these are **stateless** — they hold no mutable data between calls. Because they are stateless, registering them as singletons is correct: one instance is created at startup and reused for the entire app lifetime. If a class ever needed mutable internal state, it would need a transient lifetime (new instance per resolution) — but none of our IoC classes have that requirement.

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
| Consumed by | `features/<name>/facades/useXxx.ts` |

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
        ├── uses useSearchPlacePageLogic()                ← SearchPlacePage.logic.ts (ViewModel)
        │     ├── reads/writes useTripStore()             ← features/trips/state/
        │     └── calls useGooglePlaceImages()            ← features/shared/hooks/ (shared utility)
        │           └── imageRepository.getImage()        ← features/shared/di/resolve (IoC container)
        └── renders <PlacesAutocomplete />                ← ui/components/composite/
```


---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components / screens | `PascalCase.tsx` | `TripCard.tsx`, `HomeScreen.tsx` |
| All other files | `camelCase.ts` | `tripAdapter.ts`, `tripStore.ts` |
| Hooks (any hook) | `useXxx.ts` | `useTripStore.ts`, `useGetUserTrips.ts` |
| Domain entities | `Noun.ts` | `Trip.ts`, `Airport.ts` |
| Interfaces | `IXxx.ts` | `ITripRepository.ts`, `ILogger.ts` |
| Class repositories | `XxxRepository.ts` | `ImageRepository.ts` |
| Hook repositories | `useXxxRepository.ts` | `useTripRepository.ts` |
| Use cases | `XxxUseCase.ts` | `GetUpcomingTripUseCase.ts` |
| DTOs | `XxxResponseDTO.ts` | `TripResponseDTO.ts` |
| Adapters | `xxxAdapter.ts` | `tripAdapter.ts` |
| Schemas | `XxxSchema.ts` | `GenerateTripSchema.ts` |
| Page files | `PageName.tsx` / `.logic.ts` / `.style.ts` | `HomePage.tsx` |

### Import paths

Always use the `@/` path alias — never relative paths. This applies to every file in the project without exception.

```ts
// ✅ Always
import { logger } from '@/features/shared/di/resolve';
import { useGetUserTrips } from '@/features/trips/facades/useGetUserTrips';

// ❌ Never
import { logger } from '../../../shared/di/resolve';
import { useGetUserTrips } from '../../facades/useGetUserTrips';
```

Relative paths make files fragile to moves and impossible to read at a glance. The `@/` alias always resolves from the project root, making every import self-documenting.


---

## Rules

1. **Dependencies point inward.** `ui` → `facades` / `hooks` / `state` → `useCases` → `domain`. Never the reverse. See import rules below.

   | Layer | Can import |
   |---|---|
   | `.tsx` | ViewModel |
   | `.logic.ts` (ViewModel) | facades, hooks, shared hooks, class use cases via `di/resolve` (page-specific), state |
   | `facades/` | hook-based repos, class use cases via `di/resolve`, other facades |
   | `hooks/` | domain types, state, external library hooks — **not** repos or use cases |
   | `useCases/` | IoC repository interfaces, IoC service interfaces, domain entities |
   | `data/repositories/` | domain interfaces, DTOs, adapters |

   **The one rule that never bends: IoC repositories must only be imported inside `useCases/` — never in `.logic.ts`, `facades/`, `hooks/`, or anywhere in `ui/`.**
2. **`domain/` is pure.** No external library imports, no framework code, no side effects.
3. **`data/` owns external systems.** Only `data/` imports from backend clients (e.g. Convex), HTTP libraries (e.g. ky), device storage SDKs (e.g. MMKV).
4. **`libraries/` isolates third-party APIs.** `data/` uses library wrappers, never raw libraries directly.
5. **Schemas in `domain/schemas/`.** Schemas (e.g. Zod) define domain rules — they are not infrastructure concerns.
6. **Adapters transform, validators execute.** Adapters convert DTOs to entities; validators run schemas against data.
7. **Pages are thin.** All logic in `.logic.ts` hooks, all styles in `.style.ts` files.
8. **Feature state in `state/`.** Global state (store utils, app state, modal state) in `features/shared/state/`.
9. **Never instantiate services directly.** Always import from the feature's `di/resolve.ts`.
10. **Reactive backends = hook-based repositories.** Never wrap reactive backend hooks (e.g. Convex `useQuery`) in a class singleton.
11. **Feature isolation.** Features only import from `features/shared/` or from another feature's public API (`index.ts`). Never reach into another feature's internal folders (`data/`, `domain/`, `facades/`, etc.).
12. **Always use `@/` path aliases.** Never use relative paths (`../`) anywhere in the project.

---

## Patterns Reference

This section briefly explains the design patterns used in this architecture. You do not need to know these patterns to work effectively on the project — the folder structure and rules above encode all the decisions for you. This section exists for context and to give names to what you are already doing.

### Clean Architecture

**What it is:** An architectural approach where code is organized in concentric layers, each with a clear responsibility. Dependencies always point inward — outer layers know about inner ones, but inner layers know nothing about outer ones.

**How we use it:** `domain/` is the innermost layer — pure TypeScript, no external imports. `data/` wraps external systems and implements domain contracts. `useCases/` orchestrates domain logic. `facades/` and `ui/` sit on the outside. Swapping any outer layer (e.g. changing the backend) never touches the domain.

---

### Repository Pattern

**What it is:** An abstraction layer over data access. Instead of calling a database or HTTP API directly, you call a repository interface. The interface defines what data operations are available; the implementation decides how they work.

**How we use it:** `domain/entities/repositories/` defines the interface (`ITripRepository`). `data/repositories/` provides the implementation — either a hook (for reactive backends) or a class (for HTTP APIs). Use cases call the interface and never know which implementation is running.

---

### Dependency Inversion Principle (DIP)

**What it is:** High-level modules should not depend on low-level modules. Both should depend on abstractions. In practice: your business logic depends on interfaces, not concrete classes.

**How we use it:** Use cases receive `ILogger` and `IImageRepository` — interfaces defined in `domain/`. The IoC container injects the concrete implementations at startup. Swapping a logger from console to remote logging requires zero changes to any use case.

---

### Inversion of Control (IoC) / Dependency Injection

**What it is:** Instead of a class creating its own dependencies (`new Logger()`), dependencies are provided from the outside. An IoC container (e.g. tsyringe) manages creation and injection automatically based on registered types.

**How we use it:** Classes declare their dependencies as constructor parameters typed to interfaces. `di/config.ts` registers the implementations. `di/resolve.ts` resolves the fully-wired instances at startup. No class ever calls `new` on its dependencies.

---

### Facade Pattern

**What it is:** A simplified interface over a complex subsystem. The facade hides internal complexity and exposes only what the caller needs.

**How we use it:** `facades/` combines hook-based repositories (reactive data) with class use cases (business logic) into a single, named hook. The caller (`logic.ts`) calls `useGetUserTrips()` without knowing that this involves a Convex subscription, an auth hook, and a filtering use case.

---

### MVVM (Model–View–ViewModel)

**What it is:** A UI pattern that separates the view (what you see) from its logic (what it does). The ViewModel is a layer between the view and the data that prepares data for display and handles user actions.

**How we use it:** `PageName.tsx` is the View — pure JSX, no logic. `PageName.logic.ts` is the ViewModel — a custom hook that fetches data, computes derived state, and exposes action handlers. The View only consumes the ViewModel's output.

---

### Public API / Barrel Export Pattern

**What it is:** A module exposes only a curated set of exports via an entry point (`index.ts`). Internal implementation files are not directly importable by consumers.

**How we use it:** Each feature that shares something with another feature has an `index.ts` that explicitly lists what is public. Consumers import from `@/features/user`, never from `@/features/user/data/repositories/...`. This keeps internal refactoring invisible to the outside.

---

### Singleton Pattern

**What it is:** A class that has exactly one instance for the lifetime of the application.

**How we use it:** All IoC-registered classes (services, repositories, use cases) are stateless — they hold no mutable data. Because of this, registering them as singletons is both safe and efficient: one instance is created at startup and reused everywhere.
