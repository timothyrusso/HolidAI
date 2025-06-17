import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { CustomTextButton } from '@/ui/components/basic/CustomTextButton/CustomTextButton';
import CustomTextInput from '@/ui/components/basic/CustomTextInput/CustomTextInput';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { ActionModal } from '@/ui/components/dialogs/ActionModal/ActionModal';
import { InfoModal } from '@/ui/components/dialogs/InfoModal/InfoModal';
import { ResetPasswordModal } from '@/ui/components/dialogs/ResetPasswordModal/ResetPasswordModal';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSignInPageLogic } from './SignInPage.logic';
import { styles } from './SignInPage.style';

const SignInPage = () => {
  const { email, setEmail, password, setPassword, isLoading, handleResetPasswordModal, onSignInPress, router } =
    useSignInPageLogic();

  return (
    <BasicView nameView={Routes.SignIn} statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.container}>
          <CustomText text="SIGNIN.SUBTITLE" style={styles.subtitle} />
          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="SIGNIN.EMAIL_PLACEHOLDER"
              onChangeText={(text: string) => setEmail(text)}
              value={email}
              autoComplete="email"
              keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
              <CustomTextInput
                placeholder="SIGNIN.PASSWORD_PLACEHOLDER"
                onChangeText={(text: string) => setPassword(text)}
                value={password}
                isPassword={true}
              />
              <CustomTextButton
                title="SIGNIN.RESET_PASSWORD"
                onPress={handleResetPasswordModal}
                textStyle={styles.textButton}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButtonLarge
              title="SIGNIN.TITLE"
              onPress={onSignInPress}
              isLoading={isLoading}
              buttonType={ButtonType.Main}
            />
            <View style={styles.noAccountContainer}>
              <CustomText text="SIGNIN.NO_ACCOUNT" style={styles.labelText} />
              <CustomTextButton
                title="SIGNUP.TITLE"
                onPress={() => router.replace(`/${Routes.SignUp}`)}
                textStyle={styles.textButton}
              />
            </View>
          </View>
        </View>
        <Toast />
        <ResetPasswordModal />
        <InfoModal />
        <ActionModal />
      </CustomScrollView>
    </BasicView>
  );
};

export default SignInPage;
