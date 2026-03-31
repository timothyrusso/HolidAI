export const Stacks = {
  Tabs: '(tabs)',
  Main: '(main)',
  Profile: 'profile',
  Login: '(login)',
  Authenticated: '(authenticated)',
  CreateTrip: 'create-trip',
  HomePage: 'home-page',
} as const;

export type Stacks = (typeof Stacks)[keyof typeof Stacks];
