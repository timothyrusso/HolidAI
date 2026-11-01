import type { BaseError } from '@/features/core/error/domain/entities/BaseError';

/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. Return an `Effect` instead. */
export type Result<T> = { success: true; data: T } | { success: false; error: BaseError };

/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. */
export const ok = <T>(data: T): Result<T> => ({ success: true, data });
/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. */
export const fail = (error: BaseError): Result<never> => ({ success: false, error });
