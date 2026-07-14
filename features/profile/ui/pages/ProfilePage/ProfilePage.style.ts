import { StyleSheet } from 'react-native';
import { components, fontFamily, fontSize, spacing } from '@/features/core/ui';

export const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginVertical: spacing.Fourfold,
  },
  avatar: {
    width: components.profileImageHeight,
    height: components.profileImageHeight,
    borderRadius: components.profileImageHeight / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.Fourfold,
    alignSelf: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: fontSize.XL2,
    fontFamily: fontFamily.interBold,
    textAlign: 'center',
    paddingBottom: spacing.Fourfold,
  },
  settingsContainer: {
    marginHorizontal: spacing.Fourfold,
    marginTop: spacing.Quintuple,
  },
  contentContainer: {
    paddingBottom: spacing.separator80,
  },
  avatarSkeleton: {
    width: components.profileImageHeight,
    height: components.profileImageHeight,
    borderRadius: components.profileImageHeight / 2,
  },
  nameSkeleton: {
    width: '40%',
    height: spacing.Fourfold,
    borderRadius: spacing.Double,
    alignSelf: 'center',
    marginTop: spacing.Double,
  },
  skeletonContainer: {
    marginHorizontal: spacing.Fourfold,
  },
  skeleton: {
    width: '100%',
    height: spacing.separator80,
    borderRadius: spacing.Fourfold,
  },
});
