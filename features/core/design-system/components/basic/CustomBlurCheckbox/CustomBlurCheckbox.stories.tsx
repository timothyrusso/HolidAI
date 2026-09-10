import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { fn } from 'storybook/test';

import { CustomBlurCheckbox } from '@/features/core/design-system/components/basic/CustomBlurCheckbox/CustomBlurCheckbox';
import { CheckboxState } from '@/features/core/design-system/components/basic/CustomCheckbox/CustomCheckbox.logic';
import { CustomImage } from '@/features/core/design-system/components/basic/CustomImage/CustomImage';
import { checkboxSizes } from '@/features/core/design-system/style/dimensions/checkbox';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

const photo = require('@/features/core/design-system/assets/images/welcome_2.jpg');

const meta = {
  title: 'Design System/CustomBlurCheckbox',
  component: CustomBlurCheckbox,
  tags: ['autodocs'],
  // Same photo backdrop as the blur buttons: without one, the blur has nothing to sample.
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
    state: CheckboxState.checked,
    size: 'medium',
    onChange: fn(),
    accessibilityLabel: 'Add to trip',
  },
  argTypes: {
    state: { control: 'select', options: [CheckboxState.checked, CheckboxState.unchecked] },
    size: { control: 'select', options: Object.keys(checkboxSizes) },
  },
} satisfies Meta<typeof CustomBlurCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Checked carries the heavier fill and the fainter ring; unchecked is the reverse. */
export const AllStates: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomBlurCheckbox {...args} state={CheckboxState.checked} />
      <CustomBlurCheckbox {...args} state={CheckboxState.unchecked} />
    </View>
  ),
};

/** 40 and 48 px boxes, each with a glyph half its size. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomBlurCheckbox {...args} size="medium" />
      <CustomBlurCheckbox {...args} size="large" />
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
