import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { Image, View } from 'react-native';
import { useWelcomePageLogic } from './WelcomePage.logic';
import { styles } from './WelcomePage.style';

const WelcomePage = () => {
  const { handlePress, welcomePageImage } = useWelcomePageLogic();

  return (
    <BasicView nameView={Routes.Welcome} isFullScreen statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.contentContainer}>
          <Image source={welcomePageImage} style={styles.image} />
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <CustomText text="WELCOME.SUBTITLE_FIRST_LINE" style={styles.titleFirstLine} />
              <View style={styles.secondLineContainer}>
                <CustomText text="WELCOME.SUBTITLE_SECOND_LINE" style={styles.titleSecondLine} />
                <CustomText text="WELCOME.SUBTITLE_THIRD_LINE" style={[styles.titleSecondLine, styles.peopleText]} />
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
