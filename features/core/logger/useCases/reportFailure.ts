import { Effect } from 'effect';
import { toAppError } from '@/features/core/error';

/**
 * Fails with `cause` as an app error, for a failure an SDK reports through a callback rather than
 * an Effect: run through `useEffectMutation`, the boundary logs it once, like any other.
 */
export const reportFailure = (cause: unknown) => Effect.fail(toAppError(cause));
