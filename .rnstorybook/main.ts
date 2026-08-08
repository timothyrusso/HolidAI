import type { StorybookConfig } from '@storybook/react-native';

// Stories are co-located with their components under `features/` — `CustomButtonProps` and
// `CustomIconButtonProps` are internal to the design system and are not part of its public
// `index.ts`, so stories cannot live outside the feature without leaking them into the public API.
const main: StorybookConfig = {
  stories: ['../features/**/*.stories.?(ts|tsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
