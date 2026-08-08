import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { fn } from 'storybook/test';

import { ButtonType } from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import { CustomIconButtonLarge } from '@/features/core/design-system/components/basic/CustomIconButton/CustomIconButtonLarge';
import { CustomIconButtonMedium } from '@/features/core/design-system/components/basic/CustomIconButton/CustomIconButtonMedium';
import { CustomIconButtonSmall } from '@/features/core/design-system/components/basic/CustomIconButton/CustomIconButtonSmall';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

const meta = {
  title: 'Design System/CustomIconButton',
  component: CustomIconButtonLarge,
  tags: ['autodocs'],
  args: {
    iconName: 'airplane-outline',
    onPress: fn(),
    buttonType: ButtonType.Primary,
    isDisabled: false,
    isLoading: false,
  },
  argTypes: {
    buttonType: { control: 'select', options: Object.values(ButtonType) },
  },
} satisfies Meta<typeof CustomIconButtonLarge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Derived from `Object.values(ButtonType)` rather than a hand-written list, so a new `ButtonType`
 * shows up here automatically — the same exhaustiveness discipline `CustomButton.logic.ts` enforces
 * with ts-pattern's `.exhaustive()`.
 */
export const AllTypes: Story = {
  render: args => (
    <View style={styles.row}>
      {Object.values(ButtonType).map(buttonType => (
        <CustomIconButtonLarge {...args} key={buttonType} buttonType={buttonType} />
      ))}
    </View>
  ),
};

/** The real size exports, not `BaseIconButton` with a raw `size` prop. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomIconButtonLarge {...args} />
      <CustomIconButtonMedium {...args} />
      <CustomIconButtonSmall {...args} />
    </View>
  ),
};

export const States: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomIconButtonLarge {...args} />
      <CustomIconButtonLarge {...args} isDisabled />
      <CustomIconButtonLarge {...args} isLoading />
    </View>
  ),
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.Double,
  },
});
