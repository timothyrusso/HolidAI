# HolidAI — Claude Code Instructions

Follow these rules on every task that involves writing or modifying code. If a situation is not covered here, ask the user.

## Non-negotiable rules

- Always use `@/` path aliases. Never use relative paths (`../`).
- IoC repositories → only inside `useCases/`. Never in facades, hooks, `.logic.ts`, or UI.
- Hook-based repositories → only inside `facades/`. Never in `.logic.ts` or UI.
- `.tsx` files → only import the ViewModel (`.logic.ts`), UI components, and styles.
- `domain/` → pure TypeScript only. No external library imports, no framework code, no side effects.
- Never reach into another feature's internal folders. Only import from its `index.ts` or from `features/shared`.
- Never use `new` to instantiate IoC classes. Always resolve from the feature's `di/resolve.ts`.
- Never use `enum`. Use `const` objects with `as const` instead.
- If a rule must be broken, stop and explain the conflict to the user before writing any code.

## Import rules

| Layer | Can import |
|---|---|
| `.tsx` | ViewModel (`.logic.ts`), UI components, styles |
| `.logic.ts` (ViewModel) | facades, hooks, shared hooks, class use cases via `di/resolve`, state |
| `facades/` | hook-based repos, class use cases via `di/resolve`, other facades |
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
