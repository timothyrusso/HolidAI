import { BaseError, ErrorCode } from '@/features/core/error';
import { navigationService } from '@/features/core/navigation';
import { useToast } from '@/features/core/toast';
import { useGetUserTokens } from '@/features/user';
import { CustomTabButton } from '@/ui/components/composite/CustomTabButton/CustomTabButton';
import { CustomTabButtonWithText } from '@/ui/components/composite/CustomTabButtonWithText/CustomTabButtonWithText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { shadows } from '@/ui/style/shadows';
import * as Haptics from 'expo-haptics';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const TabLayout = () => {
  const { userTokens } = useGetUserTokens();
  const { showErrorToast } = useToast();
  const { t } = useTranslation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (userTokens === 0) {
      showErrorToast(new BaseError('No tokens remaining', ErrorCode.TokensExhausted));
      return;
    }
    navigationService.toSearch();
  };

  return (
    <Tabs>
      <TabSlot />
      <TabList style={tabsStyle.tabList}>
        <TabTrigger name="home" href="/home-page" style={tabsStyle.tabTrigger} asChild>
          <CustomTabButtonWithText icon={icons.location}>{t('HOME.TITLE')}</CustomTabButtonWithText>
        </TabTrigger>
        <CustomTabButton icon={icons.add} onPress={handlePress} />
        <TabTrigger name="profile" href="/profile" style={tabsStyle.tabTrigger} asChild>
          <CustomTabButtonWithText icon={icons.personCircleOutline}>{t('PROFILE.TITLE')}</CustomTabButtonWithText>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
};

export default TabLayout;

const tabsStyle = StyleSheet.create({
  tabList: {
    display: 'flex',
    position: 'absolute',
    bottom: spacing.Quintuple,
    left: spacing.Fourfold,
    right: spacing.Fourfold,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryGrey,
    paddingVertical: spacing.Double,
    paddingHorizontal: spacing.separator40,
    borderRadius: spacing.Quintuple,
    height: spacing.separator40 + spacing.TripleAndHalf,
    boxShadow: shadows.mediumShadow,
  },
  tabTrigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
