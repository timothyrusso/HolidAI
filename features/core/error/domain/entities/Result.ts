import type { BaseError } from '@/features/core/error/domain/entities/BaseError';

export type Result<T> = { success: true; data: T } | { success: false; error: BaseError };

export const ok = <T>(data: T): Result<T> => ({ success: true, data });
export const fail = (error: BaseError): Result<never> => ({ success: false, error });
