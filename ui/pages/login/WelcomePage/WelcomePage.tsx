import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { LinearGradientText } from '@/ui/components/basic/LinearGradientText/LinearGradientText';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, View } from 'react-native';
import { useWelcomePageLogic } from './WelcomePage.logic';
import { styles } from './WelcomePage.style';

const WelcomePage = () => {
  const { handlePress, welcomeTextBackground } = useWelcomePageLogic();

  return (
    <BasicView nameView={Routes.Welcome} isFullScreen>
      <CustomScrollView>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            <CustomText text="MY_TRIP.LOGO" style={styles.title} />
          </View>
          <LinearGradient colors={[colors.alpha, colors.primaryWhite]} style={styles.gradient} />
          <LinearGradientText
            text="WELCOME.TITLE"
            imageSource={welcomeTextBackground}
            height={components.welcomePageBackgroundTextHeight}
          />
          <CustomButtonLarge
            title="WELCOME.BUTTON"
            onPress={handlePress}
            style={styles.button}
            buttonType={ButtonType.Main}
          />
        </View>
      </CustomScrollView>
    </BasicView>
  );
};

export default WelcomePage;
