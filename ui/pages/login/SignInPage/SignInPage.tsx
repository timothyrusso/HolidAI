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
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSignInPageLogic } from './SignInPage.logic';
import { styles } from './SignInPage.style';

const SignInPage = () => {
  const router = useRouter();
  const { onSignIn, email, setEmail, password, setPassword, isLoading, handleResetPasswordModal } =
    useSignInPageLogic();

  return (
    <BasicView nameView={Routes.SignIn} statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View style={styles.emailContainer}>
              <CustomText text="SIGNIN.EMAIL" style={styles.label} />
              <CustomTextInput
                placeholder="SIGNIN.EMAIL_PLACEHOLDER"
                onChangeText={(text: string) => setEmail(text)}
                value={email}
                autoComplete="email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.passwordContainer}>
              <CustomText text="SIGNIN.PASSWORD" style={styles.label} />
              <CustomTextInput
                placeholder="SIGNIN.PASSWORD_PLACEHOLDER"
                secureTextEntry={true}
                onChangeText={(text: string) => setPassword(text)}
                value={password}
              />
              <CustomTextButton
                title="SIGNIN.RESET_PASSWORD"
                onPress={handleResetPasswordModal}
                textStyle={styles.resetPasswordButton}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButtonLarge title="SIGNIN.TITLE" onPress={onSignIn} isLoading={isLoading} />
            <CustomButtonLarge
              title="SIGNIN.CREATE_ACCOUNT"
              onPress={() => router.replace(`/${Routes.SignUp}`)}
              buttonType={ButtonType.Secondary}
            />
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
