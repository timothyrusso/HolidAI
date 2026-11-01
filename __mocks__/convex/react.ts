import { convexFake } from '@/features/core/testing/convexFake';

// NOTE: convex/react as a test sees it: the real module with the hooks answered by `convexFake`.
const actual = jest.requireActual('convex/react');

module.exports = { ...actual, useQuery: convexFake.useQuery, useMutation: convexFake.useMutation };
