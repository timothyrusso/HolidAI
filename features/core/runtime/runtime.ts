import { type AppServicesOf, makeAppRuntime } from '@timothyrusso/effect-core';
import { Layer } from 'effect';
import { AiLive } from '@/features/ai';
import { AppConfig, type AppConfigValues, ConfigLive } from '@/features/core/config';
import type { AppError } from '@/features/core/error';
import { HttpClientLive } from '@/features/core/http';
import { ImagesLive } from '@/features/core/images';
import { LoggerLive } from '@/features/core/logger';
import { NetworkLive } from '@/features/core/network';
import { PerformanceLive } from '@/features/core/performance';
import { SentryLive } from '@/features/core/sentry';
import { StorageLive } from '@/features/core/storage';

/** The services every other core Layer builds on. */
const FoundationLive = Layer.mergeAll(ConfigLive, SentryLive);

/** Every Layer the core concerns provide. */
const CoreLive = Layer.mergeAll(LoggerLive, PerformanceLive, HttpClientLive, NetworkLive, StorageLive).pipe(
  Layer.provideMerge(FoundationLive),
);

/**
 * Every feature's Layer. A feature adds its `<Feature>Live` from its `index.ts` here; a Layer that
 * needs a core service (`HttpClient`, `AppConfig`) gets it from `CoreLive`.
 */
export const FeaturesLive = Layer.mergeAll(ImagesLive, AiLive);

/** Every feature's Layer, over the core ones. */
export const AppLayer = FeaturesLive.pipe(Layer.provideMerge(CoreLive));

/** The app's one runtime. Only `app/_layout.tsx` imports it, to boot it and mount the provider. */
export const runtime = makeAppRuntime(AppLayer);

/**
 * Builds the runtime once, at launch, and resolves with the decoded app config the providers
 * above it need (the Convex URL, the Clerk key). Rejects with the Layer's own error, a
 * `ConfigError` naming the missing field for example, for the caller to report.
 */
export const bootRuntime = async (): Promise<AppConfigValues> => {
  await runtime.boot();
  return runtime.runPromise(AppConfig.Config);
};

/** Every service the runtime provides: what a facade's Effect may need. */
export type AppServices = AppServicesOf<typeof runtime>;

declare module '@timothyrusso/effect-core/react' {
  interface Register {
    services: AppServices;
    error: AppError;
  }
}
