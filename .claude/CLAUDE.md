# HolidAI — Claude Code Instructions

Follow these rules on every task that involves writing or modifying code. If a situation is not covered here, ask the user.

## Non-negotiable rules

- Always use `@/` path aliases. Never use relative paths (`../`).
- IoC repositories → only inside `useCases/`. Never in facades, hooks, `.logic.ts`, or UI.
- Hook-based repositories → only inside `facades/`. Never in `.logic.ts` or UI.
- `.tsx` files → only import the ViewModel (`.logic.ts`), UI components, and styles.
- `domain/` → pure TypeScript only. No external library imports, no framework code, no side effects.
- Never reach into another feature's internal folders. Only import from its `index.ts` or from a `features/core/<sub-module>` via its `index.ts`.
- Never use `new` to instantiate IoC classes. Always resolve from the feature's `di/resolve.ts`.
- Never use `enum`. Use `const` objects with `as const` instead.
- Functions that can fail must return `Result<T>` from `features/core/error/domain/entities/Result.ts`. Use `ok()` / `fail()` helpers.
- Always use `ensureError()` in catch blocks. Never cast `error as Error`.
- Never use `console.error`. Always use the injected `ILogger`.
- Log errors only in `useCases/`. Facades and `.logic.ts` do not log.
- If a rule must be broken, stop and explain the conflict to the user before writing any code.

## Import rules

| Layer | Can import |
|---|---|
| `.tsx` | ViewModel (`.logic.ts`), UI components, styles |
| `.logic.ts` (ViewModel) | facades, hooks, `features/core/utils/hooks/`, same-feature class use cases via `di/resolve` or cross-feature core singletons via `index.ts`, state |
| `facades/` | hook-based repos, same-feature class use cases via `di/resolve` or cross-feature core singletons via `index.ts`, other facades, utility hooks from `features/core/utils/hooks/`, same-feature state stores |
| `hooks/` | domain types, state, external library hooks only |
| `useCases/` | IoC repository interfaces, IoC service interfaces, domain entities |
| `data/repositories/` | domain interfaces, DTOs, adapters |

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

## Architecture changes

If you believe a rule needs to change, say so explicitly before writing any code. Do not silently deviate.
