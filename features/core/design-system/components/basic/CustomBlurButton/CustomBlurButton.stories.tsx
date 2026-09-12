import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { fn } from 'storybook/test';

import { CustomBlurButtonLarge } from '@/features/core/design-system/components/basic/CustomBlurButton/CustomBlurButtonLarge';
import { CustomBlurButtonMedium } from '@/features/core/design-system/components/basic/CustomBlurButton/CustomBlurButtonMedium';
import { CustomBlurButtonSmall } from '@/features/core/design-system/components/basic/CustomBlurButton/CustomBlurButtonSmall';
import { CustomImage } from '@/features/core/design-system/components/basic/CustomImage/CustomImage';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

const photo = require('@/features/core/design-system/assets/images/welcome_1.jpg');

const meta = {
  title: 'Design System/CustomBlurButton',
  component: CustomBlurButtonLarge,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <View style={styles.backdrop}>
        <CustomImage source={photo} style={styles.photo} useBlur={false} contentFit="cover" />
        <View style={styles.stack}>
          <Story />
        </View>
      </View>
    ),
  ],
  args: {
    title: 'GLOBAL.BUTTON.CONFIRM',
    onPress: fn(),
    isDisabled: false,
    isLoading: false,
  },
} satisfies Meta<typeof CustomBlurButtonLarge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The real size exports, not `CustomBlurButton` with a raw `size` prop. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.stack}>
      <CustomBlurButtonLarge {...args} />
      <CustomBlurButtonMedium {...args} />
      <CustomBlurButtonSmall {...args} />
    </View>
  ),
};

/**
 * Disabled thins the blur and the tint; loading keeps both at their active strength, so a busy
 * button still reads as available.
 */
export const States: Story = {
  render: args => (
    <View style={styles.stack}>
      <CustomBlurButtonLarge {...args} />
      <CustomBlurButtonLarge {...args} isDisabled />
      <CustomBlurButtonLarge {...args} isLoading />
      <CustomBlurButtonLarge {...args} isDisabled isLoading />
    </View>
  ),
};

export const WithIcons: Story = {
  render: args => (
    <View style={styles.stack}>
      <CustomBlurButtonLarge {...args} leftIcon="airplane-outline" rightIcon="arrow-forward-outline" />
      <CustomBlurButtonLarge {...args} leftIcon="airplane-outline" />
      <CustomBlurButtonLarge {...args} rightIcon="arrow-forward-outline" />
    </View>
  ),
};

const styles = StyleSheet.create({
  backdrop: {
    justifyContent: 'center',
    padding: spacing.Fourfold,
    minHeight: spacing.separator160,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stack: {
    gap: spacing.Double,
  },
});
