import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { CustomChip } from '@/features/core/design-system/components/basic/CustomChip/CustomChip';
import type { ChipColor } from '@/features/core/design-system/components/basic/CustomChip/CustomChip.logic';
import { CustomImage } from '@/features/core/design-system/components/basic/CustomImage/CustomImage';
import { colors } from '@/features/core/design-system/style/colors';
import { type ChipSizeName, chipSizes } from '@/features/core/design-system/style/dimensions/chip';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { icons } from '@/features/core/design-system/style/icons';
import { isPaletteBackgroundColor, type PaletteColor } from '@/features/core/design-system/style/paletteRoles';

const photo = require('@/features/core/design-system/assets/images/welcome_1.jpg');

const PALETTE = (Object.entries(colors) as [string, PaletteColor][]).filter((entry): entry is [string, ChipColor] =>
  isPaletteBackgroundColor(entry[1]),
);

// The props are a discriminated union, so the args inferred from the component cover the blur chip
// too and no single arg object satisfies them: the stories are typed off this solid, labelled arg
// set instead, and every other combination is rendered explicitly.
type ChipStoryArgs = {
  title: string;
  color: ChipColor;
  size: ChipSizeName;
  uppercase: boolean;
};

const meta = {
  title: 'Design System/CustomChip',
  component: CustomChip,
  tags: ['autodocs'],
  args: {
    title: 'Saved',
    color: colors.cyan300,
    size: 'medium',
    uppercase: true,
  },
  argTypes: {
    size: { control: 'select', options: Object.keys(chipSizes) },
    color: { control: 'select', options: PALETTE.map(([, color]) => color) },
    uppercase: { control: 'boolean' },
  },
} satisfies Meta<typeof CustomChip>;

export default meta;

type Story = StoryObj<ChipStoryArgs>;

export const Playground: Story = {};

/** 24 / 32 / 40 px tall, each a full pill: the radius is always half the height. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomChip {...args} size="small" />
      <CustomChip {...args} size="medium" />
      <CustomChip {...args} size="large" />
    </View>
  ),
};

/** Every palette colour with the label contrast the component derives for it — callers never pass it. */
export const AllColors: Story = {
  render: args => (
    <View style={styles.paletteGrid}>
      {PALETTE.map(([name, color]) => (
        <CustomChip {...args} key={name} color={color} title={name} />
      ))}
    </View>
  ),
};

/** Text only, icon before the label, and icon only — the square chip, which needs its own label. */
export const ContentModes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomChip {...args} />
      <CustomChip {...args} icon={icons.people} />
      <CustomChip color={args.color} size={args.size} icon={icons.people} accessibilityLabel="Travellers" />
    </View>
  ),
};

/** The chip hugs its content: same height, different widths. */
export const HugsItsContent: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomChip {...args} title="2" />
      <CustomChip {...args} title="A much longer label" />
    </View>
  ),
};

/**
 * A blur chip is only itself over something worth blurring: 25% black fill, a 50% white hairline,
 * and white content, at all three sizes.
 */
export const Blur: Story = {
  render: args => (
    <View style={styles.backdrop}>
      <CustomImage source={photo} style={styles.photo} useBlur={false} contentFit="cover" />
      <View style={styles.row}>
        <CustomChip variant="blur" title={args.title} icon={icons.people} size="small" />
        <CustomChip variant="blur" title={args.title} icon={icons.people} size="medium" />
        <CustomChip variant="blur" title={args.title} icon={icons.people} size="large" />
        <CustomChip variant="blur" icon={icons.hearth} accessibilityLabel="Saved" />
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.Double,
  },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.SingleAndHalf,
    padding: spacing.Double,
    backgroundColor: colors.tertiaryGrey,
  },
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
});
