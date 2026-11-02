import { Context, type Effect } from 'effect';

/** A span's name and operation, as Sentry's trace view groups them. */
export interface SentrySpanOptions {
  readonly name: string;
  readonly op: string;
}

/** The crash reporter: exceptions and performance spans. Every method never fails. */
export class Sentry extends Context.Tag('sentry/Sentry')<
  Sentry,
  {
    readonly captureException: (error: unknown, context?: Readonly<Record<string, unknown>>) => Effect.Effect<void>;
    /** Runs `effect` inside a span that ends when it does, marked as failed when it fails. */
    readonly withSpan: <A, E, R>(options: SentrySpanOptions, effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>;
  }
>() {}
