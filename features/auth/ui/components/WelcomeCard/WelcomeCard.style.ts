import { spacing } from '@/ui/style/dimensions/spacing';
import { shadows } from '@/ui/style/shadows';
import { StyleSheet } from 'react-native';

export const styles = (
  height: number,
  width: number,
  withPadding: boolean,
  withBorderRadius: boolean,
  top: number | undefined,
  left: number | undefined,
  bottom: number | undefined,
  right: number | undefined,
  photoEffect: boolean,
) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: top,
      left: left,
      bottom: bottom,
      right: right,
      height,
      width,
      alignItems: 'center',
      justifyContent: 'center',
      padding: withPadding ? spacing.SingleAndHalf : 0,
      paddingBottom: withPadding ? (photoEffect ? spacing.Quintuple : spacing.SingleAndHalf) : 0,
      borderRadius: withBorderRadius ? spacing.Fourfold : 0,
      boxShadow: shadows.highShadow,
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
      borderRadius: withBorderRadius ? spacing.Fourfold : 0,
    },
  });
