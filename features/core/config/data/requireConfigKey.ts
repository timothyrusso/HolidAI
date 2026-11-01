import { Effect } from 'effect';
import type { AppConfigValues, OptionalConfigKey } from '@/features/core/config/domain/schemas/AppConfigSchema';
import { ConfigMissing } from '@/features/core/error';

/** The value of an optional config key, or `ConfigMissing` naming it when it is absent or empty. */
export const requireConfigKey = (
  config: AppConfigValues,
  field: OptionalConfigKey,
): Effect.Effect<string, ConfigMissing> => {
  const value = config[field];
  return value ? Effect.succeed(value) : Effect.fail(new ConfigMissing({ field }));
};
