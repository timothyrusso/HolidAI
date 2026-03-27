import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fonts } from '@/ui/style/fonts';
import { StyleSheet } from 'react-native';

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
    backgroundColor: colors.secondaryPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: spacing.Fourfold,
    fontFamily: fonts.interBold,
    textAlign: 'center',
  },
  email: {
    fontSize: spacing.Double,
    fontFamily: fonts.interRegular,
    textAlign: 'center',
    paddingTop: spacing.Triple,
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
  emailSkeleton: {
    width: '55%',
    height: spacing.Double + spacing.Minimal,
    borderRadius: spacing.Double,
    alignSelf: 'center',
    marginTop: spacing.Triple,
    marginBottom: spacing.Fourfold,
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
