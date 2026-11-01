import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { makeNetwork, type NetworkStateReading } from '@/features/core/network/data/services/networkLive';

const reading = (state: NetworkStateReading) => () => Promise.resolve(state);

describe('makeNetwork', () => {
  itEffect('is connected when the internet is reachable', () =>
    Effect.gen(function* () {
      expect(yield* makeNetwork(reading({ isConnected: true, isInternetReachable: true })).isConnected).toBe(true);
    }),
  );

  itEffect('is not connected on a network that does not reach the internet', () =>
    Effect.gen(function* () {
      expect(yield* makeNetwork(reading({ isConnected: true, isInternetReachable: false })).isConnected).toBe(false);
    }),
  );

  itEffect('falls back to the network connection when reachability is unknown', () =>
    Effect.gen(function* () {
      expect(yield* makeNetwork(reading({ isConnected: true, isInternetReachable: null })).isConnected).toBe(true);
    }),
  );

  itEffect('fails with NetworkFailure when the state cannot be read', () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(makeNetwork(() => Promise.reject(new Error('no module'))).isConnected);

      expect(error._tag).toBe('NetworkFailure');
    }),
  );
});
