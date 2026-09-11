import type { AuthConfig } from 'convex/server';

export default {
  providers: [
    {
      // biome-ignore lint/style/noNonNullAssertion: <See the docs: https://docs.convex.dev/auth/clerk>
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig;
