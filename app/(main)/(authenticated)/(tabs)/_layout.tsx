import { navigationService } from '@/features/core/navigation';
import { CustomTabButton, CustomTabButtonWithText, colors, icons, shadows, spacing } from '@/features/core/ui';
import { useStartNewTrip } from '@/features/trips';
import * as Haptics from 'expo-haptics';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const TabLayout = () => {
  const { canStart } = useStartNewTrip();
  const { t } = useTranslation();

  const handlePress = () => {
    if (!canStart()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
