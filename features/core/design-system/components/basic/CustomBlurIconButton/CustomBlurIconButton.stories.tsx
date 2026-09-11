import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { fn } from 'storybook/test';

import { CustomBlurIconButtonLarge } from '@/features/core/design-system/components/basic/CustomBlurIconButton/CustomBlurIconButtonLarge';
import { CustomBlurIconButtonMedium } from '@/features/core/design-system/components/basic/CustomBlurIconButton/CustomBlurIconButtonMedium';
import { CustomBlurIconButtonSmall } from '@/features/core/design-system/components/basic/CustomBlurIconButton/CustomBlurIconButtonSmall';
import { CustomImage } from '@/features/core/design-system/components/basic/CustomImage/CustomImage';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

const photo = require('@/features/core/design-system/assets/images/welcome_2.jpg');

const meta = {
  title: 'Design System/CustomBlurIconButton',
  component: CustomBlurIconButtonLarge,
  tags: ['autodocs'],
  // NOTE: same photo backdrop as the blur pill — without one, the blur has nothing to sample.
  decorators: [
    Story => (
      <View style={styles.backdrop}>
        <CustomImage source={photo} style={styles.photo} useBlur={false} contentFit="cover" />
        <View style={styles.row}>
          <Story />
        </View>
      </View>
    ),
  ],
  args: {
    iconName: 'airplane-outline',
    onPress: fn(),
    isDisabled: false,
    isLoading: false,
  },
} satisfies Meta<typeof CustomBlurIconButtonLarge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 50/40/30px circles with 20/20/12px glyphs. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomBlurIconButtonLarge {...args} />
      <CustomBlurIconButtonMedium {...args} />
      <CustomBlurIconButtonSmall {...args} />
    </View>
  ),
};

export const States: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomBlurIconButtonLarge {...args} />
      <CustomBlurIconButtonLarge {...args} isDisabled />
      <CustomBlurIconButtonLarge {...args} isLoading />
      <CustomBlurIconButtonLarge {...args} isDisabled isLoading />
    </View>
  ),
};

const styles = StyleSheet.create({
  backdrop: {
    justifyContent: 'center',
    padding: spacing.Fourfold,
    minHeight: spacing.separator120,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.Double,
  },
});
