import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fn } from 'storybook/test';

import { Custom3DButtonType } from '@/features/core/design-system/components/basic/Custom3DButton/Custom3DButton.logic';
import { Custom3DButtonExtraLarge } from '@/features/core/design-system/components/basic/Custom3DButton/Custom3DButtonExtraLarge';
import { Custom3DButtonLarge } from '@/features/core/design-system/components/basic/Custom3DButton/Custom3DButtonLarge';
import { Custom3DButtonMedium } from '@/features/core/design-system/components/basic/Custom3DButton/Custom3DButtonMedium';
import { Custom3DButtonSmall } from '@/features/core/design-system/components/basic/Custom3DButton/Custom3DButtonSmall';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

const meta = {
  title: 'Design System/Custom3DButton',
  component: Custom3DButtonLarge,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <GestureHandlerRootView>
        <Story />
      </GestureHandlerRootView>
    ),
  ],
  args: {
    title: 'GLOBAL.BUTTON.CONFIRM',
    onPress: fn(),
    buttonType: Custom3DButtonType.Primary,
    isDisabled: false,
    isLoading: false,
  },
  argTypes: {
    buttonType: { control: 'select', options: Object.values(Custom3DButtonType) },
  },
} satisfies Meta<typeof Custom3DButtonLarge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Derived from `Object.values(Custom3DButtonType)` rather than a hand-written list, so a new
 * variant shows up here automatically — the same exhaustiveness discipline
 * `Custom3DButton.logic.ts` enforces with ts-pattern's `.exhaustive()`.
 */
export const AllTypes: Story = {
  render: args => (
    <View style={styles.stack}>
      {Object.values(Custom3DButtonType).map(buttonType => (
        <Custom3DButtonLarge {...args} key={buttonType} buttonType={buttonType} />
      ))}
    </View>
  ),
};

/** The real size exports, not `Custom3DButton` with a raw `size` prop. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.stack}>
      <Custom3DButtonExtraLarge {...args} />
      <Custom3DButtonLarge {...args} />
      <Custom3DButtonMedium {...args} />
      <Custom3DButtonSmall {...args} />
    </View>
  ),
};

/**
 * Disabled swaps the face and the label for palette tokens instead of fading the button, and
 * loading keeps the active face raised — the two states have to stay visibly different.
 */
export const States: Story = {
  render: args => (
    <View style={styles.stack}>
      <Custom3DButtonLarge {...args} />
      <Custom3DButtonLarge {...args} isDisabled />
      <Custom3DButtonLarge {...args} isLoading />
      <Custom3DButtonLarge {...args} isDisabled isLoading />
    </View>
  ),
};

/** Every disabled variant side by side: the raise and border keep their active colours. */
export const AllTypesDisabled: Story = {
  render: args => (
    <View style={styles.stack}>
      {Object.values(Custom3DButtonType).map(buttonType => (
        <Custom3DButtonLarge {...args} key={buttonType} buttonType={buttonType} isDisabled />
      ))}
    </View>
  ),
};

export const WithIcons: Story = {
  render: args => (
    <View style={styles.stack}>
      <Custom3DButtonLarge {...args} leftIcon="airplane-outline" rightIcon="arrow-forward-outline" />
      <Custom3DButtonLarge {...args} leftIcon="airplane-outline" />
      <Custom3DButtonLarge {...args} rightIcon="arrow-forward-outline" />
      <Custom3DButtonSmall {...args} leftIcon="airplane-outline" />
    </View>
  ),
};

const styles = StyleSheet.create({
  stack: {
    gap: spacing.Double,
  },
});
