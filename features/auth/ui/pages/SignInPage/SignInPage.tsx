import { ResetPasswordModal } from '@/features/auth/ui/components/ResetPasswordModal/ResetPasswordModal';
import { useSignInPageLogic } from '@/features/auth/ui/pages/SignInPage/SignInPage.logic';
import { styles } from '@/features/auth/ui/pages/SignInPage/SignInPage.style';
import { Routes } from '@/features/core/navigation';
import {
  ActionModal,
  BasicView,
  ButtonType,
  CustomButtonLarge,
  CustomScrollView,
  CustomText,
  CustomTextButton,
  CustomTextInput,
  InfoModal,
} from '@/features/core/ui';
import { View } from 'react-native';

export const SignInPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleResetPasswordModal,
    onSignInPress,
    handleSignUpPress,
  } = useSignInPageLogic();

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
              <CustomTextButton title="SIGNUP.TITLE" onPress={handleSignUpPress} textStyle={styles.textButton} />
            </View>
          </View>
        </View>
        <ResetPasswordModal />
        <InfoModal />
        <ActionModal />
      </CustomScrollView>
    </BasicView>
  );
};
