import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CustomIcon, DEFAULT_ICON_SIZE } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { colors } from '@/features/core/design-system/style/colors';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';
import { icons } from '@/features/core/design-system/style/icons';

const meta = {
  title: 'Design System/CustomIcon',
  component: CustomIcon,
  tags: ['autodocs'],
  args: {
    name: icons.airplane,
    size: DEFAULT_ICON_SIZE,
    color: colors.primaryBlack,
  },
  argTypes: {
    size: { control: { type: 'range', min: 8, max: 64, step: 1 } },
  },
} satisfies Meta<typeof CustomIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * The whole `icons` map, derived from `Object.entries` at render time rather than a hand-written
 * list — a new key in `icons.ts` becomes a new cell here with no edit to this file.
 *
 * Each cell carries both labels because the map key and the Ionicons name it resolves to diverge in
 * ways nobody can infer: `hearth` renders `heart-outline`, `heartOutline` renders the *sharp*
 * variant, and `arrowRight` is a chevron. Showing only the key would actively mislead.
 */
export const AllIcons: Story = {
  parameters: { controls: { include: ['size', 'color'] } },
  render: args => (
    <ScrollView contentContainerStyle={styles.grid}>
      {Object.entries(icons)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, ioniconsName]) => (
          <View key={key} style={styles.cell}>
            <CustomIcon {...args} name={ioniconsName} />
            <Text style={styles.key}>{key}</Text>
            <Text style={styles.ioniconsName}>{ioniconsName}</Text>
          </View>
        ))}
    </ScrollView>
  ),
};

/**
 * A ratio, not a fixed width: it yields the intended ~4 columns inside the 360px phone frame from
 * `.storybook/preview.tsx` without pinning the story to that number, and it stays a whole number of
 * columns on a device screen of any width.
 */
const CELL_WIDTH = '25%';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    alignItems: 'center',
    gap: spacing.Minimal,
    paddingBottom: spacing.Double,
    paddingHorizontal: spacing.Minimal,
    width: CELL_WIDTH,
  },
  key: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.XS,
    textAlign: 'center',
  },
  ioniconsName: {
    color: colors.primaryGrey,
    fontFamily: fontFamily.interRegular,
    fontSize: fontSize.XXS,
    textAlign: 'center',
  },
});
