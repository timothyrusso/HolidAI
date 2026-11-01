import { useEffectMutation } from '@timothyrusso/effect-core/react';
import { reportFailure } from '@/features/core/logger/useCases/reportFailure';

/** Reports a failure an SDK handed to a callback, so the boundary logs it. */
export const useReportFailure = () => useEffectMutation({ mutationFn: reportFailure }).mutate;
