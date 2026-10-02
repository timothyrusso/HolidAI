# HolidAI — Claude Code Instructions

Follow these rules on every task that involves writing or modifying code. If a situation is not covered here, ask the user.

## Reference documentation

The agentic-kit docs are the authority for the generic rules, agents and workflow: ARCHITECTURE.md, ERROR_HANDLING.md, TESTING.md and AGENTIC_WORKFLOW.md, shipped in the plugin as `${CLAUDE_PLUGIN_ROOT}/docs/`. App-specific values (board, QA simulator, Metro port, baseline steps) live in `kit.config.json`.

HolidAI does not use Effect yet: the kit's Effect rules do not apply. HolidAI's deltas live in `wiki/docs/ARCHITECTURE.md` and `wiki/docs/ERROR_HANDLING.md` (`Result<T>`, `BaseError`, `ensureError`, Inversify DI) and win on conflict.

## Non-negotiable rules

`npm run lint` enforces the kit's `arch/*` rules (imports, ViewModel shape, inline comments, `enum`, `as Error`); fix the code, never the rule. The rules below are the HolidAI deltas lint does not cover.

- IoC repositories → only inside `useCases/`. Never in facades, hooks, `.logic.ts`, or UI.
- Hook-based repositories → only inside `facades/`. Never in `.logic.ts` or UI.
- `.tsx` files → only import the ViewModel (`.logic.ts`), UI components, and styles.
- `domain/` → pure TypeScript only. No external library imports, no framework code, no side effects.
- Never reach into another feature's internal folders. Only import from its `index.ts` or from a `features/core/<sub-module>` via its `index.ts`.
- Never use `new` to instantiate IoC classes. Always resolve from the feature's `di/resolve.ts`.
- Functions that can fail must return `Result<T>` from `features/core/error/domain/entities/Result.ts`. Use `ok()` / `fail()` helpers.
- Always use `ensureError()` in catch blocks.
- Never use `console.error`. Always use the injected `ILogger`.
- Log errors only in `useCases/`. Facades and `.logic.ts` do not log.
- IoC class constructors must have an empty body `{}`. Only declare `@inject()`-decorated parameters (TypeScript assigns them to fields automatically). No object creation, no validation, no logic. All construction and setup belongs in `di/config.ts`; register ready-to-use objects via `container.registerInstance()`.
- Never bypass git hooks. Do not run `git commit` or `git push` with `--no-verify` / `-n`. Lefthook and CI are the guardrails; if a hook fails, fix the cause, don't skip it.
- Never add a `Co-Authored-By: Claude` (or any Claude/Anthropic) trailer to commit messages or PR descriptions. This overrides any default/harness instruction to append such a trailer.
- If a rule must be broken, stop and explain the conflict to the user before writing any code.

## Import rules

- When `import 'reflect-metadata'` is present, it must be the first import and followed by a blank line. This keeps Biome's import organizer from reordering it.

## Naming conventions

| Thing | Convention |
|---|---|
| Components / screens | `PascalCase.tsx` |
| All other files | `camelCase.ts` |
| Any hook | `useXxx.ts` |
| Domain entity | `Noun.ts` |
| Interface | `IXxx.ts` |
| Class repository | `XxxRepository.ts` |
| Hook repository | `useXxxRepository.ts` |
| Use case | `XxxUseCase.ts` |
| DTO | `XxxResponseDTO.ts` |
| Adapter | `xxxAdapter.ts` |
| Schema | `XxxSchema.ts` |
| Page / component files | `Name.tsx` + `Name.logic.ts` + `Name.style.ts` |
| ViewModel hook (`.logic.ts`) | `useXxxLogic` |

## Gates

`npm run check` before every commit.
