import { Platform } from 'react-native';
import { PlatformOS } from '../../PlatformOS';

export const components = {
  tripImageHeight: 320,
  activityImageHeight: 250,
  bottomMenuHeight: 90 + (Platform.OS.match(PlatformOS.ios) ? 20 : 0),
  modalFooterHeight: 90,
  tripCardImageHeight: 200,
  profileImageHeight: 150,
  createResetPasswordModalHeight: 496,
  changeResetPasswordModalHeight: 320,
  mapHeight: 300,
  mapCalloutWidth: 200,
  buttonLargeHeight: 50,
  buttonMediumHeight: 40,
  buttonSmallHeight: 30,
  headerHeight: 70,
  homeBoxSkeletonHeight: 200,
  textIconCard: 136,
  reviewPageAnimationHeight: 300,
  cardHeight: 100,
  tripAnimationHeight: 250,
  searchAnimationHeight: 250,
  welcomePageBackgroundTextHeight: 50,
  welcomeLogoHeight: 150,
};
