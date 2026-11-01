import { Schema } from 'effect';

/**
 * What the `extra` block of `app.config.js` holds. The Convex URL, the Clerk publishable key and
 * the MMKV key are required: without one the boot fails naming it. The provider keys and the
 * Sentry DSN are optional: the feature that needs one fails with `ConfigMissing` when it runs.
 */
export const AppConfigSchema = Schema.Struct({
  convexUrl: Schema.NonEmptyString,
  clerkPublishableKey: Schema.NonEmptyString,
  mmkvEncryptionKey: Schema.NonEmptyString,
  googlePlacesApiKey: Schema.optional(Schema.String),
  googleGeminiApiKey: Schema.optional(Schema.String),
  rapidApiKey: Schema.optional(Schema.String),
  unsplashAccessKey: Schema.optional(Schema.String),
  sentryDsn: Schema.optional(Schema.String),
});

export type AppConfigValues = typeof AppConfigSchema.Type;

/** The keys a feature may run without: each is checked when the feature runs. */
export type OptionalConfigKey =
  | 'googlePlacesApiKey'
  | 'googleGeminiApiKey'
  | 'rapidApiKey'
  | 'unsplashAccessKey'
  | 'sentryDsn';
