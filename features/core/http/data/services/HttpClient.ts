import type { Result } from '@/features/core/error';
import { BaseError, ErrorCode, ensureError, fail, ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http/domain/entities/services/IHttpClient';
import { injectable } from 'tsyringe';

const DEFAULT_TIMEOUT_MS = 10_000;

@injectable()
export class HttpClient implements IHttpClient {
  async get<T>(url: string, options?: RequestInit): Promise<Result<T>> {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS), ...options, method: 'GET' });
      if (!response.ok) {
        return fail(
          new BaseError(`HTTP ${response.status}`, ErrorCode.NetworkFailure, {
            context: { url, status: response.status },
          }),
        );
      }
      return ok((await response.json()) as T);
    } catch (e) {
      return fail(
        new BaseError('Network request failed', ErrorCode.NetworkFailure, { cause: ensureError(e), context: { url } }),
      );
    }
  }

  async post<T>(url: string, body: unknown, options?: RequestInit): Promise<Result<T>> {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
        ...options,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string> | undefined) },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        return fail(
          new BaseError(`HTTP ${response.status}`, ErrorCode.NetworkFailure, {
            context: { url, status: response.status },
          }),
        );
      }
      return ok((await response.json()) as T);
    } catch (e) {
      return fail(
        new BaseError('Network request failed', ErrorCode.NetworkFailure, { cause: ensureError(e), context: { url } }),
      );
    }
  }
}
