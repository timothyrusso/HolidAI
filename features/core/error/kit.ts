/**
 * The kit's error pieces, for `domain/` files: `domain-pure-except-effect` keeps
 * `@timothyrusso/effect-core` out of `domain/`, so they import `AppErrorBase` from here.
 */
export { AppErrorBase, ConfigError, isAppError, toAppError, UnexpectedError } from '@timothyrusso/effect-core';
