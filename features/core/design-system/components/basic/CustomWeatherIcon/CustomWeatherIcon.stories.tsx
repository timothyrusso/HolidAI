import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  CustomWeatherIcon,
  DEFAULT_WEATHER_ICON_SIZE,
  weatherConditions,
} from '@/features/core/design-system/components/basic/CustomWeatherIcon/CustomWeatherIcon';
import { colors } from '@/features/core/design-system/style/colors';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily } from '@/features/core/design-system/style/fontFamily';

const SIZE_ROWS = [
  { label: 'Small · 24', size: 24 },
  { label: `Medium · ${DEFAULT_WEATHER_ICON_SIZE} · default`, size: DEFAULT_WEATHER_ICON_SIZE },
  { label: 'Large · 48', size: 48 },
] as const;

const meta = {
  title: 'Design System/CustomWeatherIcon',
  component: CustomWeatherIcon,
  tags: ['autodocs'],
  args: {
    condition: weatherConditions.sunny,
    size: DEFAULT_WEATHER_ICON_SIZE,
  },
  argTypes: {
    condition: { control: 'select', options: Object.values(weatherConditions) },
    size: { control: { type: 'range', min: 8, max: 64, step: 1 } },
  },
} satisfies Meta<typeof CustomWeatherIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Every condition, derived from `Object.entries` at render time rather than a hand-written list —
 * a new key in `weatherConditions` becomes a new cell here with no edit to this file.
 *
 * The labels are raw `Text`, not `CustomText`: `CustomText` pipes every string through `t()` with no
 * escape hatch, and these are code identifiers, not copy.
 */
export const AllConditions: Story = {
  parameters: { controls: { include: ['size'] } },
  render: args => (
    <ScrollView contentContainerStyle={styles.grid}>
      {Object.entries(weatherConditions).map(([key, condition]) => (
        <View key={key} style={styles.cell}>
          <CustomWeatherIcon {...args} condition={condition} />
          <Text style={styles.cellLabel}>{key}</Text>
        </View>
      ))}
    </ScrollView>
  ),
};

/** The three sizes the design specifies, each row carrying all six conditions for comparison. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={styles.stack}>
      {SIZE_ROWS.map(({ label, size }) => (
        <View key={label} style={styles.sizeRow}>
          <Text style={styles.rowLabel}>{label}</Text>
          <View style={styles.row}>
            {Object.values(weatherConditions).map(condition => (
              <CustomWeatherIcon key={condition} condition={condition} size={size} />
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

/** Three columns inside the 360px phone frame from `.storybook/preview.tsx`, for six conditions. */
const CELL_WIDTH = '33.33%';

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
  stack: {
    gap: spacing.Triple,
  },
  sizeRow: {
    gap: spacing.SingleAndHalf,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.Double,
  },
  cellLabel: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.XS,
    textAlign: 'center',
  },
  rowLabel: {
    color: colors.primaryGrey,
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.XS,
  },
});
