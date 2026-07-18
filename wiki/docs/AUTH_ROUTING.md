# Auth Routing — Expo Router `Stack.Protected`

> **Decision:** GO — adopted. This note records the evaluation behind the committed migration to Expo Router's declarative protected-routes API for auth gating.

## Context

Auth gating was previously imperative. The authenticated group layout
(`app/(main)/(authenticated)/_layout.tsx`) called Clerk's `useAuth()` and returned
`<Redirect href="/welcome" />` whenever `!isSignedIn`. The unauthenticated group had no
guard at all, so a signed-in user opening a `(not_authenticated)` route (e.g. via deep link)
was never declaratively redirected away. Guarding lived inside a per-group layout rather than
at the group boundary.

## What changes

- Both complementary guards are colocated in `app/(main)/_layout.tsx`, driven by Clerk's
  `useAuth()`, using Expo Router's `Stack.Protected` with a `guard` prop:

  ```tsx
  const { isSignedIn } = useAuth();

  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!!isSignedIn}>
      <Stack.Screen name={Stacks.Authenticated} />
    </Stack.Protected>
    <Stack.Protected guard={!isSignedIn}>
      <Stack.Screen name={Stacks.NotAuthenticated} />
    </Stack.Protected>
  </Stack>
  ```

- The manual `<Redirect>` guard is removed from `app/(main)/(authenticated)/_layout.tsx`. That
  file keeps its `ErrorBoundary` and inner `<Stack>` (Tabs, CreateTrip, HomePage) unchanged.
- `app/(main)/(not_authenticated)/_layout.tsx` is unchanged — it is now gated by the reverse
  guard in the parent.
- Auth state continues to come from Clerk's `useAuth()`; no new auth store is introduced. The
  existing `Stacks` navigation constants are reused — no hardcoded route strings.

## Benefit over the manual guard

- **One source of truth for the auth partition.** The two mutually-exclusive `guard` values
  (`!!isSignedIn` / `!isSignedIn`) declaratively partition the tree at the group boundary,
  instead of a scattered per-group `<Redirect>` that only covered one direction.
- **Both directions covered.** Expo Router automatically redirects to the first available
  screen when a guard flips — on sign-in it moves into the authenticated area, on sign-out it
  falls back to the unauthenticated group. A signed-in user can no longer land on
  welcome / sign-in, which the old one-sided guard did not prevent.
- **No imperative navigation to maintain.** No manual `router.replace` / `<Redirect>` to keep
  in sync with auth state. Sign-out already had no manual `router.replace` in app code
  (`NavigationService.toWelcome()` has zero callers), so the auto-redirect does not conflict
  with any existing imperative navigation.
- **Less flicker risk.** Removing the render-then-redirect step of `<Redirect>` avoids briefly
  mounting a protected screen before bouncing away.

## Risks and mitigations

- **Deep linking.** A deep link into a group whose guard is `false` must not render.
  Mitigation: guards live at the group boundary in the parent layout, so both a signed-out
  user hitting a protected route and a signed-in user hitting welcome / sign-in are redirected
  to the first available screen. Preserved initial-route behavior: `(authenticated)/index.tsx`
  still redirects to the home page, and `welcome` remains the first unauthenticated screen.
- **Sign-out redirect.** On sign-out the authenticated guard flips to `false` and Expo Router
  falls back to the unauthenticated group. Since there is no competing manual redirect, there
  is no double-navigation.
- **Auth-state flash on cold start.** `useAuth().isSignedIn` must be resolved before the
  guards evaluate, otherwise the wrong group could flash. Mitigation: the root layout
  (`app/_layout.tsx`) keeps wrapping the tree in `<ClerkLoaded>`, so `isSignedIn` is settled
  before any `(main)` layout renders. This gate is retained by this migration.
- **Web / SSR.** `Stack.Protected` is a client-side guard; on web/SSR the initial render can
  differ before hydration resolves auth. HolidAI ships as a native app (iOS / Android), so
  this is not an active concern today; if a web target is added, server-side auth resolution
  (or an `isLoaded`-gated shell) would need to be revisited.

## Decision

GO — adopted. The declarative `Stack.Protected` pattern matches Expo's recommended
authentication approach, closes the one-sided-guard gap, and removes imperative redirect
maintenance, with the `<ClerkLoaded>` gate mitigating the only material cold-start risk on our
native targets.
