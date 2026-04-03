import type { Result } from '@/features/core/error';

export interface IHttpClient {
  get<T>(url: string, options?: RequestInit): Promise<Result<T>>;
  post<T>(url: string, body: unknown, options?: RequestInit): Promise<Result<T>>;
}
