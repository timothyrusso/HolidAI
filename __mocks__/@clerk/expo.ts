import { clerkFake } from '@/features/core/testing/clerkFake';

// NOTE: @clerk/expo as a test sees it: only the hooks the app reads, answered by `clerkFake`.
// The real module loads native views that do not run under Node.
module.exports = { useUser: clerkFake.useUser, useAuth: clerkFake.useAuth, useClerk: clerkFake.useClerk };
