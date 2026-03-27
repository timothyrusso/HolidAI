export type SpanOptions = {
  /** Human-readable span name. Follow the naming convention: <feature>.<action> */
  name: string;
  /** Sentry operation type. Use values from SentryOp in the performance conventions. */
  op: string;
};
