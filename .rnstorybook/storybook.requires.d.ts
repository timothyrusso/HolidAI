// NOTE: shim for the sibling `storybook.requires.ts`, which the Metro plugin regenerates on every
// Storybook start and which is therefore gitignored — without it `tsc --noEmit` fails on a clean
// checkout. When the real file exists, TypeScript resolves it in preference to this declaration.
import type { start } from '@storybook/react-native';

export declare const view: ReturnType<typeof start>;
