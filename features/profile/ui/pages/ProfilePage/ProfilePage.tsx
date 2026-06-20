import { Stacks } from '@/features/core/navigation';
import { BaseSkeleton, BasicView, CustomImage, CustomScrollView, CustomText, icons } from '@/features/core/ui';
import { ButtonsContainer } from '@/features/profile/ui/components/ButtonsContainer/ButtonsContainer';
import { UserDataBox } from '@/features/profile/ui/components/UserDataBox/UserDataBox';
import { useProfilePageLogic } from '@/features/profile/ui/pages/ProfilePage/ProfilePage.logic';
import { styles } from '@/features/profile/ui/pages/ProfilePage/ProfilePage.style';
import { View } from 'react-native';

export const ProfilePage = () => {
  const {
    isUserLoading,
    username,
    totalTrips,
    favoriteTrips,
    isTripDataLoading,
    goToChangeLanguage,
    goToShowAllTrips,
    userTokens,
    goToAccountSettings,
    profileImage,
  } = useProfilePageLogic();

  return (
    <BasicView nameView={Stacks.Profile} isMenuVisible statusBarStyle="dark" hasHeader={false}>
      <CustomScrollView contentContainerStyle={styles.contentContainer}>
        {isUserLoading ? (
          <View style={styles.avatarContainer}>
            <BaseSkeleton style={styles.avatarSkeleton} />
            <BaseSkeleton style={styles.nameSkeleton} />
          </View>
        ) : (
          <>
            <View style={styles.avatar}>
              <CustomImage source={{ uri: profileImage }} style={styles.avatarImage} />
            </View>
            {username && <CustomText text={username} style={styles.name} />}
          </>
        )}
        {isTripDataLoading ? (
          <View style={styles.skeletonContainer}>
            <BaseSkeleton style={styles.skeleton} />
          </View>
        ) : (
          <UserDataBox
            totalTrips={totalTrips}
            favoriteTrips={favoriteTrips}
            userTokens={userTokens}
            onPress={goToShowAllTrips}
          />
        )}
        <View style={styles.settingsContainer}>
          <ButtonsContainer
            firstTitle="PROFILE.BUTTON.CHANGE_LANGUAGE"
            firstOnPress={goToChangeLanguage}
            firstIcon={icons.language}
            secondTitle="PROFILE.BUTTON.ACCOUNT_SETTINGS"
            secondOnPress={goToAccountSettings}
            secondIcon={icons.settings}
          />
        </View>
      </CustomScrollView>
    </BasicView>
  );
};
