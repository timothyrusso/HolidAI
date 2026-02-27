import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { CustomTabButton } from '@/ui/components/composite/CustomTabButton/CustomTabButton';
import { CustomTabButtonWithText } from '@/ui/components/composite/CustomTabButtonWithText/CustomTabButtonWithText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

const TabLayout = () => {
  const router = useRouter();
  const searchRoute = `/${Stacks.CreateTrip}/${Routes.Search}`;
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(searchRoute);
  };
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabSlot />
      <TabList style={tabsStyle.tabList}>
        <TabTrigger name="home" href="/my-trips" style={tabsStyle.tabTrigger} asChild>
          <CustomTabButtonWithText icon={icons.location}>{t('MY_TRIP.MY_TRIPS')}</CustomTabButtonWithText>
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
  },
  tabTrigger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
