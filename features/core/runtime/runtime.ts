import { type AppServicesOf, makeAppRuntime } from '@timothyrusso/effect-core';
import { Layer } from 'effect';
import { ConfigLive } from '@/features/core/config';
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
export const FeaturesLive = Layer.mergeAll(ImagesLive);

/** Every feature's Layer, over the core ones. */
export const AppLayer = FeaturesLive.pipe(Layer.provideMerge(CoreLive));

/** The app's one runtime. Only `app/_layout.tsx` imports it, to boot it and mount the provider. */
export const runtime = makeAppRuntime(AppLayer);

/** Every service the runtime provides: what a facade's Effect may need. */
export type AppServices = AppServicesOf<typeof runtime>;

declare module '@timothyrusso/effect-core/react' {
  interface Register {
    services: AppServices;
    error: AppError;
  }
}
