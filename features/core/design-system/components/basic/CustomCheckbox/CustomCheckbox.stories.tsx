import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { fn } from 'storybook/test';

import { CustomCheckbox } from '@/features/core/design-system/components/basic/CustomCheckbox/CustomCheckbox';
import {
  CheckboxColor,
  CheckboxState,
} from '@/features/core/design-system/components/basic/CustomCheckbox/CustomCheckbox.logic';
import { colors } from '@/features/core/design-system/style/colors';
import { type CheckboxSizeName, checkboxSizes } from '@/features/core/design-system/style/dimensions/checkbox';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

const LIGHT_BACKGROUND_COLORS = [
  CheckboxColor.purple500,
  CheckboxColor.lime500,
  CheckboxColor.red500,
  CheckboxColor.cyan500,
  CheckboxColor.primaryBlack,
] as const;

const INTERACTIVE_STATES = [CheckboxState.checked, CheckboxState.unchecked, CheckboxState.empty] as const;

// The props are a discriminated union — an interactive checkbox requires a label — so no single arg
// object satisfies them: the stories are typed off this static arg set instead.
type CheckboxStoryArgs = {
  state: CheckboxState;
  size: CheckboxSizeName;
  color: CheckboxColor;
};

const InteractiveCheckbox = ({ size, color }: Pick<CheckboxStoryArgs, 'size' | 'color'>) => {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <CustomCheckbox
      state={isChecked ? CheckboxState.checked : CheckboxState.unchecked}
      size={size}
      color={color}
      onChange={setIsChecked}
      accessibilityLabel="Add to trip"
    />
  );
};

const meta = {
  title: 'Design System/CustomCheckbox',
  component: CustomCheckbox,
  tags: ['autodocs'],
  args: {
    state: CheckboxState.checked,
    size: 'medium',
    color: CheckboxColor.purple500,
  },
  argTypes: {
    state: { control: 'select', options: Object.values(CheckboxState) },
    size: { control: 'select', options: Object.keys(checkboxSizes) },
    color: { control: 'select', options: Object.values(CheckboxColor) },
  },
} satisfies Meta<typeof CustomCheckbox>;

export default meta;

type Story = StoryObj<CheckboxStoryArgs>;

/** No `onChange`, so the Playground checkbox is the static one: set `state` to drive it. */
export const Playground: Story = {};

/** The three interactive states, then the static one — a checked checkbox with no handler at all. */
export const AllStates: Story = {
  render: args => (
    <View style={styles.row}>
      {INTERACTIVE_STATES.map(state => (
        <CustomCheckbox {...args} key={state} state={state} onChange={fn()} accessibilityLabel="Add to trip" />
      ))}
      <CustomCheckbox {...args} state={CheckboxState.checked} />
    </View>
  ),
};

/** The six checked fills with the checkmark colour each one derives, `primaryWhite` over the dark tile it is for. */
export const AllColors: Story = {
  render: args => (
    <View style={styles.row}>
      {LIGHT_BACKGROUND_COLORS.map(color => (
        <CustomCheckbox {...args} key={color} state={CheckboxState.checked} color={color} />
      ))}
      <View style={styles.darkTile}>
        <CustomCheckbox {...args} state={CheckboxState.checked} color={CheckboxColor.primaryWhite} />
      </View>
    </View>
  ),
};

/** 40 and 48 px boxes, each with a glyph half its size. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomCheckbox {...args} size="medium" />
      <CustomCheckbox {...args} size="large" />
    </View>
  ),
};

/** Holds its own state: the only story where the toggle animation can be seen, or reduce-motion QA'd. */
export const Interactive: Story = {
  render: ({ size, color }) => (
    <View style={styles.row}>
      <InteractiveCheckbox size={size} color={color} />
    </View>
  ),
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Triple,
  },
  darkTile: {
    padding: spacing.Double,
    borderRadius: spacing.SingleAndHalf,
    backgroundColor: colors.primaryBlack,
  },
});
