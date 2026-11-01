import { QueryClient } from '@tanstack/react-query';
import { isAppError } from '@/features/core/error';

/** TanStack's own retries for a plain query that fails with something other than an app error. */
const MAX_PLAIN_RETRIES = 3;

/**
 * The app's one query client. An app error already ran its Effect, retries included, and was
 * logged once at the boundary, so TanStack does not run it again; a plain query keeps its retries.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: (failureCount, error) => !isAppError(error) && failureCount < MAX_PLAIN_RETRIES },
  },
});
