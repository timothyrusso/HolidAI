import { Schema } from 'effect';

/**
 * What the `extra` block of `app.config.js` holds. The Convex URL, the Clerk publishable key and
 * the MMKV key are required: without one the boot fails naming it. The provider keys are
 * optional: the feature that needs one fails with `ConfigMissing` when it runs. The Sentry DSN is
 * optional too, but `initSentry` reads it from `Constants` at boot, and Sentry stays off without
 * it; it never goes through `requireConfigKey` or `ConfigMissing`.
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
