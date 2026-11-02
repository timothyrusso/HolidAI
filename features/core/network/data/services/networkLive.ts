import { Effect, Layer } from 'effect';
import * as ExpoNetwork from 'expo-network';
import { NetworkFailure } from '@/features/core/error';
import { Network } from '@/features/core/network/domain/services/Network';

/** The part of expo-network's state the app reads. */
export interface NetworkStateReading {
  readonly isConnected?: boolean;
  readonly isInternetReachable?: boolean | null;
}

/** A `Network` over `readState`. */
export const makeNetwork = (readState: () => Promise<NetworkStateReading>): Network['Type'] => ({
  isConnected: Effect.tryPromise({
    try: () => readState(),
    catch: cause => new NetworkFailure({ url: 'device://network-state', cause }),
  }).pipe(Effect.map(state => (state.isInternetReachable ?? state.isConnected) === true)),
});

export const NetworkLive = Layer.sync(Network, () => makeNetwork(() => ExpoNetwork.getNetworkStateAsync()));
