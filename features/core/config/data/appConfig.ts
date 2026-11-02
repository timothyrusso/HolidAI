import { makeConfig } from '@timothyrusso/effect-core';
import Constants from 'expo-constants';
import { AppConfigSchema } from '@/features/core/config/domain/schemas/AppConfigSchema';

/** The app config: `yield* AppConfig.Config` in a Layer or a use case. */
export const AppConfig = makeConfig(AppConfigSchema);

/** Decodes `extra` from `app.config.js` when the runtime boots. */
export const ConfigLive = AppConfig.layer(() => Constants.expoConfig?.extra);
