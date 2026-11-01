import { ConsoleLogger, type Logger } from '@timothyrusso/effect-core';
import type { Layer } from 'effect';
import { SentryLoggerLive } from '@/features/core/logger/data/services/sentryLoggerLive';
import type { Sentry } from '@/features/core/sentry';

/** The `Logger` the runtime provides: the console in development, Sentry in release builds. */
export const LoggerLive: Layer.Layer<Logger, never, Sentry> = __DEV__ ? ConsoleLogger : SentryLoggerLive;
