# Architecture

> **Diagram:** [Architecture overview](diagrams/architecture.mermaid)

> **Note on code examples:** All code examples in this document use generic, representative names (`Item`, `IItemRepository`, `FilterItemsUseCase`, `useGetItems`, etc.). They are intentionally disconnected from the actual project code. Their sole purpose is to illustrate patterns and rules — they are not templates to copy.

## Guiding Principles

- **Feature-first** — code is grouped by business capability, not by technical layer. Open a feature folder and understand its full scope end to end.
- **Inward dependencies** — outer layers depend on inner ones, never the reverse. `ui` → `facades/hooks/state` → `useCases` → `domain`.
- **Abstraction over coupling** — feature code depends on interfaces, not concrete implementations. Swapping a library only affects its wrapper, not any feature.
- **Two DI modes** — IoC container for stateless singletons (services, HTTP repos); hook-based repositories when the underlying SDK only exposes a React hook API and cannot be wrapped in a class singleton (e.g. reactive real-time backends like Convex, or auth SDKs like Clerk that are hook-only by design).
- **Feature isolation** — features communicate only through `features/core/` or another feature's explicit public API (`index.ts`). Internal folders are never imported across features. Features are organised into dependency tiers — dependencies only flow downward, never between peers. See [Feature Dependency Tiers](#feature-dependency-tiers).
- **Start simple, promote when needed** — components, facades, and hooks start local. They move to a shared location only when a second consumer appears.

---

## Philosophy

This project follows a **feature-first Clean Architecture**. Each self-contained piece of functionality lives in its own feature folder with a consistent internal structure. Dependencies always point inward: `ui` → `facades` / `hooks` / `state` → `useCases` → `domain`. Nothing in `domain` ever imports from `data`, `facades`, `hooks`, `state`, or `ui`.

The app uses two complementary dependency injection patterns:

- **IoC container singletons** (e.g. tsyringe) for stateless services: Logger, Storage, AI client, HTTP client, image repositories. These are registered once at app startup inside each feature's own `di/` folder and resolved via the feature's `di/resolve.ts`.
- **Hook-based repositories** when the underlying SDK only exposes a React hook API and cannot be wrapped in a class singleton. Two distinct cases apply:
  - **Reactive backends** (e.g. Convex) — the client exposes `useQuery`-style hooks that subscribe to real-time updates. Forcing them into a class singleton would lose reactivity.
  - **Hook-only SDKs** (e.g. Clerk) — the SDK exposes its API exclusively as React hooks (`useSignIn`, `useClerk`, etc.) with no class-friendly alternative. The operations may be async rather than reactive, but a class singleton is still not possible.

  In both cases, repository interfaces are defined in `domain/` and implemented as hooks in `data/repositories/`.

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
│   ├── schemas/
│   └── utils/            (pure domain utility functions — no external imports)
├── data/
│   ├── dtos/
│   ├── adapters/
│   ├── validators/
│   ├── repositories/
│   └── services/
├── mappers/              (pure functions: domain type → presentation concern)
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

## `features/core/`

`features/core/` is the **foundational infrastructure module** — it owns all cross-cutting concerns: error handling, logging, storage, HTTP, image fetching, global state utilities, and generic utility hooks. Unlike other features, `core` is not organised by technical layer at the top level. It is organised by **concern** — each concern is a self-contained sub-module with its own internal layers.

```
features/core/
├── error/           → BaseError, ErrorCode, Result, ok/fail helpers, ensureError, ILogger, BasicLogger, SentryLogger
├── storage/         → IStorage, LocalStorage, MMKV wrapper, zustandStorage adapter
├── http/            → IHttpClient, HttpClient, fetch wrapper
├── images/          → IImageRepository, ImageRepository, FetchImageUseCase, useGetImage facade
├── state/           → createSelectors, registerStore, resetAllStores, createZustandStorage utilities; app-wide and modal state stores
└── utils/           → generic utility hooks (useDebounce, etc.) and pure utility functions
```

Each sub-module follows the same internal layer structure as any other feature — only the layers it actually needs:

```
features/core/<sub-module>/
├── domain/
│   ├── entities/
│   │   ├── SomeType.ts
│   │   ├── repositories/    (if the sub-module defines a repository interface)
│   │   └── services/        (if the sub-module defines a service interface)
│   └── utils/               (pure domain utility functions — no external imports)
├── data/
│   ├── repositories/
│   └── services/
├── mappers/                 (pure functions: domain type → presentation concern)
├── libraries/               (third-party wrappers)
├── di/
│   ├── types.ts
│   ├── config.ts
│   └── resolve.ts
├── facades/                 (if the sub-module exposes reactive hooks)
├── hooks/                   (sub-module-specific utility hooks)
└── index.ts                 (public API of the sub-module)
```

Every feature is **isolated**: `features/items/` cannot reach into `features/catalog/` internals. If logic or types are needed across features, they either:

- Move into `features/core/` (foundational infrastructure) or the relevant `core` sub-module
- Or are exposed via the target feature's **public API** — an `index.ts` at the feature root that explicitly declares what is shareable

Not every feature needs an `index.ts` — only create one when another feature actually needs to import from it.

### What belongs in a feature's public API (`index.ts`)


| Can export                | Why                                                               |
| ------------------------- | ----------------------------------------------------------------- |
| Domain entities and types | Consumers need them to type-check data received from this feature |
| Facades                   | Ready-to-use hooks that expose data and actions cleanly           |
| Utility hooks             | Reusable hooks that are genuinely useful to other features        |



| Must NOT export                          | Why                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Hook-based repositories                  | Internal data access — consumers must go through facades, never call repos directly                |
| Class use cases                          | Internal business logic — resolved via the feature's own DI container, not consumed cross-feature  |
| DTOs                                     | Internal wire format — domain entity types are the shared language, not API shapes                 |
| Adapters                                 | Internal transformation — no consumer ever needs to transform another feature's data               |
| Validators                               | Internal data validation — consumers receive already-validated domain entities                     |
| Schemas                                  | Internal domain rules — consumers work with types, not schema definitions                          |
| `di/resolve.ts` exports                  | DI internals — IoC resolution is always local to the owning feature                                |
| State stores                             | Internal UI state — other features have no business reading or writing another feature's state     |
| `libraries/` wrappers                    | Internal infrastructure — third-party library wrappers are an implementation detail                |
| UI components                            | Promoted to global `ui/components/` when truly shared — never exported from a feature's public API |
| Repository interfaces (`IXxxRepository`) | Internal contracts — the consuming feature needs the facade, not the plumbing behind it            |


```ts
// features/catalog/index.ts
export type { Catalog } from './domain/entities/Catalog';             // ✅ domain type
export { useGetCatalogStatus } from './facades/useGetCatalogStatus';  // ✅ facade

// never exported:
// export { useItemRepository } from './data/repositories/...'  ❌
// export { getCatalogUseCase } from './di/resolve'              ❌
// export { CatalogResponseDTO } from './data/dtos/...'          ❌
```

> **Exception — `features/core/` sub-modules:** Core sub-modules are foundational infrastructure shared across the whole app, not feature boundaries. Their `index.ts` may re-export IoC singletons and use cases when other features need to call them directly (e.g. `logger`, `fetchImageUseCase`). This is the deliberate exception to the "Class use cases" and "`di/resolve.ts` exports" rows above. Regular features (`items`, `entity`, etc.) follow the strict rule — use cases are internal, only facades cross the boundary.

### What a consuming feature can import

```ts
// ✅ Import domain types from another feature's public API
import type { Catalog } from '@/features/catalog';

// ✅ Import facades from another feature's public API
import { useGetCatalogStatus } from '@/features/catalog';

// ✅ Import from a core sub-module via its public API (index.ts) — hooks, types, AND IoC singletons
import { useGetImage } from '@/features/core/images';
import { logger } from '@/features/core/error';

// ❌ Never reach into another feature's internal folders
import { useItemRepository } from '@/features/catalog/data/repositories/useConvexCatalogRepository';

// ❌ Never reach into a core sub-module's internal folders — di/resolve.ts is internal to the owning feature
import { logger } from '@/features/core/error/di/resolve';
import { SentryLogger } from '@/features/core/error/data/services/SentryLogger';
```

**`di/resolve.ts` is internal to its feature.** Within a feature, files import their own resolved singletons via `di/resolve.ts` directly. Outside the feature, consumers always go through the sub-module's `index.ts`. Core sub-modules re-export their public IoC singletons from `index.ts`:

```ts
// features/core/error/index.ts
export { logger } from './di/resolve';                          // IoC singleton — re-exported for cross-feature use
export type { ILogger } from './domain/entities/services/ILogger';
export { BaseError, ErrorCode, ensureError, ok, fail } from './domain/entities/Result';

// features/core/images/index.ts
export { fetchImageUseCase } from './di/resolve';               // IoC singleton — re-exported for cross-feature use
export { useGetImage } from './facades/useGetImage';            // facade
```

### When to use `core/` vs `index.ts`


| Scenario                                                                                  | Solution                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundational infrastructure needed by many features (logging, storage, HTTP, error types) | Move to the relevant `features/core/<sub-module>/`                                                                                                                                                                                                                          |
| Logic or type needed by one specific feature                                              | Expose via `index.ts` of the owning feature                                                                                                                                                                                                                                 |
| UI component needed by many features                                                      | Promote to global `ui/components/`                                                                                                                                                                                                                                          |
| UI component needed by one other feature                                                  | Before sharing, ask: does the other feature need the component itself, or just the data? If it just needs the data, it can build its own version. If the component is truly needed as-is, promote it to global `ui/components/` — never export UI components via `index.ts` |

