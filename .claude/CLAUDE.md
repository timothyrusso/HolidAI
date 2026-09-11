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
- A ViewModel (`.logic.ts` hook, named `useXxxLogic`) must return `{ state, derived?, effects }` or nothing (void), and its `.tsx` may call only its own ViewModel hook, once. Enforced by `holidai/viewmodel-return-shape` + `holidai/prefer-viewmodel` (see `wiki/docs/ARCHITECTURE.md` — ui/ — The ViewModel contract).
- `domain/` → pure TypeScript only. No external library imports, no framework code, no side effects.
- Never reach into another feature's internal folders. Only import from its `index.ts` or from a `features/core/<sub-module>` via its `index.ts`.
- Never use `new` to instantiate IoC classes. Always resolve from the feature's `di/resolve.ts`.
- Never use `enum`. Use `const` objects with `as const` instead.
- Functions that can fail must return `Result<T>` from `features/core/error/domain/entities/Result.ts`. Use `ok()` / `fail()` helpers.
- Always use `ensureError()` in catch blocks. Never cast `error as Error`.
- Never use `console.error`. Always use the injected `ILogger`.
- Log errors only in `useCases/`. Facades and `.logic.ts` do not log.
- IoC class constructors must have an empty body `{}`. Only declare `@inject()`-decorated parameters (TypeScript assigns them to fields automatically). No object creation, no validation, no logic. All construction and setup belongs in `di/config.ts`; register ready-to-use objects via `container.registerInstance()`.
- Never write an inline comment. If one seems necessary, propose it at planning time — the file, the tag, the exact text, and why the code cannot carry it — and get approval before writing it. `holidai/no-inline-comments` allows only `// NOTE: <constraint>` and `// HACK: <workaround> because <reason>`, tool directives (`biome-ignore`, `eslint-disable*`, `@ts-*`, `/// <reference>`), and a `/** */` block leading a declaration. TSDoc on public methods is unaffected (full rule: `wiki/docs/ARCHITECTURE.md` — Documentation — Inline comments).
- Never bypass git hooks. Do not run `git commit` or `git push` with `--no-verify` / `-n`. Lefthook (lint, format, react-compiler, commit-msg) and CI are the guardrails; if a hook fails, fix the cause, don't skip it.
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
| ViewModel hook (`.logic.ts`) | `useXxxLogic` — returns `{ state, derived?, effects }` or nothing (void) |
