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
- **Figma MCP reads are gated.** Never call a Figma MCP data-read tool (`get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`, `get_libraries`, `search_design_system`, and the rest under `mcp__plugin_figma_figma__`) unless it is genuinely mandatory AND the user has given explicit permission for that specific call. Do all Figma inspection/verification through `use_figma` instead — but `use_figma` is ALSO plan-rate-limited on Starter (cap hit 2026-07-21), so batch every Figma operation into as few calls as possible. Full policy: `.claude/rules/figma-reads.md`.

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
