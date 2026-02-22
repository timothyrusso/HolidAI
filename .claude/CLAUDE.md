# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HolidAI is a React Native mobile app that generates personalized travel itineraries using Google Gemini 2.5 Flash AI. Built with Expo, it runs on iOS and Android, featuring trip planning, maps integration, authentication, and trip management.

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
npm run ios && npm run android # Build development client for both platforms
npm start                      # Start development server
```

### Testing & Quality
```bash
npm test                       # Run Jest tests (watch mode)
npm run e2e                    # Run Maestro end-to-end tests
npm run lint                   # Check code with Biome (linting)
npm run format                 # Format code with Biome
npm run cspell                 # Spell check codebase
```

### Platform-specific
```bash
npm run android                # Run on Android
npm run ios                    # Run on iOS
npm run web                    # Run on web
```

## Architecture

### Directory Structure

- **`app/`** - Expo Router file-based routing structure
  - `(main)/(authenticated)/(tabs)/` - Main authenticated tab screens (my-trips, profile)
  - `(main)/(authenticated)/create-trip/` - Multi-step trip creation flow
  - `(main)/(login)/` - Authentication screens (welcome, sign-in, sign-up)
- **`ui/`** - UI layer organized by component type
  - `components/basic/` - Atomic components (CustomButton, CustomText, CustomIcon)
  - `components/composite/` - Composed components (CustomHeader, CustomScrollView)
  - `components/dialogs/` - Modal components
  - `pages/` - Page-specific components and logic
  - `hooks/` - Custom React hooks
  - `state/` - Zustand stores for client state
  - `queries/` - TanStack Query hooks for server state
  - `constants/` - Styling constants, routes, and platform configurations
- **`di/`** - Dependency injection container (tsyringe)
  - `config/` - DI container configuration
  - `resolve/` - Resolved dependencies (logger, query, storage)
  - `types/` - TypeScript types for DI tokens
- **`configs/`** - Application configuration
  - `ai/` - AI model configuration (AiModels.ts, prompt.ts)
  - `firebaseConfig.ts` - Firebase initialization
- **`convex/`** - Convex backend (serverless functions, schema, validators)
  - `schema.ts` - Database schema (trips, users tables)
  - `trips.ts` - Server functions for trip operations
  - `validators/` - Zod validators for data validation

### Technology Stack

- **Frontend**: React Native 0.81, Expo 54, Expo Router 6
- **State Management**: Zustand (client), TanStack Query (server/cache)
- **Backend**: Convex (serverless)
- **Authentication**: Clerk
- **AI**: Google Gemini 2.5 Flash via Vercel AI SDK
- **Maps**: Google Maps (react-native-maps)
- **DI Container**: tsyringe with reflect-metadata
- **Linting**: Biome
- **Git Hooks**: Lefthook

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` - Project root
- `@configs/*` - Configs directory
- `@ui/*` - UI directory

### Component Structure Pattern

Components in `ui/` follow this pattern:
- `ComponentName.tsx` - Main component file
- `ComponentName.logic.ts` - Business logic/hooks (optional)
- `ComponentName.style.ts` - Styles (optional)
- `ComponentName.data.ts` - Static data (optional)

### Dependency Injection

The app uses tsyringe for DI. The container is configured in `di/config/index.ts` and dependencies are resolved via `di/resolve/`.

#### Registered services

| Token | Class | Pattern |
|-------|-------|---------|
| `TYPES.Logger` | `BasicLogger` | singleton |
| `TYPES.Storage` | `LocalStorage` | singleton |
| `TYPES.MMKV` | `MMKV` (instance) | instance |
| `TYPES.QUERY` | `QueryClient` (instance) | instance |
| `TYPES.AiClient` | `GeminiClient` | singleton |

#### Adding a new injectable service

Follow this checklist in order:

1. **Define the interface** in `modules/<concern>/domain/I<Name>.ts`
   - Express capability (methods), never concrete SDK types
   - Consumers must only depend on the interface, never the implementation
2. **Implement the class** in `modules/<concern>/infra/<Name>.ts`
   - Decorate with `@singleton()`
   - Keep all third-party/SDK-specific code private inside this class
3. **Add a token** in `di/types/infra/<concern>.ts` and re-export from `di/types/infra/index.ts`
4. **Register** in `di/config/infra/<concern>.ts` using `container.registerSingleton(TYPES.X, XClass)` and re-export from `di/config/infra/index.ts`
5. **Resolve** in `di/resolve/infra/<concern>.ts` via `container.resolve(TYPES.X)` and re-export from `di/resolve/infra/index.ts`
6. **Consume** by importing the resolved instance from `@/di/resolve` — never construct the class directly

#### Key rules

- **Interfaces express capability, not provider.** Never expose a third-party type (e.g. a vendor SDK object) on an interface. The interface should only contain the methods the rest of the app needs. Example: `IAiClient` has `generateObject(...)`, not `provider: GoogleGenerativeAIProvider`.
- **Implementation details stay private.** All vendor-specific logic (SDK calls, API keys, tool configurations) lives inside the implementing class as private members.
- **Consumers are provider-agnostic.** Hooks, use cases, and components import from `@/di/resolve` and call interface methods. Swapping a provider = write a new class implementing the interface; nothing else changes.
- **One instance for the app lifetime.** Use `@singleton()` so the client and its configuration (API keys, HTTP connections) are created once at startup.
- **Don't use `async` on a function that only returns a Promise.** If a function just returns `someService.method()` which itself returns a Promise, omit `async` to avoid the Biome `useAwait` lint error.

### AI Integration

Trip generation uses Google Gemini 2.5 Flash configured in `configs/ai/`:
- Model: `gemini-2.5-flash` (defined in `AiModels.ts`)
- Prompt template in `prompt.ts` includes placeholders for location, dates, travelers, budget, etc.
- AI generates structured JSON responses for trip itineraries

## Environment Variables

Required variables (see `.env.sample`):
- Firebase config (API_KEY, PROJECT_ID, etc.)
- Google services (PLACES_API_KEY, MAPS_API_KEY_IOS/ANDROID, GEMINI_API_KEY)
- Clerk authentication (CLERK_PUBLISHABLE_KEY)
- Convex backend (CONVEX_URL)
- Third-party APIs (RAPID_API_KEY for flights, UNSPLASH_ACCESS_KEY for images)
- MMKV_ENCRYPTION_KEY (local storage encryption)

## Git Workflow

### Hooks (Lefthook)
- **pre-commit**: Runs Biome linting and formatting on staged files
- **commit-msg**: Runs commitlint and cspell on commit message
- **pre-push**: (currently disabled) Would run tests and security audit

### Branch Structure
- Main branch: `main`
- Feature branches: `feature/<issue-number>` or `feature/<description>`

## Testing

- **Unit/Integration**: Jest with `jest-expo` preset
- **E2E**: Maestro tests in `./maestro` directory
- Run tests in watch mode by default (`npm test`)

## Important Notes

- The app requires `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) in the project root
- Expo Router uses file-based routing - route structure mirrors `app/` directory
- TypeScript decorators enabled for tsyringe (`experimentalDecorators`, `emitDecoratorMetadata`)
- Window polyfill at top of `app/_layout.tsx` for Convex compatibility in React Native
