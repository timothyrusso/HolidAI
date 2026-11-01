import { Effect, Layer } from 'effect';
import { NetworkFailure } from '@/features/core/error';
import { Network } from '@/features/core/network';

/** A `Network` that is online, offline, or (`'broken'`) cannot read the device's state. */
export const NetworkFake = (state: 'online' | 'offline' | 'broken' = 'online') =>
  Layer.succeed(Network, {
    isConnected:
      state === 'broken'
        ? Effect.fail(new NetworkFailure({ url: 'device://network-state' }))
        : Effect.succeed(state === 'online'),
  });
