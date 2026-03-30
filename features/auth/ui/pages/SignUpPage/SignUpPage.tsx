import { Routes } from '@/features/core/navigation';
import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { CustomTextButton } from '@/ui/components/basic/CustomTextButton/CustomTextButton';
import CustomTextInput from '@/ui/components/basic/CustomTextInput/CustomTextInput';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { InfoModal } from '@/ui/components/dialogs/InfoModal/InfoModal';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { View } from 'react-native';
import { useSignUpPageLogic } from './SignUpPage.logic';
import { styles } from './SignUpPage.style';

const SignUpPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    name,
    setName,
    pendingVerification,
    code,
    setCode,
    onSignUpPress,
    onVerifyPress,
    isLoading,
    handleSignInPress,
  } = useSignUpPageLogic();

  if (pendingVerification) {
    return (
      <BasicView nameView={Routes.SignUp} statusBarStyle="dark" viewStyle={styles.verifyContainer}>
        <View style={styles.verifyContent}>
          <CustomText text="SIGNUP.EMAIL_VERIFICATION_CODE" style={styles.verifyTitle} />
          <CustomTextInput value={code} placeholder="SIGNUP.VERIFICATION_CODE_PLACEHOLDER" onChangeText={setCode} />
          <CustomButtonLarge onPress={onVerifyPress} title="SIGNIN.VERIFY" isLoading={isLoading} />
        </View>
      </BasicView>
    );
  }

  return (
    <BasicView nameView={Routes.SignUp} statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.container}>
          <CustomText text="SIGNUP.SUBTITLE" style={styles.subtitle} />
          <View style={styles.inputContainer}>
            <CustomTextInput placeholder="SIGNUP.NAME_PLACEHOLDER" onChangeText={setName} value={name} />
            <CustomTextInput
              placeholder="SIGNUP.EMAIL_PLACEHOLDER"
              onChangeText={setEmail}
              value={email}
              autoComplete="email"
              keyboardType="email-address"
            />
            <CustomTextInput
              placeholder="SIGNUP.PASSWORD_PLACEHOLDER"
              onChangeText={setPassword}
              value={password}
              isPassword
            />
            <CustomTextInput
              placeholder="SIGNUP.CONFIRM_PASSWORD_PLACEHOLDER"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              isPassword
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButtonLarge
              title="SIGNIN.CREATE_ACCOUNT"
              onPress={onSignUpPress}
              isLoading={isLoading}
              buttonType={ButtonType.Main}
            />
            <View style={styles.alreadyAccountContainer}>
              <CustomText text="SIGNUP.ALREADY_ACCOUNT" style={styles.labelText} />
              <CustomTextButton title="SIGNIN.TITLE" onPress={handleSignInPress} textStyle={styles.textButton} />
            </View>
          </View>
        </View>
        <InfoModal />
      </CustomScrollView>
    </BasicView>
  );
};

export default SignUpPage;