> **When the consumer is a same-tier feature:** the table above does not apply — same-tier features cannot import from each other regardless of what is being shared. Extract the shared concept to a lower-tier feature, move it to `features/core/` if it is infrastructural, or introduce a Tier 3 orchestration feature. See [Feature Dependency Tiers](#feature-dependency-tiers).

---

## Feature Dependency Tiers

Features are not all equal — they sit at different levels of the dependency stack. Understanding this hierarchy is what lets you decide whether a cross-feature import is valid before writing a single line of code.

### The tier model

```
┌──────────────────────────────────────────────────────────┐
│                 Tier 3 — Orchestration                   │
│          checkout-flow, onboarding-flow, ...             │
│    coordinates multiple domain features — no entity      │
│         of its own. Valid tool, use sparingly.           │
└─────────────────────────┬────────────────────────────────┘
                          │ can import ↓
┌──────────────────────────────────────────────────────────┐
│                   Tier 2 — Domain                        │
│            orders, inventory, catalog, ...               │
│      owns a domain entity specific to this app.          │
│      ← peers: no imports between Tier 2 features →       │
└─────────────────────────┬────────────────────────────────┘
                          │ can import ↓
┌──────────────────────────────────────────────────────────┐
│                 Tier 1 — Foundation                      │
│             identity, settings, locale, ...              │
│    cross-cutting concerns, no specific domain entity.    │
│      ← peers: no imports between Tier 1 features →       │
└─────────────────────────┬────────────────────────────────┘
                          │ can import ↓
┌──────────────────────────────────────────────────────────┐
│                    Tier 0 — Core                         │
│            error, storage, http, images, utils           │
│    pure infrastructure — no business logic,              │
│         no dependency on any business feature.           │
└──────────────────────────────────────────────────────────┘
```

The single governing rule: **dependencies only flow downward**. A feature may import from any feature in a lower tier. It may never import from a peer (same tier) or from a higher tier. There are no exceptions.

### Classifying a feature

Use this decision tree when adding a new feature or questioning whether an existing one is correctly placed:

```
Is it pure infrastructure with no business logic?
  Yes → Tier 0 (Core)
  No  ↓

Does it coordinate multiple domain features to do its job,
with no domain entity of its own?
  Yes → Tier 3 (Orchestration)
  No  ↓

Does it model a concept specific to this app's domain
(an entity or capability tied to what the product does)?
  Yes → Tier 2 (Domain)
  No  → Tier 1 (Foundation)
```

**Tier 2 vs Tier 3 — the ownership question:**
- A Tier 2 feature *owns* a domain concept — it has a meaningful `domain/entities/` at its core.
- A Tier 3 feature *coordinates* concepts owned by others — it has no entity of its own. If you cannot point to a single primary entity that lives in this feature, it is Tier 3.

**Tier 1 vs Tier 2 — the specificity question:**
- Would this feature exist in almost any app, regardless of business domain? → **Tier 1** (e.g. `identity`, `locale`, `settings`)
- Is this feature specific to what this app does? → **Tier 2** (e.g. `orders`, `catalog`, `inventory`)

### Practical examples

**Valid — downward dependency**

`orders` (Tier 2) needs the current user to scope its data → imports `useCurrentUser` from `identity` (Tier 1) via its `index.ts`. One tier down, one direction. Clean.

```ts
// features/orders/facades/useOrderList.ts
import { useCurrentUser } from '@/features/identity'; // ✅ Tier 2 → Tier 1
```

**Invalid — peer dependency**

`inventory` (Tier 2) wants to import a type from `orders` (Tier 2). Both are peers — blocked, no exceptions. Two resolutions:

- If the shared type is infrastructural → move it down to `features/core/`.
- If both features genuinely need to coordinate → that coordination is a Tier 3 responsibility. Introduce an orchestration feature that imports from both.

**Valid — Tier 3 orchestration**

`checkout-flow` (Tier 3) drives a multi-step purchase flow that spans `orders`, `inventory`, and `payments`. It has no entity of its own — its sole job is coordination. It imports facades from all three Tier 2 features; the domain features remain unaware of each other.

```ts
// features/checkout-flow/facades/useCheckout.ts
import { useOrderDraft } from '@/features/orders';         // ✅ Tier 3 → Tier 2
import { useInventoryCheck } from '@/features/inventory';  // ✅ Tier 3 → Tier 2
import { usePayment } from '@/features/payments';          // ✅ Tier 3 → Tier 2
```

### Declaring a feature's tier in code

Every feature declares its tier via a `FEATURE_TIER` constant exported from its `index.ts`:

```ts
// features/items/index.ts
import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 2;
```

`FeatureTier` is defined in `features/core/featureTier.ts` as `type FeatureTier = 0 | 1 | 2 | 3`. This constant is the machine-readable source of truth for the tier graph — it is the foundation for automated dependency enforcement via dependency-cruiser.

### Design smell: upward or circular dependency

If you find yourself needing to import from a higher tier or from a peer, stop. It is always a signal that something is misclassified or misplaced:

| Symptom | Root cause | Resolution |
| --- | --- | --- |
| A Tier 1 feature needs something from Tier 2 | The Tier 1 feature is probably Tier 2 itself | Reclassify it |
| Two Tier 2 features need each other | A shared concept has no clear owner | Extract the shared concept to a lower tier, or introduce a Tier 3 coordinator |
| A Tier 2 feature needs something from Tier 3 | The Tier 3 feature owns something it shouldn't | Move that concept down into its own Tier 2 feature |

Never work around these by restructuring imports. Resolve the classification first.

---

## Folder Purposes

### `domain/`

The core of the feature. Contains only pure TypeScript — no external library imports, no side effects, no framework code. Everything here is stable and fully independent of infrastructure decisions.

#### `domain/entities/`

Pure domain models — TypeScript interfaces, types, and constants that represent the concepts of this feature in the app's own language, not in an external API's language.

**`interface` vs `type`**

- Use `interface` for object shapes that represent a domain entity — they are readable, clearly named, and easy to extend if needed.
- Use `type` for unions, aliases, intersections, or **component props** — anything that is not a plain domain entity shape.

```ts
interface Item { id: string; name: string; }          // ✅ domain entity shape → interface
type ItemStatus = 'upcoming' | 'past' | 'ongoing';   // ✅ union → type
type ItemWithStatus = Item & { status: ItemStatus };  // ✅ intersection → type
type ItemCardProps = { item: Item; onPress: () => void };  // ✅ component props → type
```

**`enum` vs `const`**
Avoid TypeScript `enum` — it generates unexpected runtime code, behaves differently between regular and `const enum`, and does not tree-shake well. Use a `const` object with `as const` instead:

```ts
// ❌ Avoid
enum CategoryLevel { Basic = 'Basic', Standard = 'Standard', Premium = 'Premium' }

// ✅ Prefer
export const CategoryLevel = {
  Basic: 'Basic',
  Standard: 'Standard',
  Premium: 'Premium',
} as const;
export type CategoryLevel = typeof CategoryLevel[keyof typeof CategoryLevel];
```

This gives you the same autocompletion and exhaustive checks, with plain string values and zero runtime surprises.

```ts
// features/items/domain/entities/Item.ts
export interface Item {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
```

##### `domain/entities/repositories/`

Repository interfaces. Define the contract for data access without specifying how it is implemented. The feature's `data/repositories/` implements these contracts.

```ts
// features/items/domain/entities/repositories/IItemRepository.ts
export interface IItemRepository {
  getItems(): Item[] | undefined;               // reactive query — undefined while loading, no Result needed
  createItem(data: CreateItemData): Promise<Result<void>>;
  toggleActive(itemId: string): Promise<Result<void>>;
  deleteItem(itemId: string): Promise<Result<void>>;
}
```

##### `domain/entities/services/`

Service interfaces. While repository interfaces define contracts for **data access** (how to read and write domain data), service interfaces define contracts for **capabilities** — cross-cutting concerns that a feature needs but doesn't own the implementation of.

A feature declares "I need to be able to log things" or "I need to generate AI content" without caring how it works. The interface is the contract; `data/services/` provides the implementation and the IoC container wires them together. This means the implementation can change (e.g. swap a console logger for a remote logging service) without touching any feature code.

```ts
// features/core/error/domain/entities/services/ILogger.ts
export interface ILogger {
  log(message: string, ...args: unknown[]): void;
  error(error: Error, context?: Record<string, unknown>): void;
  warning(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
```

#### `domain/schemas/`

Schema definitions. Schemas are a domain concern because they describe what valid data looks like for this feature. They serve as the single source of truth for both runtime validation and TypeScript types derived via type inference.

`data/validators/` uses these schemas to execute validation. The schema itself does not run validation — it only defines the rules.

**Why not abstract the schema library behind an interface?** The schema library (e.g. Zod) acts as a type-system extension for TypeScript rather than a swappable infrastructure dependency. Type inference from schemas (e.g. `z.infer<>`) is the mechanism that derives static types from schema definitions — abstracting it away would mean duplicating every type definition separately, which defeats the purpose. The separation that matters is already in place: schemas *define* rules here in `domain/schemas/`, validators *run* them in `data/validators/`. If the schema library ever changes, only those two locations need updating — no feature code is affected.

**This exception extends to service interfaces that use Zod purely as a type constraint.** A service interface method typed as `generateObject<T extends ZodType>(schema: T): Promise<z.infer<T>>` uses Zod exclusively for TypeScript type inference — the import is `import type`, there is zero runtime coupling, and no Zod method is called in the interface itself. This is the same category as schema type inference: Zod as a type-system extension, not a swappable runtime dependency. The rule to watch is that the import must be `import type` only; any runtime Zod call in `domain/` is a violation.

```ts
// features/items/domain/schemas/GenerateItemSchema.ts
// e.g. using Zod
export const generateItemSchema = z.object({
  itemDetails: z.object({
    name: z.string(),
    startDate: z.string().describe('Date in ISO format YYYY-MM-DD'),
    endDate: z.string().describe('Date in ISO format YYYY-MM-DD'),
  }),
  dayPlans: z.array(subItemSchema),
});

export type GeneratedItem = z.infer<typeof generateItemSchema>;
```

#### `domain/utils/`

Pure utility functions that operate exclusively on domain types. Like everything else in `domain/`, these files must be pure TypeScript — no external library imports, no framework code, no side effects.

The distinction from `domain/entities/` is structural: entities define **what things are** (types, interfaces, constants, schemas); utils define **what you can do with them** (pure functions that transform or guard domain values).

A function belongs in `domain/utils/` when:
- It takes and returns only domain types (or primitives)
- It has no dependencies outside `domain/`
- It is consumed by multiple layers (use cases, data, hooks) — if only one layer uses it, it can live there directly

```ts
// features/core/error/domain/utils/ensureError.ts
// Converts any unknown caught value into a typed BaseError.
// Called in every catch block across all layers — must live in domain/ so all layers can import it.
export const ensureError = (value: unknown): BaseError => {
  if (value instanceof BaseError) return value;
  if (value instanceof Error) return new BaseError(value.message, ErrorCode.UnexpectedError, { cause: value });
  // ...
};
```

---

### `data/`

The infrastructure layer. `data/` implements the contracts defined in `domain/` and owns all external-world concerns — HTTP APIs, reactive backends (e.g. Convex), device storage, SDKs, data transformation. It imports from `domain/` but `domain/` never imports from `data/`.

This follows the **Dependency Inversion Principle**: both `domain/` and `data/` depend on the interface defined in `domain/` — `data/` never dictates how `domain/` works.

#### `data/dtos/`

Data Transfer Objects. Raw data shapes that come from external sources — HTTP responses, backend query results (e.g. Convex), third-party APIs. DTOs live in `data/` because they represent the external world's format, not the app's domain language. The domain layer is completely unaware of them — only `data/adapters/` consumes DTOs to transform them into domain entities.

```ts
// features/items/data/dtos/ItemResponseDTO.ts
export type ItemResponseDTO = {
  _id: string;
  userId: string;
  payload: { details: { name: string; startDate: string; }; subItems: SubItem[]; };
  isActive: boolean;
};
```

#### `data/repositories/`

Implementations of repository interfaces from `domain/entities/repositories/`.

**Naming convention:** class-based repositories are named `XxxRepository.ts`; hook-based repositories are prefixed with `use` following the React convention: `useXxxRepository.ts`. This makes the pattern immediately visible without needing a subfolder — a feature rarely has both types simultaneously.

---

**Hook-based repositories** (e.g. Convex) are implemented as React hooks — not classes. This preserves real-time subscriptions and auth context, which would be lost in a class singleton.

**Documented exception — direct library imports:** Hook-based repositories are the only place in `data/` that may import reactive library hooks directly — specifically the Convex client hooks (`useQuery`, `useMutation`) and the auth context hook (e.g. Clerk's `useAuth`). These are React hooks that require the React lifecycle and an auth provider context to function. They cannot be wrapped in a `data/services/` class singleton without losing reactivity or breaking auth. This is not a layering shortcut — it is a structural necessity of the hook-based repository pattern.

```ts
// features/items/data/repositories/useItemRepository.ts
// e.g. using Convex + Clerk
export const useItemRepository = (): IItemRepository => {
  const { userId } = useAuth();                                                    // auth hook — direct import, documented exception
  const items = useQuery(api.items.getAllByUserId, { userId: userId ?? '' }); // Convex hook — direct import, documented exception
  const createMutation = useMutation(api.items.create);
  const toggleMutation = useMutation(api.items.toggleActive);

  return {
    getItems: () => items,                                      // reactive query — returns undefined while loading

    createItem: async (data) => {
      try {
        await createMutation(data);
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },

    toggleActive: async (itemId) => {
      try {
        await toggleMutation({ itemId });
        return ok(undefined);
      } catch (err) {
        return fail(ensureError(err));
      }
    },
  };
};
```

---

**Class-based repositories** (e.g. HTTP APIs) are singleton classes registered in the IoC container. They never import from `libraries/` directly. When a class-based repository needs external I/O (HTTP, storage), it declares a dependency on a **service interface** injected via constructor. The service implementation handles the `libraries/` call internally. This keeps the repository isolated from library-level details.

```ts
// features/core/images/data/repositories/ImageRepository.ts
// registered as singleton in di/config.ts via container.registerSingleton()
export class ImageRepository implements IImageRepository {
  constructor(private http: IHttpClient) {}  // service interface injected — never imports httpClient from libraries/ directly

  async getImage(resourceName: string, urlType: UrlType): Promise<Result<string>> {
    try {
      const data = await this.http.get('/search/photos', { query: resourceName }).json();
      return ok(data.results[0]?.urls[urlType] ?? noImage);
    } catch (err) {
      return fail(ensureError(err));
    }
  }
}
```

#### `data/services/`

Implementations of service interfaces from `domain/entities/services/`. These are stateless, registered as singletons in the IoC container, and may use `libraries/` wrappers internally.

```ts
// features/core/error/data/services/BasicLogger.ts
// registered as singleton in di/config.ts via container.registerSingleton()
export class BasicLogger implements ILogger {
  log(message: string, ...args: unknown[]) { console.log(message, ...args); }
  error(error: Error, context?: Record<string, unknown>) { console.error(error, context); }
  warning(message: string, ...args: unknown[]) { console.warn(message, ...args); }
}
```

#### `data/adapters/`

Pure functions that transform data between shapes — typically a DTO (external shape) into a domain entity (internal shape). Keeps transformation logic out of repositories and use cases.

```ts
// features/items/data/adapters/itemAdapter.ts
import type { ItemResponseDTO } from '@/features/items/data/dtos/ItemResponseDTO';
import type { Item } from '@/features/items/domain/entities/Item';

export const toItem = (dto: ItemResponseDTO): Item => ({
  id: dto._id,
  name: dto.payload.details.name,
  startDate: dto.payload.details.startDate,
  endDate: dto.payload.details.endDate,
  isActive: dto.isActive,
});
```

#### `data/validators/`

Plain functions that execute validation — running schemas against untrusted input, checking business rules, or sanitizing data. Always plain functions, never classes.

When validation is based on a schema (e.g. Zod):

```ts
// features/items/data/validators/validateGeneratedItem.ts
export const validateGeneratedItem = (data: unknown): GeneratedItem => {
  return generateItemSchema.parse(data);
};
```

When validation is pure TypeScript business logic with no schema:

```ts
// features/items/data/validators/validateItemDates.ts
export const validateItemDates = (startDate: string, endDate: string): boolean => {
  return startDate <= endDate;
};

// features/items/data/validators/validateTravelersCount.ts
export const validateTravelersCount = (count: number): boolean => {
  return count >= 1 && count <= 20;
};
```

---

### `mappers/`

Pure functions that translate **domain types into presentation concerns** — typically a domain value into a string key, label, color, or other UI-facing representation. Mappers live at the feature level (not under `data/`) because they do not touch DTOs, repositories, or any infrastructure — they bridge domain and UI.

**Why not `domain/`?** The output of a mapper is a presentation concern (e.g. an i18n key string). If a mapper lived in `domain/`, the domain layer would gain knowledge of UI naming conventions — backwards coupling. Renaming a translation key would force a change in a domain file.

**Why not `data/adapters/`?** `data/adapters/` transforms external data shapes (DTOs) into domain entities — always **inward** (external → domain). Mappers go the other direction: **outward** (domain → presentation). Different direction, different layer.

**Import rule:** mappers may only import from `domain/`. Hooks, facades, and `.logic.ts` files may import from `mappers/`.

```ts
// features/core/error/mappers/errorCodeToMessageKey.ts
// Maps domain ErrorCode values to i18n message keys for display in the UI.
// Lives in mappers/ because the output values ('ERRORS.NETWORK' etc.) are presentation-layer
// naming conventions — having them in domain/ would couple domain to UI concerns.
import type { ErrorCode as ErrorCodeType } from '@/features/core/error/domain/entities/ErrorCode';
import { ErrorCode } from '@/features/core/error/domain/entities/ErrorCode';

export const errorCodeToMessageKey: Partial<Record<ErrorCodeType, string>> = {
  [ErrorCode.NetworkFailure]: 'ERRORS.NETWORK',
  [ErrorCode.Unauthorized]: 'ERRORS.UNAUTHORIZED',
  [ErrorCode.GenerationFailed]: 'ERRORS.GENERATION',
  [ErrorCode.NotFound]: 'ERRORS.NOT_FOUND',
};
// Unmapped codes fall back to 'ERRORS.GENERIC' at the call site
```

---

### `libraries/`

Thin wrappers around external libraries. No business logic — only API normalization and simplification. The goal is to isolate the app from third-party library APIs so that swapping a library only requires changing its wrapper, not every file that uses it.

`data/services/` implementations are the **exclusive consumers** of library wrappers in the class-based pattern. Class-based repositories never import from `libraries/` directly — they receive service interfaces via constructor injection, and the service implementation calls the library wrapper internally.

**Three documented exceptions:**

1. **Hook-based repositories** import Convex and auth hooks directly — a structural necessity of the hook-based repository pattern (see `data/repositories/`).

2. **Hook-based service layers** — when a feature has no class-based service (because the functionality is inherently React lifecycle-bound), the hook that wraps the library *is* the service layer. In this case the hook may import from `libraries/` directly. The condition is strict: there must be no meaningful service interface to extract — the hook IS the entire service. Example: `useToast` in `features/core/toast/` wraps `toastClient` from `libraries/` because toast display is a UI-only concern with no swappable implementation interface. Adding a class-based `IToastService` would be pure ceremony with no architectural benefit.

3. **SDK bootstrap functions** — one-time SDK setup operations that must run at app startup, before the DI container is meaningful, do not benefit from being behind an injectable interface. These are re-exported from the feature's `index.ts` as standalone functions and consumed directly by `app/_layout.tsx`. The condition is strict: the function must be a true one-time bootstrap call (not a runtime service operation), and there must be no scenario where the behaviour needs to vary or be mocked. Current example: `initSentry`, `wrap`, and `registerNavigationContainer` in `features/core/sentry/` — all three configure the Sentry SDK at startup and are called exactly once in `app/_layout.tsx`. Runtime service operations from the same SDK (`captureException`, `startSpan`, `setMeasurement`) are properly behind `ISentryErrorClient` / `ISentryPerfClient` interfaces and injected via the container.

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
// features/core/storage/di/factories/mmkvClient.ts
import Constants from 'expo-constants';
import { MMKV } from 'react-native-mmkv';

export const mmkvClient = new MMKV({
  id: 'holidai.expo.storage',
  encryptionKey: Constants.expoConfig?.extra?.mmkvEncryptionKey,
});
```

**`libraries/` vs `di/factories/` — the deciding question is how the instance reaches its consumer:**

| How the instance is consumed | Where it belongs |
| --- | --- |
| `data/services/` imports it directly via module path | `libraries/` |
| Registered with the IoC container and injected via `@inject` | `di/factories/` |

A library wrapper that feeds the container via `registerInstance` is functioning as a factory — it belongs in `di/factories/` alongside other factory files, keeping all container-registered instances in one place. A wrapper that is consumed directly by a single `data/services/` file with no need for swappability can stay in `libraries/`. When in doubt, prefer `di/factories/` — it gives you free swappability at the DI boundary.

---

### `useCases/`

Application logic that orchestrates domain entities, repositories, and services to perform a specific action or compute a specific result. Use cases contain business rules that don't belong to any single entity.

**All use cases are classes**, registered in the feature's `di/` folder. This ensures consistency — adding a dependency later only requires updating the constructor and DI config, not the calling code.

Use cases can depend on both **repository interfaces** (data access) and **service interfaces** (capabilities) — both are infrastructure concerns injected via their interfaces.

All use case dependencies are declared in the constructor and injected by the IoC container. Use cases with no dependencies omit the constructor entirely.

```ts
// features/items/useCases/FilterItemsUseCase.ts
// registered in di/config.ts
export class FilterItemsUseCase {
  constructor(
    @inject(DATES_TYPES.GetTodayInLocalTimezoneUseCase)
    private getTodayUseCase: IGetTodayInLocalTimezoneUseCase,
  ) {}

  execute(items: Item[]): Item | undefined {
    const today = this.getTodayUseCase.execute().toISOString().split('T')[0];
    return items
      .filter(item => item.startDate >= today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
  }
}
```

Service interfaces (capabilities like AI or logging) are equally valid constructor dependencies — both are pure TypeScript interfaces defined in `domain/` and neither exposes a concrete implementation:

```ts
// features/items/useCases/GenerateItemUseCase.ts
// registered in di/config.ts
import { buildItemPrompt } from '@/features/items/domain/utils/buildItemPrompt'; // own domain util — no cross-feature import

export class GenerateItemUseCase {
  constructor(
    private aiService: IAiService,  // service interface — capability
    private logger: ILogger,        // service interface — capability
  ) {}

  async execute(formData: ItemFormData): Promise<Result<GeneratedItem>> {
    try {
      const prompt = buildItemPrompt(formData);
      const result = await this.aiService.generateObject(prompt, generateItemSchema, AiModel.Default);
      return ok(result);
    } catch (err) {
      const error = ensureError(err);
      this.logger.error(error, { context: 'GenerateItemUseCase', formData });
      return fail(error);
    }
  }
}
```

Note that `GenerateItemUseCase` handles AI generation but knows nothing about the reactive backend. Saving the result is handled by the repository, coordinated at the facade layer — see the `[facades section](#facades) for the full example.

This keeps each layer focused: use cases handle business logic, repositories handle data persistence, facades coordinate them and decide how to surface failures.

#### IoC repositories — full consumption chain

An IoC (class-based) repository is injected into a use case and never escapes that boundary. This is how it flows end to end:

```ts
// 1. Interface — features/core/images/domain/entities/repositories/IImageRepository.ts
export interface IImageRepository {
  getImage(resourceName: string, urlType: UrlType): Promise<Result<string>>;
}

// 2. Use case — features/core/images/useCases/FetchImageUseCase.ts
// registered in di/config.ts (e.g. using tsyringe @injectable())
export class FetchImageUseCase {
  constructor(
    private imageRepository: IImageRepository,
    private logger: ILogger,
  ) {}

  async execute(resourceName: string, urlType: UrlType): Promise<Result<string>> {
    const result = await this.imageRepository.getImage(resourceName, urlType);
    if (!result.success) this.logger.error(result.error);
    return result;
  }
}

// 3. Resolved — features/core/images/di/resolve.ts
export const fetchImageUseCase =
  container.resolve<FetchImageUseCase>(IMAGES_TYPES.FetchImageUseCase);

// 4a. Consumed via facade (when reused across pages)
// features/core/images/facades/useGetImage.ts
import { fetchImageUseCase } from '@/features/core/images/di/resolve';

export const useGetImage = (resourceName: string) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchImageUseCase.execute(resourceName, 'regular').then(result => {
      if (result.success) setUrl(result.data);
    });
  }, [resourceName]);

  return url;
};

// 4b. Or consumed directly in .logic.ts (page-specific)
import { fetchImageUseCase } from '@/features/core/images'; // cross-feature — always via index.ts

export const useSearchPageLogic = () => {
  const handleSelect = async (place: string) => {
    const result = await fetchImageUseCase.execute(place, 'regular');
    if (!result.success) return;
    const url = result.data;
    // ...
  };
  return { handleSelect };
};
```

```ts
// ❌ Never import an IoC repository directly in a facade, hook, or .logic.ts
import { imageRepository } from '@/features/core/images/di/resolve';  // breaks the rule
```

The key distinction from hook-based repositories: an IoC repository is a class singleton resolved once at startup. It has no React lifecycle and can be called anywhere — but it must always be called through a use case, never directly. A hook-based repository (e.g. Convex) is different: it is a React hook itself and can be called directly in facades.

---

### `facades/`

Facades are **coordination hooks** — they combine hook-based repositories and class use cases into a single, named React hook. The name comes from the Facade design pattern: a simplified interface over a complex subsystem. Callers don't need to know that getting upcoming trips requires both a Convex subscription and a filtering use case — the facade handles it.

**Naming:** facades follow the standard React hook naming convention — `useXxx`. The `facades/` folder is the distinguisher, not the name. Adding a suffix like `useXxxFacade` would be verbose and redundant. Other projects (e.g. NX feature libraries, Angular service facades) use the folder or module boundary to signal the pattern, not the name itself.

**What facades can import:** hook-based repositories, class use cases from the same feature's `di/resolve.ts`, other facades, utility hooks from `features/core/utils` (via `index.ts`), same-feature state stores.

**Why not IoC services?** If a facade needs a service (e.g. logging), that service call belongs inside a use case — not the facade. The facade's only job is coordination: it calls use cases for business logic and hook-based repos for reactive data. Mixing service calls in a facade blurs that boundary.

**Why not IoC repositories?** IoC repositories must always be accessed through use cases, which act as gatekeepers — they validate, log, apply rules. A facade that calls an IoC repository directly bypasses all of that.

**Where does a facade live?**

- Logic specific to one feature → `features/<name>/facades/`
- Logic reused across multiple features → promote to the relevant `features/core/<sub-module>/facades/`

**Promotion rule:** every hook-based repository access lives in a facade — even for page-specific logic. The promotion question is about the facade itself: if the same facade would be duplicated across two pages, extract it to `facades/` and import it from both. If it's new logic, write it directly in `facades/` from the start.

**Concrete examples:**

Stay in `.logic.ts` as a direct facade call (not promoted yet):

```ts
// Only ItemDetailPage needs this exact combination
export const useItemDetailLogic = () => {
  const { getItemById } = useGetItems(); // already a facade
  const item = getItemById(itemId);
  return { item };
};
```

Promote to `facades/` when logic is reused across pages:

```ts
// HomePageLogic and ProfilePageLogic both need upcoming item + totals
// → extract to features/items/facades/useGetItems.ts
import { filterItemsUseCase } from '@/features/items/di/resolve';

export const useGetItems = () => {
  const repo = useItemRepository();
  const items = repo.getItems();
  return {
    upcomingItem: items ? filterItemsUseCase.execute(items) : undefined,
    totalItems: items?.length ?? 0,
    activeItems: items?.filter(t => t.isActive) ?? [],
  };
};
```

Promote to `facades/` even if used once when composition is complex enough to name:

```ts
// Coordinates AI generation (IoC use case) + database save (hook-based repo)
// → worth naming even if only one page uses it
// features/items/facades/useCreateItem.ts
export const useCreateItem = () => { ... };
```

```ts
// features/items/facades/useGetItems.ts
import { filterItemsUseCase } from '@/features/items/di/resolve';

export const useGetItems = () => {
  const repo = useItemRepository();
  const items = repo.getItems();

  return {
    isLoading: items === undefined,
    upcomingItem: items ? filterItemsUseCase.execute(items) : undefined,
    totalItems: items?.length ?? 0,
    activeItems: items?.filter(t => t.isActive) ?? [],
    getItemById: (id: string) => items?.find(t => t.id === id),
  };
};
```

```ts
// features/items/facades/useCreateItem.ts — coordinates AI use case + reactive repo
import { generateItemUseCase } from '@/features/items/di/resolve';
import { useToast } from '@/features/core/utils';

export const useCreateItem = () => {
  const repo = useItemRepository();
  const { showErrorToast } = useToast(); // showErrorToast(error: BaseError) — translates internally, safe to call in callbacks

  const generate = async (formData: ItemFormData) => {
    const result = await generateItemUseCase.execute(formData);   // returns Result<GeneratedItem>
    if (!result.success) {
      showErrorToast(result.error);
      return;
    }
    const saveResult = await repo.createItem(result.data);        // returns Result<void>
    if (!saveResult.success) {
      showErrorToast(saveResult.error);
    }
  };

  return { generate };
};
```

---

### `hooks/`

Utility hooks — feature-specific stateful or derived logic that is reused across multiple pages within this feature, but does **not** coordinate repositories or use cases. If a utility hook is needed by more than one feature, promote it to `features/core/utils/hooks/`.

Hooks in this folder do not import from `data/repositories/`, `useCases/`, or `di/resolve.ts`. They may import domain types, state stores, and external library hooks.

```ts
// features/items/hooks/useItemSearchFilters.ts
export const useItemSearchFilters = () => {
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


| Use state when                                                 | Use a facade when                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Data is client-only (form inputs, UI selection, wizard step)   | Data comes from the server/backend                                 |
| Data outlives a single screen but has no server representation | Data needs to be fetched, subscribed to, or mutated on the backend |
| You need to reset or clear the data on user action             | The "source of truth" is the database, not the client              |


**Where state is accessed — facade vs `.logic.ts`**

State stores can be imported at both the facade and `.logic.ts` layers. The layer that owns the **decision driving the state change** is where state access belongs:

- **Facade** — when the state write is the result of an operation (use case executed → write outcome to state). The facade owns the full flow: execute → handle error → persist result. Keeping the write in the facade means `.logic.ts` calls a single function and has nothing left to do.
- `**.logic.ts`** — when the state is pure UI state with no operation behind it (form fields, active filter, wizard step). No use case involved — just local UI management.

A `.logic.ts` can do both simultaneously — call a facade for complex operations and manage local UI state directly:

```ts
export const useSearchPageLogic = () => {
  const { add } = useAddRecentItem();              // facade — operation + state write
  const { query, setQuery } = useSearchStore(...); // direct state — pure UI
  return { add, query, setQuery };
};
```

---

**Store structure — state + actions pattern**

All stores follow the same pattern: a typed state slice plus an `actions` object. Actions are always nested under `actions` to keep the store shape clean and make it obvious what is state vs what is a setter.

```ts
// features/items/state/itemStore.ts
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { createSelectors } from '@/features/core/state/libraries/createSelectors';
import { registerStore } from '@/features/core/state/libraries/createStore';

interface ItemState {
  detailsInfo: { name: string; coordinates?: Coordinates; };
  datesInfo: { startDate: Date | null; endDate: Date | null; totalNoOfDays: number; };
  categoryInfo: CategoryLevel;
}

interface ItemActions {
  actions: {
    setDetailsInfo: (info: ItemState['detailsInfo']) => void;
    setDatesInfo: (info: ItemState['datesInfo']) => void;
    setCategoryInfo: (category: CategoryLevel) => void;
    resetItemState: () => void;
  };
}

const initialState: ItemState = {
  detailsInfo: { name: '', coordinates: undefined },
  datesInfo: { startDate: null, endDate: null, totalNoOfDays: 0 },
  categoryInfo: CategoryLevel.Basic,
};

// Export the factory for isolated testing — pass a mock IStorage to avoid touching MMKV.
// The singleton below is the only instance used in production.
export const createItemStore = () =>
  createWithEqualityFn<ItemState & ItemActions>()(
    set => ({
      ...initialState,
      actions: {
        setDetailsInfo: detailsInfo => set({ detailsInfo }),
        setDatesInfo: datesInfo => set({ datesInfo }),
        setCategoryInfo: categoryInfo => set({ categoryInfo }),
        resetItemState: () => set(initialState),
      },
    }),
    shallow,
  );

export const useItemStore = createItemStore();
// Build selectors once at module load — never call createSelectors inside a hook.
export const itemStoreSelectors = createSelectors(useItemStore);
registerStore(useItemStore);
```

**The one rule that governs actions: a store action contains exactly one `set()` call — nothing else.**

Any conditional, transformation, filter, sort, or computation does not belong in a store action. It belongs in a use case. The flow when a mutation requires logic:

```ts
// ✅ Correct — use case computes, facade writes result via setter
// features/items/facades/useAddRecentItem.ts
import { addRecentItemUseCase } from '@/features/items/di/resolve';
import { useToast } from '@/features/core/utils';
import { useItemStore } from '@/features/items/state/itemStore';

export const useAddRecentItem = () => {
  const { actions } = useItemStore(); // at hook level — stable reference, no re-render cost
  const { showErrorToast } = useToast();

  const add = async (input: ItemInput) => {
    const result = await addRecentItemUseCase.execute(input); // business logic lives here
    if (!result.success) {
      showErrorToast(result.error);
      return;
    }
    actions.setData(result.data); // store only receives the final value
  };

  return { add };
};

// ❌ Wrong — logic inside a store action
actions: {
  addItem: (item) => set(state => ({
    items: [...state.items.filter(i => i.id !== item.id), item]  // filtering logic — belongs in a use case
      .sort((a, b) => b.createdAt - a.createdAt)                 // sorting logic — belongs in a use case
      .slice(0, MAX_ITEMS),                                       // capping logic — belongs in a use case
  })),
}
```

---

**Selectors — avoid unnecessary re-renders**

Every store exports a pre-built `createSelectors` result alongside the store singleton. Import the selectors object and call the key you need — each selector subscribes only to its own slice, so the component re-renders only when that field changes.

`createSelectors` must be called **once at module level**, never inside a hook. Calling it inside a hook would rebuild the entire `.use` object on every render, creating new function references and undermining the re-render optimisation.

```ts
// features/items/state/itemStore.ts
export const itemStoreSelectors = createSelectors(useItemStore); // ← module level, once

// features/items/state/useItemState.ts
import { itemStoreSelectors } from '@/features/items/state/itemStore';

export const useItemState = () => {
  const { actions, ...selectors } = itemStoreSelectors.use;
  const itemActions = actions();
  return {
    detailsInfo: selectors.detailsInfo(), // ✅ re-renders only when detailsInfo changes
    itemActions,
  };
};

// ❌ Wrong — createSelectors called on every render
export const useItemState = () => {
  const store = createSelectors(useItemStore); // rebuilds .use every render
  const { actions, ...selectors } = store.use;
  ...
};

// ❌ Wrong — subscribes to the entire store
const store = useItemStore();
```

---

**Feature state vs global state**


| State                                                          | Location                     |
| -------------------------------------------------------------- | ---------------------------- |
| Item wizard inputs                                             | `features/items/state/`      |
| Feature-specific UI flags                                      | `features/<name>/state/`     |
| App-wide theme, language                                       | `features/core/state/app/`   |
| Modal visibility (shared modals)                               | `features/core/state/modal/` |
| `createSelectors`, `registerStore`, `resetAllStores` utilities | `features/core/state/`       |
| MMKV → Zustand storage adapter (`createZustandStorage`)        | `features/core/state/`       |


---

**Persistence**

Only persist state that cannot be reconstructed cheaply. Wizard form inputs that survive app restart are a valid use case. Derived data, cached server responses, and anything easily re-fetched should never be persisted.

Every persisted store **must** use Zustand's `persist` middleware with an explicit `version`, a `migrate` function, and `partialize`. Without this, any change to the store shape silently corrupts data on existing devices.

```ts
// features/items/state/itemWizardStore.ts
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { storage as defaultStorage } from '@/features/core/storage';
import type { IStorage } from '@/features/core/storage';
import { createSelectors, createZustandStorage, registerStore } from '@/features/core/state';

export const createItemWizardStore = (storageClient: IStorage = defaultStorage) =>
  createWithEqualityFn<ItemState & ItemActions>()(
    persist(
      set => ({
        ...initialState,
        actions: {
          setDetailsInfo: detailsInfo => set({ detailsInfo }),
          setDatesInfo: datesInfo => set({ datesInfo }),
          resetItemState: () => set(initialState),
        },
      }),
      {
        name: 'item-wizard-store',
        version: 1,
        migrate: (persistedState) => ({
          // Preserve fields that represent user preference; reset everything else.
          // Add explicit field-level handling here when bumping version.
          ...initialState,
          detailsInfo: (persistedState as Partial<ItemState>)?.detailsInfo ?? initialState.detailsInfo,
        }),
        storage: createZustandStorage(storageClient),
        partialize: ({ detailsInfo, datesInfo }) => ({ detailsInfo, datesInfo }),
      },
    ),
    shallow,
  );

export const useItemWizardStore = createItemWizardStore();
export const itemWizardStoreSelectors = createSelectors(useItemWizardStore);
registerStore(useItemWizardStore);
```

**`createZustandStorage`** is a factory exported from `features/core/state` that bridges `IStorage` (the domain interface from `features/core/storage`) to Zustand's `StateStorage` contract. It accepts an `IStorage` instance so stores remain testable — pass a mock `IStorage` in tests to avoid touching MMKV.

Rules for persisted stores:

- **`name`** is a stable identifier — never embed a version suffix in the name. Use the separate `version` field instead.
- **`version`** must be incremented on every breaking shape change.
- **`migrate`** receives the persisted state from the previous version. Prefer preserving meaningful user data (preferences, wizard inputs) over always resetting — but reset fields whose shape changed incompatibly.
- **`partialize`** must be explicit — list only the fields that should reach disk. Actions, loading flags, and ephemeral UI state must be excluded.
- **`storage`** always uses `createZustandStorage(storageClient)` — never raw `AsyncStorage` or the MMKV instance directly.

**Post-rehydration cleanup** — if persisted data can become stale (e.g. date fields that expire), handle it in `onRehydrateStorage` using a pure function defined alongside the store:

```ts
// features/items/state/clearExpiredDates.ts
export const clearExpiredDates = (state: ItemState): Partial<ItemState> => {
  if (state.datesInfo.startDate && new Date(state.datesInfo.startDate) < new Date()) {
    return { datesInfo: initialState.datesInfo };
  }
  return {};
};

// in persist options:
onRehydrateStorage: () => (state, error) => {
  if (error || !state) return;
  Object.assign(state, clearExpiredDates(state));
},
```

---

**Global reset — `registerStore` and `resetAllStores`**

Every store singleton must register itself with the global reset registry immediately after creation by calling `registerStore`. This captures a snapshot of the store's initial state and enables `resetAllStores()` to wipe all in-memory state in a single call — used on logout to prevent user data from bleeding into the next session.

```ts
// At the bottom of every store file:
export const useItemStore = createItemStore();
registerStore(useItemStore); // must be called before any set() reaches the store
```

`resetAllStores()` is called in the logout facade after a successful sign-out:

```ts
// features/profile/facades/useLogout.ts
import { resetAllStores } from '@/features/core/state';

const logout = async () => {
  const result = await repo.signOut();
  if (!result.success) { showErrorToast(result.error); return false; }
  resetAllStores(); // wipe all in-memory state
  return true;
};
```

Two constraints to keep the snapshot valid:

1. **Call `registerStore` before any render** — the snapshot is captured at call time. If a render fires first, the snapshot may include already-mutated state.
2. **Never mutate nested objects in place** — `registerStore` captures state by reference. In-place mutation corrupts the snapshot silently. Always replace nested objects via `set({ field: newValue })`, never `set(s => { s.field.x = y; return s; })`.

`resetAllStores` resets **in-memory state only**. Persisted MMKV data is unaffected — call the store's persist middleware `clearStorage` separately if a full wipe is needed.

Factory instances created for testing must **not** call `registerStore` — only the production singleton should be registered.

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
- **Core hooks** (`features/core/utils` via `index.ts`) — for cross-feature utilities (debounce, formatting…) and core sub-module facades (e.g. `features/core/images` via its `index.ts`)
- **Class use cases** (`features/<name>/di/resolve`) — for page-specific business logic (when not reused)
- **State** (`features/<name>/state/`) — for local UI state

When the same combination appears in more than one page, promote it to a facade in `facades/`.

```ts
// ✅ PageName.logic.ts — using a facade (coordination reused across pages)
import { useGetItems } from '@/features/items/facades/useGetItems';
import { useItemStore } from '@/features/items/state/itemStore';

export const usePageNameLogic = () => {
  const { upcomingItem, isLoading } = useGetItems();  // reused → promoted to facade
  const { actions } = useItemStore();                 // local UI state

  return { upcomingItem, isLoading, actions };
};
```

```ts
// ✅ PageName.logic.ts — using a class use case directly (page-specific, not yet promoted)
import { filterItemsUseCase } from '@/features/items/di/resolve';
import { useGetItems } from '@/features/items/facades/useGetItems';
import { useItemStore } from '@/features/items/state/itemStore';

export const usePageNameLogic = () => {
  const { items } = useGetItems();                                 // data via facade
  const upcoming = items ? filterItemsUseCase.execute(items) : undefined; // page-specific logic
  const { actions } = useItemStore();

  return { upcoming, actions };
};
```

```ts
// ❌ PageName.logic.ts — never imports hook-based repositories
import { useItemRepository } from '@/features/items/data/repositories/useItemRepository';

// ❌ PageName.logic.ts — never imports IoC repositories directly
import { imageRepository } from '@/features/core/images/di/resolve';
```

---

## DI Container

Each feature that has injectable singletons owns its DI configuration. Configuration lives alongside the code it belongs to.

```
features/
├── core/
│   ├── error/
│   │   └── di/
│   │       ├── types.ts    → ERROR_TYPES = { Logger: Symbol.for('Logger'), … }
│   │       ├── config.ts   → registers BasicLogger or SentryLogger based on __DEV__
│   │       └── resolve.ts  → export const logger = container.resolve<ILogger>(ERROR_TYPES.Logger)
│   ├── storage/
│   │   └── di/
│   │       ├── types.ts
│   │       ├── config.ts
│   │       └── resolve.ts
│   ├── http/
│   │   └── di/
│   │       ├── types.ts
│   │       ├── config.ts
│   │       └── resolve.ts
│   └── images/
│       └── di/
│           ├── types.ts
│           ├── config.ts
│           └── resolve.ts
├── ai/
│   └── di/
│       ├── types.ts
│       ├── config.ts
│       ├── factories/     ← optional: one file per instance that needs non-trivial setup
│       │   └── primary.ts
│       └── resolve.ts
└── items/              ← (hook-based repos only — no di/ needed)
```

Features that use only hook-based repositories (e.g. items, entity) have no `di/` folder — they don't need one.

`**factories/` subfolder** — optional, used when creating a dependency requires non-trivial setup (e.g. reading a config value, calling an SDK factory function). Each factory file is a pure module: it creates and exports one instance with no tsyringe imports and no `container` calls. `config.ts` imports from `factories/` and is the only file that registers with the container. This keeps factory logic testable in isolation and keeps all DI registrations visible in one place.

**Inline in `config.ts` vs `factories/`** — use this rule to decide:


| Situation                                                                  | Where to create the instance            |
| -------------------------------------------------------------------------- | --------------------------------------- |
| Simple instantiation — `new Foo()` or `new Foo({ staticValue: true })`     | Inline in `config.ts`                   |
| Requires reading config / env values (e.g. API key from `Constants`)       | `di/factories/`                         |
| Requires validation before creation (e.g. throw if key is missing)         | `di/factories/`                         |
| Requires calling an SDK factory function (e.g. `createServiceProvider`) | `di/factories/`                         |
| Multiple instances of the same type (e.g. two AI providers)                | `di/factories/` — one file per instance |


The guiding question: *could this creation logic benefit from being tested or read in isolation?* If yes, it belongs in `factories/`. If it is a single `new Foo()` with no moving parts, inline in `config.ts` is fine.

```ts
// di/factories/primary.ts — pure factory, no tsyringe
const apiKey = Constants.expoConfig?.extra?.serviceApiKey;
if (!apiKey) throw new Error('Missing service API key.');
export const serviceProvider = createServiceProvider({ apiKey });

// di/config.ts — only file that touches the container
import { serviceProvider } from './factories/primary';
container.registerInstance(AI_TYPES.PrimaryProvider, serviceProvider);
container.registerSingleton<IAiClient>(AI_TYPES.PrimaryServiceClient, ServiceClient);
```

**Self-bootstrapping** — each feature's `resolve.ts` imports its own `config.ts` as the first import. This creates a hard dependency edge in the module graph: the bundler is forced to evaluate `config.ts` before `resolve.ts`'s body runs, regardless of what any other file does. No central orchestrator file is needed or used.

```ts
// features/core/dates/di/resolve.ts
import 'reflect-metadata';
import './config'; // ← guarantees registrations run before any container.resolve() call

import { container } from 'tsyringe';
// ...
export const getTodayInLocalTimezoneUseCase = container.resolve<GetTodayInLocalTimezoneUseCase>(
  DATES_TYPES.GetTodayInLocalTimezoneUseCase,
);
```

This keeps DI fully scoped inside the owning feature. Adding a new feature with injectable singletons requires no changes outside that feature's own `di/` folder.

**Usage** — two access patterns depending on whether you are inside or outside the owning feature:

```ts
// Within the same feature — import directly from di/resolve.ts
// features/core/images/facades/useGetImage.ts
import { fetchImageUseCase } from '@/features/core/images/di/resolve';

// From another feature — always import via the sub-module's index.ts
import { logger } from '@/features/core/error';
import { fetchImageUseCase } from '@/features/core/images';
import { aiClient } from '@/features/ai';
```

Never instantiate services directly — always import from `di/resolve.ts` (internally) or `index.ts` (cross-feature).

**Quick-reference: allowed import patterns**


| Caller                                 | Target                            | Import from                                 |
| -------------------------------------- | --------------------------------- | ------------------------------------------- |
| Same-feature `facades/` or `.logic.ts` | Own use case or singleton         | `@/features/<name>/di/resolve`              |
| Same-feature `facades/` or `.logic.ts` | Core sub-module singleton         | `@/features/core/<sub-module>` (`index.ts`) |
| Any file                               | Core hook, type, or facade        | `@/features/core/<sub-module>` (`index.ts`) |
| Any file                               | Another feature's type or facade  | `@/features/<name>` (`index.ts`)            |
| Any file                               | Another feature's internal folder | ❌ never                                     |


---

## DI Patterns

### Pattern 1 — IoC container singletons (e.g. tsyringe)

Used for: services, HTTP-based repositories, and use cases. All of these are **stateless** — they hold no mutable data between calls. Because they are stateless, registering them as singletons is correct: one instance is created at startup and reused for the entire app lifetime. If a class ever needed mutable internal state, it would need a transient lifetime (new instance per resolution) — but none of our IoC classes have that requirement.

All three follow the same three-file DI pattern inside the owning feature's `di/` folder:

**Services** (e.g. Logger, Storage, AI client):


| Layer                       | Location                                           |
| --------------------------- | -------------------------------------------------- |
| Interface                   | `features/<name>/domain/entities/services/IXxx.ts` |
| Implementation              | `features/<name>/data/services/Xxx.ts`             |
| Library wrapper             | `features/<name>/libraries/xxxClient.ts`           |
| DI types / config / resolve | `features/<name>/di/`                              |


**HTTP-based repositories**:


| Layer                       | Location                                                         |
| --------------------------- | ---------------------------------------------------------------- |
| Interface                   | `features/<name>/domain/entities/repositories/IXxxRepository.ts` |
| Implementation              | `features/<name>/data/repositories/XxxRepository.ts`             |
| DI types / config / resolve | `features/<name>/di/`                                            |


**Use cases**:


| Layer                       | Location                                 |
| --------------------------- | ---------------------------------------- |
| Class                       | `features/<name>/useCases/XxxUseCase.ts` |
| DI types / config / resolve | `features/<name>/di/`                    |


### Pattern 2 — Hook-based repositories (e.g. Convex)

Used for: reactive backend data access (queries and mutations).

The reactive backend client (e.g. Convex) exposes hooks that establish real-time subscriptions tied to the auth provider context (e.g. Clerk). This cannot be replicated in a class singleton without losing reactivity and breaking auth.


| Layer          | Location                                                         |
| -------------- | ---------------------------------------------------------------- |
| Interface      | `features/<name>/domain/entities/repositories/IXxxRepository.ts` |
| Implementation | `features/<name>/data/repositories/useXxxRepository.ts` (hook)   |
| Consumed by    | `features/<name>/facades/useXxx.ts`                              |


No IoC container entry needed — the hook is the injection mechanism.

---

## tsyringe Reference

This section documents the tsyringe mechanisms used in this project, with verified definitions and the rules for how each is applied.

> **Official docs:** [https://github.com/microsoft/tsyringe](https://github.com/microsoft/tsyringe)

### Mechanism table


| Mechanism                                     | What it does                                                                                                                        | When it is required                                                                                                                                                                                                                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reflect-metadata`                            | Enables the TypeScript decorator metadata needed by tsyringe to read constructor parameter types at runtime                         | Must be imported **once**, before any DI code runs. In this project it is imported at the top of every `di/config.ts` and `di/resolve.ts`.                                                                                                                                          |
| `@injectable()`                               | Marks a class so tsyringe can read its constructor parameter metadata. Without it, tsyringe cannot inject constructor dependencies. | Required on any class whose constructor receives injected parameters. **Not needed** on classes with no constructor dependencies (e.g. pure stateless use cases).                                                                                                                   |
| `@singleton()`                                | Shorthand decorator that combines `@injectable()` + singleton lifetime registration.                                                | **Not used in this project.** Explicit `container.registerSingleton()` in `di/config.ts` is preferred for clarity and consistency. Combining both is redundant — `registerSingleton()` documentation states it is the "Alternative to the `@singleton()` decorator".                |
| `@inject(token)`                              | Tells tsyringe which token to use when resolving a specific constructor parameter.                                                  | Required when a constructor parameter is typed as an interface (interfaces are erased at runtime — tsyringe cannot infer the token automatically). Always used alongside `@injectable()`.                                                                                           |
| `container.registerSingleton(token, Class)`   | Registers `Class` under `token` with singleton lifetime (one instance for the entire app).                                          | Used in every `di/config.ts` for services and use cases. Replaces the `@singleton()` decorator.                                                                                                                                                                                     |
| `container.registerInstance(token, instance)` | Registers a pre-created object instance under `token`.                                                                              | Used when the object needs constructor arguments that are not themselves injected (e.g. `new MMKV({ id: 'app-storage' })`). The instance is created in the feature's composition root (inline in `di/config.ts` or in a `di/factories/` module) and registered from `di/config.ts`. |
| `container.resolve<T>(token)`                 | Resolves and returns the registered instance for `token`.                                                                           | Called in `di/resolve.ts` to obtain the singleton and export it as a plain constant. Never called outside `di/resolve.ts`.                                                                                                                                                          |


### Lifetime note: singleton vs transient

tsyringe supports two main lifetimes:

- **Singleton** — one instance is created on first resolution and reused forever. Used for all services and use cases in this project (all are stateless).
- **Transient** — a new instance is created on every `container.resolve()` call. Not currently used. If a class ever held mutable internal state between calls it would need transient registration, but no such class exists.

### `reflect-metadata` import order rule

`reflect-metadata` must be imported **before** any class decorated with `@injectable()` or `@inject()` is evaluated, and before any `container.resolve()` call. In this project the rule is enforced structurally:

1. `di/config.ts` starts with `import 'reflect-metadata'` and registers all classes.
2. `di/resolve.ts` starts with `import 'reflect-metadata'` and `import './config'` — the `./config` import is a hard module-graph dependency that forces the bundler to evaluate `config.ts` (and therefore run all registrations) before the `resolve.ts` body runs.

This eliminates any runtime ordering risk without a central bootstrap file.

### Project rules

- **Never use `@singleton()`** — use `container.registerSingleton()` in `di/config.ts` instead.
- **Use `@injectable()` only when needed** — pure stateless use cases with no constructor parameters do not need it. Add it as soon as a constructor parameter is introduced.
- **Always pair `@injectable()` with `@inject(token)`** when the parameter type is an interface. Forgetting `@inject()` causes a silent resolution failure at runtime.
- **Never call `container.resolve()` outside `di/resolve.ts`** — resolution happens once, the result is exported as a plain constant and consumed everywhere else.
- **`di/config.ts` never calls `container.resolve()`.** Cross-feature dependencies (e.g. `logger`, `httpClient`) are declared via `@inject()` decorators on the class constructor — tsyringe resolves them automatically at injection time. If a feature's config requires another feature to be bootstrapped first (i.e. its tokens registered), add a side-effect import of that feature's `index.ts` at the top of `di/config.ts` (e.g. `import '@/features/core/http'`). This triggers the dependency's self-bootstrap without importing any resolved value. `container.resolve()` is only ever called in `di/resolve.ts`, and only for tokens the owning feature itself registered.
- **Constructors in IoC classes must be empty** — the body is always `{}`. The constructor only declares `@inject()`-decorated parameters, which TypeScript automatically assigns to private fields. No object creation, no validation, no logic, no side effects of any kind. All setup belongs in the feature's composition root (`di/config.ts` or `di/factories/`). Use `private readonly` on a parameter when the value is needed by class methods.
- **All client/object creation belongs in the feature's composition root** — build dependencies either inline in `di/config.ts` or in a pure `di/factories/` module, then register the ready-to-use object from `di/config.ts` via `container.registerInstance()`. The class then receives the object directly.
  This rule exists for three reasons:
  1. **Testability** — when everything enters via injection, any dependency can be swapped in a test without touching the class. If the constructor builds dependencies internally, they cannot be intercepted without mocking at the module level, which is fragile and couples tests to implementation details.
  2. **Single responsibility** — the class has one job: implement its interface. Deciding how to configure and build its dependencies is a different job that belongs to the composition root. Mixing both makes the class know too much about its own wiring.
  3. **Explicit dependency graph** — the constructor signature becomes a complete, honest declaration of what the class needs. No hidden reads from `Constants`, no internal `new Something()` buried in the body. The full dependency surface is visible at a glance.

```ts
// di/config.ts — validation, construction, and registration in the composition root
const apiKey = Constants.expoConfig?.extra?.serviceApiKey;
if (!apiKey) throw new Error('Missing API key.');
const client = new SomeClient({ apiKey });  // built here, not in the class
container.registerInstance(FEATURE_TYPES.SomeClient, client);
container.registerSingleton<IService>(FEATURE_TYPES.Service, ConcreteService);

// data/services/ConcreteService.ts — constructor body is always empty
@injectable()
export class ConcreteService implements IService {
  constructor(
    @inject(FEATURE_TYPES.SomeClient) private readonly client: SomeClient,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  doSomething(): void {
    this.client.call();
  }
}
```

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

## Error Handling

Error handling follows a dedicated strategy documented in **[ERROR_HANDLING.md](./ERROR_HANDLING.md)**. Read that document before writing any code that can fail.

The key rules that integrate with this architecture:

- Functions that can fail return `Result<T>` (`features/core/error/domain/entities/Result.ts`) — a discriminated union of `{ success: true; data: T }` or `{ success: false; error: BaseError }`.
- Use the `ok(data)` and `fail(error)` helpers to construct results without boilerplate.
- `**data/repositories/`** — catch, wrap with `ensureError`, return `Result`.
- `**useCases/**` — receive `Result` from repos, log on failure via injected `ILogger`, return `Result`.
- `**facades/**` — receive `Result` from use cases, decide how to surface failure (toast, inline state, or throw for the error boundary).
- `**.logic.ts**` — consumes facades, maps failure to view state. No `try/catch`, no logging.
- `**.tsx**` — renders error state from the ViewModel. Never handles raw errors.
- Logging: `BasicLogger` in dev, `SentryLogger` in prod — always injected via `ILogger`, never `console.error`.
- Error boundaries: root boundary in `app/_layout.tsx`, route-level boundaries for high-risk screens.

---

## `app/` — Routing

File-based routing. Route files are **thin entry points** — they import and render a `Page` component from `features/`.

```
app/
└── (main)/
    ├── (login)/           → Public screens: welcome, sign-in, sign-up
    └── (authenticated)/   → Protected screens (requires auth)
        ├── (tabs)/        → Tab navigator: home, profile
        ├── create-item/   → Multi-step item creation wizard
        ├── items/         → Show all items
        └── profile/       → Language settings
```

---

## Backend (`/convex`)

Serverless backend functions and database schema.

```
convex/
├── schema.ts       → Database tables: users, items
├── users.ts        → User queries and mutations
├── items.ts        → Item queries and mutations
├── validators/     → Input validation
└── auth.config.ts  → Auth provider integration
```

---

## How a Screen Works (End to End)

```
app/(authenticated)/items/search.tsx
  └── renders <SearchPage />                             ← features/items/ui/pages/
        ├── uses useSearchPageLogic()                    ← SearchPage.logic.ts (ViewModel)
        │     ├── reads/writes useItemStore()            ← features/items/state/
        │     └── calls useGetImage()                   ← features/core/images/facades/ (core facade)
        │           └── fetchImageUseCase.execute()      ← features/core/images/di/resolve (IoC container)
        └── renders <PlacesAutocomplete />               ← ui/components/composite/
```

---

## Documentation

All public methods must have a TSDoc comment. This includes every `execute()` method on use cases, every method on repository and service interfaces, and any public facade or hook return value that is not self-evident from its name and type.

Private methods must be documented when their behaviour is not immediately obvious from the name and signature — for example, when they throw, apply non-trivial transformations, or have constraints that callers must respect. Straightforward private helpers with self-explanatory names do not require a comment.

TSDoc format:

```ts
/**
 * Brief description of what the method does.
 *
 * @param paramName - Description. Include constraints or accepted formats if relevant.
 * @returns Description of the return value, including edge cases (e.g. returns '' on invalid input).
 * @throws Description of when and why the method throws, if applicable.
 * @example
 * myUseCase.execute('input') // "output"
 */
```

---

## Naming Conventions


| Thing                | Convention                                 | Example                                 |
| -------------------- | ------------------------------------------ | --------------------------------------- |
| Components / screens | `PascalCase.tsx`                           | `ItemCard.tsx`, `HomeScreen.tsx`        |
| All other files      | `camelCase.ts`                             | `itemAdapter.ts`, `itemStore.ts`        |
| Hooks (any hook)     | `useXxx.ts`                                | `useItemStore.ts`, `useGetItems.ts`     |
| Domain entities      | `Noun.ts`                                  | `Item.ts`, `Airport.ts`                 |
| Interfaces           | `IXxx.ts`                                  | `IItemRepository.ts`, `ILogger.ts`      |
| Class repositories   | `XxxRepository.ts`                         | `ImageRepository.ts`                    |
| Hook repositories    | `useXxxRepository.ts`                      | `useItemRepository.ts`                  |
| Use cases            | `XxxUseCase.ts`                            | `FilterItemsUseCase.ts`                 |
| DTOs                 | `XxxResponseDTO.ts`                        | `ItemResponseDTO.ts`                    |
| Adapters             | `xxxAdapter.ts`                            | `itemAdapter.ts`                        |
| Schemas              | `XxxSchema.ts`                             | `GenerateItemSchema.ts`                 |
| Page files           | `PageName.tsx` / `.logic.ts` / `.style.ts` | `HomePage.tsx`                          |


### Import paths

Always use the `@/` path alias — never relative paths. This applies to every file in the project without exception.

```ts
// ✅ Always
import { logger } from '@/features/core/error';
import { useGetItems } from '@/features/items/facades/useGetItems';
import { useGetImage } from '@/features/core/images';

// ❌ Never
import { logger } from '../../../core/error/di/resolve';
import { useGetItems } from '../../facades/useGetItems';
```

Relative paths make files fragile to moves and impossible to read at a glance. The `@/` alias always resolves from the project root, making every import self-documenting.

---

## Rules

1. **Dependencies point inward.** `ui` → `facades` / `hooks` / `state` → `useCases` → `domain`. Never the reverse. See import rules below.

  | Layer                              | Can import                                                                                                                                                                                                           | Error responsibility                                                            |
  | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
  | `.tsx`                             | ViewModel                                                                                                                                                                                                            | Renders error state from ViewModel — no raw error handling                      |
  | `.logic.ts` (ViewModel)            | facades, hooks, core hooks, same-feature class use cases via `di/resolve` or cross-feature core singletons via `index.ts` (page-specific), state                                                                     | Maps facade failure to view state — no `try/catch`, no logging                  |
  | `facades/`                         | hook-based repos, same-feature class use cases via `di/resolve` or cross-feature core singletons via `index.ts`, other facades, utility hooks from `features/core/utils` (via `index.ts`), same-feature state stores | Receives `Result<T>`, decides surface: toast / inline / boundary throw          |
  | `hooks/`                           | domain types, state, external library hooks — **not** repos or use cases                                                                                                                                             | No error handling — hooks do not fail                                           |
  | `useCases/`                        | domain entities, repository interfaces (`IXxxRepository`), service interfaces (`IXxxService`) — all from `domain/`; never `libraries/` or concrete implementations                                                   | Catches, logs via `ILogger`, returns `Result<T>`                                |
  | `data/repositories/` (class-based) | domain interfaces, service interfaces via constructor injection — **never** `libraries/` directly                                                                                                                    | Catches, wraps with `ensureError`, returns `Result<T>` — never logs             |
  | `data/repositories/` (hook-based)  | Convex client hooks (`useQuery`, `useMutation`), auth context hook — direct import, documented exception                                                                                                             | Catches mutations with `ensureError`, returns `Result<T>` — never logs          |
  | `data/services/`                   | `libraries/` wrappers, domain service interfaces                                                                                                                                                                     | Wraps library calls; no error handling beyond what the library surface requires |

   **The one rule that never bends: IoC repositories must only be imported inside `useCases/` — never in `.logic.ts`, `facades/`, `hooks/`, or anywhere in `ui/`.**
2. `**domain/` is pure.** No external library imports, no framework code, no side effects.
3. `**data/` owns external systems.** Only `data/` imports from backend clients (e.g. Convex), HTTP libraries (e.g. ky), device storage SDKs (e.g. MMKV).
4. `**libraries/` is consumed exclusively by `data/services/`.** Class-based repositories never import from `libraries/` — they receive service interfaces via constructor injection. Hook-based repositories are the sole documented exception: they import Convex and auth hooks directly because those hooks require the React lifecycle and cannot be wrapped in a class singleton.
5. **Schemas in `domain/schemas/`.** Schemas (e.g. Zod) define domain rules — they are not infrastructure concerns.
6. **Adapters transform, validators execute.** Adapters convert DTOs to entities; validators run schemas against data.
7. **Pages are thin.** All logic in `.logic.ts` hooks, all styles in `.style.ts` files.
8. **Feature state in `state/`.** Global state (store utils, app state, modal state) in `features/core/state/`.
9. **Never instantiate services directly.** Always import from the feature's `di/resolve.ts`.
10. **Reactive backends = hook-based repositories.** Never wrap reactive backend hooks (e.g. Convex `useQuery`) in a class singleton.
11. **Feature isolation.** Features only import from `features/core/<sub-module>` (via its `index.ts`) or from another feature's public API (`index.ts`). Never reach into another feature's or core sub-module's internal folders (`data/`, `domain/`, `facades/`, etc.).
12. **Always use `@/` path aliases.** Never use relative paths (`./` or `../`) anywhere in the project.
13. **Errors are values.** Functions that can fail return `Result<T>`. See [ERROR_HANDLING.md](./ERROR_HANDLING.md) for the full contract — layer rules, logging, error boundaries, and UI mapping.

---

## Patterns Reference

This section briefly explains the design patterns used in this architecture. You do not need to know these patterns to work effectively on the project — the folder structure and rules above encode all the decisions for you. This section exists for context and to give names to what you are already doing.

### Clean Architecture

**What it is:** An architectural approach where code is organized in concentric layers, each with a clear responsibility. Dependencies always point inward — outer layers know about inner ones, but inner layers know nothing about outer ones.

**How we use it:** `domain/` is the innermost layer — pure TypeScript, no external imports. `data/` wraps external systems and implements domain contracts. `useCases/` orchestrates domain logic. `facades/` and `ui/` sit on the outside. Swapping any outer layer (e.g. changing the backend) never touches the domain.

---

### Repository Pattern

**What it is:** An abstraction layer over data access. Instead of calling a database or HTTP API directly, you call a repository interface. The interface defines what data operations are available; the implementation decides how they work.

**How we use it:** `domain/entities/repositories/` defines the interface (`IItemRepository`). `data/repositories/` provides the implementation — either a hook (for reactive backends) or a class (for HTTP APIs). Use cases call the interface and never know which implementation is running.

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

**How we use it:** `facades/` combines hook-based repositories (reactive data) with class use cases (business logic) into a single, named hook. The caller (`logic.ts`) calls `useGetItems()` without knowing that this involves a Convex subscription, an auth hook, and a filtering use case.

---

### MVVM (Model–View–ViewModel)

**What it is:** A UI pattern that separates the view (what you see) from its logic (what it does). The ViewModel is a layer between the view and the data that prepares data for display and handles user actions.

**How we use it:** `PageName.tsx` is the View — pure JSX, no logic. `PageName.logic.ts` is the ViewModel — a custom hook that fetches data, computes derived state, and exposes action handlers. The View only consumes the ViewModel's output.

---

### Public API / Barrel Export Pattern

**What it is:** A module exposes only a curated set of exports via an entry point (`index.ts`). Internal implementation files are not directly importable by consumers.

**How we use it:** Each feature that shares something with another feature has an `index.ts` that explicitly lists what is public. Consumers import from `@/features/catalog`, never from `@/features/catalog/data/repositories/...`. This keeps internal refactoring invisible to the outside.

---

### Singleton Pattern

**What it is:** A class that has exactly one instance for the lifetime of the application.

**How we use it:** All IoC-registered classes (services, repositories, use cases) are stateless — they hold no mutable data. Because of this, registering them as singletons is both safe and efficient: one instance is created at startup and reused everywhere.