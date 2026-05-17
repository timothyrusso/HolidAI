import { Stacks } from '@/features/core/navigation';
import { BaseSkeleton, BasicView, CustomScrollView, CustomText, components, icons } from '@/features/core/ui';
import { ButtonsContainer } from '@/features/profile/ui/components/ButtonsContainer/ButtonsContainer';
import { UserDataBox } from '@/features/profile/ui/components/UserDataBox/UserDataBox';
import { useProfilePageLogic } from '@/features/profile/ui/pages/ProfilePage/ProfilePage.logic';
import { styles } from '@/features/profile/ui/pages/ProfilePage/ProfilePage.style';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

export const ProfilePage = () => {
  const {
    handleLogout,
    handleDeleteAccount,
    avatar,
    isUserLoading,
    username,
    email,
    totalTrips,
    favoriteTrips,
    isTripDataLoading,
    goToChangeLanguage,
    goToShowAllTrips,
    isDeleteAccountLoading,
    isLogoutLoading,
    userTokens,
  } = useProfilePageLogic();

  return (
    <BasicView nameView={Stacks.Profile} isMenuVisible statusBarStyle="dark" hasHeader={false}>
      <CustomScrollView contentContainerStyle={styles.contentContainer}>
        {isUserLoading ? (
          <View style={styles.avatarContainer}>
            <BaseSkeleton style={styles.avatarSkeleton} />
            <BaseSkeleton style={styles.nameSkeleton} />
            <BaseSkeleton style={styles.emailSkeleton} />
          </View>
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <SvgXml xml={avatar} width={components.profileImageHeight} height={components.profileImageHeight} />
              </View>
            </View>
            {username && <CustomText text={username} style={styles.name} />}
            {email && <CustomText text={email} style={styles.email} />}
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
            secondTitle="PROFILE.BUTTON.DELETE_ACCOUNT"
            secondOnPress={handleDeleteAccount}
            secondIcon={icons.delete}
            secondIsLoading={isDeleteAccountLoading}
            thirdTitle="GLOBAL.BUTTON.LOGOUT"
            thirdOnPress={handleLogout}
            thirdIcon={icons.logout}
            thirdIsLoading={isLogoutLoading}
          />
        </View>
      </CustomScrollView>
    </BasicView>
  );
};
