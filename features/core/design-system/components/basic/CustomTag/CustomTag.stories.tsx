import type { Meta, StoryObj } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';

import { CustomImage } from '@/features/core/design-system/components/basic/CustomImage/CustomImage';
import { CustomTag } from '@/features/core/design-system/components/basic/CustomTag/CustomTag';
import type { TagColor } from '@/features/core/design-system/components/basic/CustomTag/CustomTag.logic';
import { colors } from '@/features/core/design-system/style/colors';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { type TagSizeName, tagSizes } from '@/features/core/design-system/style/dimensions/tag';
import { icons } from '@/features/core/design-system/style/icons';
import { isPaletteBackgroundColor, type PaletteColor } from '@/features/core/design-system/style/paletteRoles';

const photo = require('@/features/core/design-system/assets/images/welcome_1.jpg');

const PALETTE = (Object.entries(colors) as [string, PaletteColor][]).filter((entry): entry is [string, TagColor] =>
  isPaletteBackgroundColor(entry[1]),
);

// The props are a discriminated union, so the args inferred from the component cover the blur tag
// too and no single arg object satisfies them: the stories are typed off this solid, labelled arg
// set instead, and every other combination is rendered explicitly.
type TagStoryArgs = {
  title: string;
  color: TagColor;
  size: TagSizeName;
  uppercase: boolean;
};

const meta = {
  title: 'Design System/CustomTag',
  component: CustomTag,
  tags: ['autodocs'],
  args: {
    title: 'Summer',
    color: colors.lime500,
    size: 'medium',
    uppercase: true,
  },
  argTypes: {
    size: { control: 'select', options: Object.keys(tagSizes) },
    color: { control: 'select', options: PALETTE.map(([, color]) => color) },
    uppercase: { control: 'boolean' },
  },
} satisfies Meta<typeof CustomTag>;

export default meta;

type Story = StoryObj<TagStoryArgs>;

export const Playground: Story = {};

/** 24 / 32 / 40 px tall, all three cut to the same flat radius: a tag is never a pill. */
export const AllSizes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomTag {...args} size="small" />
      <CustomTag {...args} size="medium" />
      <CustomTag {...args} size="large" />
    </View>
  ),
};

/**
 * Every palette colour with the border and the label contrast the component derives for it — one
 * shade darker in the same family, the neutrals borrowing grey. Callers pass neither.
 */
export const AllColors: Story = {
  render: args => (
    <View style={styles.paletteGrid}>
      {PALETTE.map(([name, color]) => (
        <CustomTag {...args} key={name} color={color} title={name} icon={icons.star} />
      ))}
    </View>
  ),
};

/** Text only, icon before the label, and icon only — the square tag, which needs its own label. */
export const ContentModes: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomTag {...args} />
      <CustomTag {...args} icon={icons.people} />
      <CustomTag color={args.color} size={args.size} icon={icons.people} accessibilityLabel="Travellers" />
    </View>
  ),
};

/** The tag hugs its content: same height, different widths. */
export const HugsItsContent: Story = {
  render: args => (
    <View style={styles.row}>
      <CustomTag {...args} title="2" />
      <CustomTag {...args} title="A much longer label" />
    </View>
  ),
};

/** The height is fixed, so a label wider than its container ellipsises rather than wrapping. */
export const Truncation: Story = {
  render: args => (
    <View style={styles.narrow}>
      <CustomTag {...args} title="An impossibly long tag label" />
    </View>
  ),
};

/**
 * A blur tag is only itself over something worth blurring: 25% black fill, a 50% white hairline,
 * and white content, at all three sizes.
 */
export const Blur: Story = {
  render: args => (
    <View style={styles.backdrop}>
      <CustomImage source={photo} style={styles.photo} useBlur={false} contentFit="cover" />
      <View style={styles.row}>
        <CustomTag variant="blur" title={args.title} icon={icons.people} size="small" />
        <CustomTag variant="blur" title={args.title} icon={icons.people} size="medium" />
        <CustomTag variant="blur" title={args.title} icon={icons.people} size="large" />
        <CustomTag variant="blur" icon={icons.hearth} accessibilityLabel="Saved" />
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
  narrow: {
    width: spacing.separator120,
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
