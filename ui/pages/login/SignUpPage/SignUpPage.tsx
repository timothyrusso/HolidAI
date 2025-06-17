import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { CustomTextButton } from '@/ui/components/basic/CustomTextButton/CustomTextButton';
import CustomTextInput from '@/ui/components/basic/CustomTextInput/CustomTextInput';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { InfoModal } from '@/ui/components/dialogs/InfoModal/InfoModal';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { router } from 'expo-router';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
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
    fullName,
    setFullName,
    pendingVerification,
    code,
    setCode,
    onSignUpPress,
    onVerifyPress,
    isLoading,
  } = useSignUpPageLogic();

  if (pendingVerification) {
    return (
      <BasicView nameView={Routes.SignUp} statusBarStyle="dark" viewStyle={styles.verifyContainer}>
        <View style={styles.verifyContent}>
          <CustomText text="SIGNIN.RESET_PASSWORD_EMAIL_CODE" style={styles.verifyTitle} />
          <CustomTextInput
            value={code}
            placeholder="Enter your verification code"
            onChangeText={code => setCode(code)}
          />
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
            <CustomTextInput
              placeholder="SIGNUP.NAME_PLACEHOLDER"
              onChangeText={(text: string) => setFullName(text)}
              value={fullName}
            />
            <CustomTextInput
              placeholder="SIGNUP.EMAIL_PLACEHOLDER"
              onChangeText={(text: string) => setEmail(text)}
              value={email}
              autoComplete="email"
              keyboardType="email-address"
            />
            <CustomTextInput
              placeholder="SIGNUP.PASSWORD_PLACEHOLDER"
              secureTextEntry={true}
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              isPassword
            />
            <CustomTextInput
              placeholder="SIGNUP.CONFIRM_PASSWORD_PLACEHOLDER"
              secureTextEntry={true}
              onChangeText={(text: string) => setConfirmPassword(text)}
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
              <CustomTextButton
                title="SIGNIN.TITLE"
                onPress={() => router.replace(`/${Routes.SignIn}`)}
                textStyle={styles.textButton}
              />
            </View>
          </View>
        </View>
        <Toast />
        <InfoModal />
      </CustomScrollView>
    </BasicView>
  );
};

export default SignUpPage;
