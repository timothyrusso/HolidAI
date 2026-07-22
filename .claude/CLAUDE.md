# HolidAI — Claude Code Instructions

Follow these rules on every task that involves writing or modifying code. If a situation is not covered here, ask the user.

## Reference documentation

Deep architecture references live in `wiki/docs/` — consult the relevant one (don't duplicate it here). The rules below are the terse, always-on non-negotiables; the docs are the full rationale, examples, and documented exceptions.

- `wiki/docs/ARCHITECTURE.md` — the authoritative codebase map: feature-first Clean Architecture, folder structure, dependency tiers, the two DI modes, and public-API rules.
- `wiki/docs/ERROR_HANDLING.md` — the authoritative error-handling reference (`Result<T>`, `BaseError`, `ensureError`, logging, error boundaries). Read before writing any failure path.

## Non-negotiable rules

- Always use `@/` path aliases. Never use relative paths (`./` or `../`).
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
- IoC class constructors must have an empty body `{}`. Only declare `@inject()`-decorated parameters (TypeScript assigns them to fields automatically). No object creation, no validation, no logic. All construction and setup belongs in `di/config.ts`; register ready-to-use objects via `container.registerInstance()`.
- If a rule must be broken, stop and explain the conflict to the user before writing any code.
- **ALL Figma MCP calls are gated.** Every tool under `mcp__plugin_figma_figma` (reads, writes, `use_figma`, `whoami` — everything) requires the user's explicit approval before EACH call; never attempt one without asking first. Every Figma update must be completed in exactly ONE `use_figma` call — batch inspection + all mutations + inline screenshot verification into a single script, prepared via a user-validated HTML preview first. If one call can't cover it (50k-char script limit) or a script fails, stop and ask. Full policy: `.claude/rules/figma-calls.md`.

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
