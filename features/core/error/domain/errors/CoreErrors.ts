import { AppErrorBase } from '@/features/core/error/kit';

/** A request did not reach the server, timed out, or came back with a non-2xx status. */
export class NetworkFailure extends AppErrorBase('NetworkFailure', 'ERRORS.NETWORK')<{
  readonly url: string;
  readonly status?: number;
}> {}

/** The signed-in user may not do what was asked. */
export class Unauthorized extends AppErrorBase('Unauthorized', 'ERRORS.UNAUTHORIZED') {}

/** The resource asked for does not exist. */
export class NotFound extends AppErrorBase('NotFound', 'ERRORS.NOT_FOUND')<{
  readonly resource: string;
}> {}

/** The AI pipeline could not produce a usable result. */
export class GenerationFailed extends AppErrorBase('GenerationFailed', 'ERRORS.GENERATION') {}

/** Reading or writing device storage failed, or a stored value no longer decodes. */
export class StorageFailure extends AppErrorBase('StorageFailure', 'ERRORS.STORAGE')<{
  readonly key: string;
}> {}

/** An image provider answered with something that is not the image search it promised. */
export class ImageFetchFailed extends AppErrorBase('ImageFetchFailed', 'ERRORS.IMAGE_FETCH')<{
  readonly source: string;
}> {}

/**
 * An optional config key a feature needs is missing or empty. Raised when that feature runs,
 * not at boot, so a checkout without the key still starts.
 */
export class ConfigMissing extends AppErrorBase('ConfigMissing', 'ERRORS.CONFIG')<{
  readonly field: string;
}> {}
