import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/ui/constants/style/dimensions/spacing';
import { View } from 'react-native';
import WelcomeIllustration from '../../../assets/images/welcome_illustration.svg';
import { useWelcomePageLogic } from './WelcomePage.logic';
import { styles } from './WelcomePage.style';

const WelcomePage = () => {
  const { handlePress } = useWelcomePageLogic();

  return (
    <BasicView nameView={Routes.Welcome} isFullScreen>
      <CustomScrollView>
        <View style={styles.container}>
          <View style={styles.illustrationContainer}>
            <WelcomeIllustration width={SCREEN_WIDTH} height={SCREEN_HEIGHT} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <CustomText text="People don't take trips," style={styles.title} />
              <View style={styles.secondLineContainer}>
                <CustomText text="trips take " style={styles.title} />
                <CustomText text="people" style={[styles.title, styles.peopleText]} />
              </View>
            </View>
            <CustomText text="WELCOME.TITLE" style={styles.subtitle} />
            <CustomButtonLarge
              title="WELCOME.BUTTON"
              onPress={handlePress}
              style={styles.button}
              buttonType={ButtonType.Main}
            />
          </View>
        </View>
      </CustomScrollView>
    </BasicView>
  );
};

export default WelcomePage;
