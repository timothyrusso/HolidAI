import { Stacks } from '@/modules/navigation/domain/entities/routes';
import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { components } from '@/ui/style/dimensions/components';

import { icons } from '@/ui/style/icons';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ButtonsContainer } from '../../components/ButtonsContainer/ButtonsContainer';
import { UserDataBox } from '../../components/UserDataBox/UserDataBox';
import { useProfilePageLogic } from './ProfilePage.logic';
import { styles } from './ProfilePage.style';
export const ProfilePage = () => {
  const {
    logout,
    deleteAccount,
    avatar,
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
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <SvgXml xml={avatar} width={components.profileImageHeight} height={components.profileImageHeight} />
          </View>
        </View>
        {username && <CustomText text={username} style={styles.name} />}
        {email && <CustomText text={email} style={styles.email} />}
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
            secondOnPress={deleteAccount}
            secondIcon={icons.delete}
            secondIsLoading={isDeleteAccountLoading}
            thirdTitle="GLOBAL.BUTTON.LOGOUT"
            thirdOnPress={logout}
            thirdIcon={icons.logout}
            thirdIsLoading={isLogoutLoading}
          />
        </View>
      </CustomScrollView>
    </BasicView>
  );
};
