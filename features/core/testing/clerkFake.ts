/** The signed-in Clerk user as the app reads it. */
export interface ClerkUserFake {
  readonly id: string;
  readonly username: string | null;
  readonly imageUrl: string;
  readonly primaryEmailAddress: { readonly emailAddress: string } | null;
}

/** The QA account, as the app reads it once signed in. */
export const A_CLERK_USER: ClerkUserFake = {
  id: 'user_2qa',
  username: 'holidaiqa',
  imageUrl: 'https://img.clerk.com/holidaiqa.png',
  primaryEmailAddress: { emailAddress: 'holidaiqa+clerk_test@example.com' },
};

const state: { user: ClerkUserFake | null } = { user: null };

/**
 * Clerk as a facade or ViewModel test sees it: `__mocks__/@clerk/expo.ts` hands out `useUser`,
 * `useAuth` and `useClerk` over the user `signIn` sets. Nobody is signed in until a test signs
 * someone in; `reset` runs before every test.
 */
export const clerkFake = {
  signIn: (user: ClerkUserFake = A_CLERK_USER) => {
    state.user = user;
  },
  reset: () => {
    state.user = null;
  },
  useUser: () => ({ user: state.user, isLoaded: true, isSignedIn: state.user !== null }),
  useAuth: () => ({ isLoaded: true, isSignedIn: state.user !== null, userId: state.user?.id ?? null }),
  useClerk: () => ({ signOut: async () => clerkFake.reset() }),
};
