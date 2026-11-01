# Performance monitoring conventions

How HolidAI measures work with performance spans. Spans go through the `startSpan` combinator
from `@/features/core/performance`, never `@sentry/react-native` directly.

## `startSpan`

`startSpan(options)` wraps an Effect in a span: it needs the `PerformanceTracker` Tag, which the
runtime provides as Sentry tracing in release builds and a no-op in development. A span ends with
its Effect and is marked failed when the Effect fails or is interrupted.

`SentryLive` starts each span with Sentry's `startInactiveSpan`, which never becomes the active
span, so a `startSpan` inside another one's Effect does not nest under it in the trace view: both
attach to whatever span is active at the time. Treat a span's name, not its place
in the tree, as what groups it.

```ts
import { AiSpanKeys } from '@/features/ai';
import { startSpan } from '@/features/core/performance';

const context = yield* ai.search(prompt).pipe(startSpan(AiSpanKeys.search));
```

`features/trip-generation/useCases/generateTrip.ts` is the example: the whole pipeline runs in
`ai.generate`, and each step in `ai.search` or `ai.extract`. Each step's span covers its
attempts, timeouts and retries together, so a span's length is what the user waited for that step.

Spans go in use cases and Live Layers. Tests get a `PerformanceTracker` that only
runs the Effect, from `makeTestAppLayer`.

## Span names: `<feature>.<action>`

- Lowercase, dot-separated; `<feature>` is the feature folder that owns the work.
- A step of a larger flow is named for its own action (`ai.search` within `ai.generate`).
- Never inline a name: each feature keeps its spans in `domain/utils/SpanKeys.ts`, one `SpanKeys`
  object, exported from `index.ts` under a feature prefix when another feature runs them
  (`AiSpanKeys`).

```ts
// features/ai/domain/utils/SpanKeys.ts
export const SpanKeys = {
  generate: { name: 'ai.generate', op: 'ai.run' },
  search: { name: 'ai.search', op: 'ai.run' },
  extract: { name: 'ai.extract', op: 'ai.run' },
} as const;
```

## Operation types (`op`)

Sentry groups and filters by `op`. Use these values; add a row here before using a new one.

| Category | `op` value |
| --- | --- |
| AI model call | `ai.run` |
| Database mutation | `db.mutation` |
| Database query | `db.query` |
| HTTP request | `http.client` |
| Authentication | `auth` |
| UI rendering | `ui.render` |
