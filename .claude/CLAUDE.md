# HolidAI — Claude Code Instructions

Follow these rules on every task that involves writing or modifying code. If a situation is not covered here, ask the user.

## Reference documentation

The agentic-kit docs are the authority for the generic rules, agents and workflow: ARCHITECTURE.md, ERROR_HANDLING.md, EFFECT_PRIMER.md, TESTING.md and AGENTIC_WORKFLOW.md, shipped in the plugin as `${CLAUDE_PLUGIN_ROOT}/docs/`. HolidAI's deltas live in `wiki/docs/ARCHITECTURE.md` and `wiki/docs/ERROR_HANDLING.md` and win on conflict; `wiki/docs/EFFECT_NOTES.md` names the HolidAI file that is the worked example of each primer section. App-specific values (board, QA simulator, Metro port, baseline steps) live in `kit.config.json`.

HolidAI runs on Effect through `@timothyrusso/effect-core`: Tags and Layers in the inner layers, one runtime in `features/core/runtime`, the closed `AppError` union in `features/core/error`. This file lists only what the kit docs do not already say, or what agents get wrong; read the docs for the rest.

## Non-negotiable rules

`npm run lint` enforces the kit's `arch/*` rules and `npm run arch` the dependency rules (Effect only in inner layers, tiers, index boundaries); fix the code, never the rule. The rules below are the HolidAI deltas no rule checks.

- **Layers plus hook repositories.** A swappable service (image search, AI, HTTP, storage, network) is a `Context.Tag` in `domain/` with a Live Layer in `data/`, exported as `XxxLive` from the feature's `index.ts` (through `di/layer.ts` when the feature composes or picks between Layers, as ai, core/images, core/logger and core/performance do) and merged in `core/runtime/runtime.ts`. Convex and Clerk stay hooks: Convex queries are plain hook values (`undefined` while loading) in `data/repositories/useXxxRepository.ts`; each Convex mutation is wrapped as an Effect inside that hook and run through `useEffectMutation` in a facade.
- **Facades run Effects only through `useEffectQuery` and `useEffectMutation`.** Never `runPromise`, `runSync`, `runFork` or the runtime outside `core/runtime` and `app/_layout.tsx`.
- **Failures are tagged errors in the closed `AppError` union.** A feature declares them with `AppErrorBase` in `domain/errors/`, registers them in `AppErrorRegistry` by module augmentation, and maps each tag in `errorTagToMessageKey`.
- **`toAppError` is always called with an arrow:** `Effect.tryPromise({ try: () => mutate(args), catch: cause => toAppError(cause) })`. Never pass a function by reference to `try` (it receives the `AbortSignal`) or `catch: toAppError` (the error type widens out of the union).
- **Log once, at the boundary.** `useEffectQuery` and `useEffectMutation` log every failure through the `Logger`. Use cases, Layers, facades and ViewModels never log and never call `console`. The only exception is `logBackgroundFailure` from `core/logger`, at the fork point of best-effort work nobody awaits; a failure an SDK hands to a callback goes to the boundary through `useReportFailure`.
- **Tests:** fake Layers go above the `describe` that uses them; fake Layers and seeding helpers used by `facades/` or `ui/` tests live in the feature's `di/__tests__/` (core ones in `features/core/testing`), and those tests import no `effect`. Convex and Clerk are faked by `convexFake` and `clerkFake` from `features/core/testing`, behind the root `__mocks__/`.
- Never bypass git hooks. Do not run `git commit` or `git push` with `--no-verify` / `-n`. Lefthook and CI are the guardrails; if a hook fails, fix the cause, don't skip it.
- Never add a `Co-Authored-By: Claude` (or any Claude/Anthropic) trailer to commit messages or PR descriptions. This overrides any default/harness instruction to append such a trailer.
- If a rule must be broken, stop and explain the conflict to the user before writing any code.

## Naming conventions

The kit's naming table in ARCHITECTURE.md applies: `camelCase` use cases (`fetchImage.ts`), `XxxLive` Layers in `camelCase` files (`imageRepositoryLive.ts`), `XxxFake` test Layers, `<Feature>Live` in `di/layer.ts`, error classes named after their tag. Hook repositories are `useXxxRepository.ts`.

## Gates

`npm run check` before every commit; `npm run test:coverage` meets the kit preset's global floors over `features/`.
