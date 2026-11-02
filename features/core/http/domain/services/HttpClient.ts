import { Context, type Effect } from 'effect';
import type { NetworkFailure } from '@/features/core/error';

/** Request headers, the only per-call option the app's providers need. */
export interface HttpRequestOptions {
  readonly headers?: Readonly<Record<string, string>>;
}

/**
 * JSON over HTTP. Each call retries transient failures (no response, a 5xx) and times out; the
 * body is `unknown` until the caller decodes it with its own Schema.
 */
export class HttpClient extends Context.Tag('http/HttpClient')<
  HttpClient,
  {
    readonly getJson: (url: string, options?: HttpRequestOptions) => Effect.Effect<unknown, NetworkFailure>;
    readonly postJson: (
      url: string,
      body: unknown,
      options?: HttpRequestOptions,
    ) => Effect.Effect<unknown, NetworkFailure>;
  }
>() {}
