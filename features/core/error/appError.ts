import type { ConfigError, UnexpectedError } from '@timothyrusso/effect-core';
import type {
  ConfigMissing,
  ImageFetchFailed,
  NetworkFailure,
  NotFound,
  StorageFailure,
  Unauthorized,
} from '@/features/core/error/domain/errors/CoreErrors';

/**
 * Every error that can reach the UI, keyed by the feature that declares it. Each feature adds
 * `<feature>: <its error union>` here by module augmentation from its `domain/errors/index.ts`.
 */
export interface AppErrorRegistry {
  core:
    | UnexpectedError
    | ConfigError
    | ConfigMissing
    | NetworkFailure
    | Unauthorized
    | NotFound
    | StorageFailure
    | ImageFetchFailed;
}

/** The closed union of every error that can reach the UI. */
export type AppError = AppErrorRegistry[keyof AppErrorRegistry];
