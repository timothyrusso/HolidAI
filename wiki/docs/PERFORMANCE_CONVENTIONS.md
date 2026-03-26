# Performance Monitoring Conventions

Conventions for using `IPerformanceTracker` (`features/core/performance`) across the app.
All call sites must import from `@/features/core/performance` — never from `@sentry/react-native` directly.

---

## Span names — `<feature>.<action>`

Span names describe **what** is happening from the product perspective.

```
auth.signin
auth.signup
auth.reset_password
trip.generate
trip.generate.ai_search      ← child span: Google Search grounding step
trip.generate.ai_extract     ← child span: structured extraction step
trip.generate.db_save        ← child span: Convex persistence
home.data_load
```

**Rules**
- Lowercase, dot-separated
- `<feature>` matches the module or feature folder name
- `<action>` is `verb_noun` in snake_case
- Child spans add a third segment: `<feature>.<action>.<step>`

---

## Operation types (`op`)

The `op` field is used by Sentry for grouping and filtering across transactions.
Use these values consistently — do not invent new ones without updating this table.

| Category | `op` value |
|---|---|
| AI model call | `ai.run` |
| Database mutation | `db.mutation` |
| Database query | `db.query` |
| HTTP request | `http.client` |
| Authentication | `auth` |
| UI rendering | `ui.render` |

---

## Measurement keys — `<feature>.<metric_name>`

Measurement keys describe **what is being counted**.

```
trip.days_count                    ← number of days in the generated trip
trip.travelers_count               ← number of travelers
ai.search.input_tokens             ← input tokens for the grounding search step
ai.search.output_tokens            ← output tokens for the grounding search step
ai.search.total_tokens             ← total tokens for the grounding search step
ai.extract.input_tokens            ← input tokens for the structured extraction step
ai.extract.output_tokens           ← output tokens for the structured extraction step
ai.extract.total_tokens            ← total tokens for the structured extraction step
```

**Rules**
- Lowercase, dot-separated
- `<feature>` matches the module or feature folder name
- `<metric_name>` is `noun_noun` in snake_case
- Always pair with the correct `MeasurementUnit` from `@/features/core/performance`

---

## SpanKeys — where to define them

Each feature that uses `startSpan` must define its span keys in a `SpanKeys.ts` file under its own `domain/utils/` folder:

```
features/<name>/domain/utils/SpanKeys.ts
```

Span keys are performance metadata — not business entities — so they belong in `domain/utils/` rather than `domain/entities/`. The file exports a single `SpanKeys` const object grouping all spans for that feature:

```ts
// features/ai/domain/utils/SpanKeys.ts
export const SpanKeys = {
  generate: { name: 'ai.generate', op: 'ai.run' },
  search:   { name: 'ai.search',   op: 'ai.run' },
  extract:  { name: 'ai.extract',  op: 'ai.run' },
} as const;
```

Call sites import from the feature's own `domain/utils/SpanKeys` — never define span name strings inline.

---

## Where to call `performanceTracker`

| Layer | Allowed |
|---|---|
| `data/services/` | ✅ Wrap external I/O boundaries (HTTP clients, SDK wrappers) with `startSpan` — measure the actual call, not the coordination around it |
| `facades/` | ✅ Wrap async coordination flows with `startSpan` |
| `.logic.ts` (ViewModel) | ✅ Wrap flows not covered by a facade |
| `useCases/` | ❌ Performance tracking is a coordination concern, not business logic |
| `domain/` | ❌ Domain must remain pure TypeScript with no external dependencies |

---

## Usage example

```ts
import { MeasurementUnit, performanceTracker } from '@/features/core/performance';

const result = await performanceTracker.startSpan(
  { name: 'auth.signin', op: 'auth' },
  async () => {
    const res = await repo.signIn(email, password);
    return res;
  },
);
```

For nested child spans, call `startSpan` again inside the parent callback:

```ts
await performanceTracker.startSpan({ name: 'trip.generate', op: 'ai.run' }, async () => {
  await performanceTracker.startSpan({ name: 'trip.generate.ai_search', op: 'ai.run' }, async () => {
    const searchResult = await aiClient.search(prompt);
    performanceTracker.setMeasurement('ai.search.input_tokens', searchResult.usage.inputTokens, MeasurementUnit.None);
    performanceTracker.setMeasurement('ai.search.output_tokens', searchResult.usage.outputTokens, MeasurementUnit.None);
    performanceTracker.setMeasurement('ai.search.total_tokens', searchResult.usage.totalTokens, MeasurementUnit.None);
  });
});
```
