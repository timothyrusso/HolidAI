import { Context, type Effect } from 'effect';
import type { NetworkFailure } from '@/features/core/error';

/** The device's connectivity. */
export class Network extends Context.Tag('network/Network')<
  Network,
  {
    /** `true` when the internet is reachable (or, when the OS cannot tell, a network is connected). */
    readonly isConnected: Effect.Effect<boolean, NetworkFailure>;
  }
>() {}
