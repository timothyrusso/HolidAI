import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import CustomTextInput from '@/ui/components/basic/CustomTextInput/CustomTextInput';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { InfoModal } from '@/ui/components/dialogs/InfoModal/InfoModal';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSignUpPageLogic } from './SignUpPage.logic';
import { styles } from './SignUpPage.style';

const SignUpPage = () => {
  const {
    onCreateAccount,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    isLoading,
  } = useSignUpPageLogic();

  return (
    <BasicView nameView={Routes.SignUp} statusBarStyle="dark">
      <CustomScrollView>
        <View style={styles.container}>
          <Text style={styles.subtitle}>Create a new account!</Text>
          <View style={styles.inputContainer}>
            <View style={styles.emailContainer}>
              <CustomText text="SIGNUP.NAME" style={styles.label} />
              <CustomTextInput
                placeholder="SIGNUP.NAME_PLACEHOLDER"
                onChangeText={(text: string) => setFullName(text)}
                value={fullName}
              />
            </View>
            <View style={styles.emailContainer}>
              <CustomText text="SIGNUP.EMAIL" style={styles.label} />
              <CustomTextInput
                placeholder="SIGNUP.EMAIL_PLACEHOLDER"
                onChangeText={(text: string) => setEmail(text)}
                value={email}
                autoComplete="email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.passwordContainer}>
              <View>
                <CustomText text="SIGNUP.PASSWORD" style={styles.label} />
                <CustomTextInput
                  placeholder="SIGNUP.PASSWORD_PLACEHOLDER"
                  secureTextEntry={true}
                  onChangeText={(text: string) => setPassword(text)}
                  value={password}
                />
              </View>
              <View>
                <CustomText text="SIGNUP.CONFIRM_PASSWORD" style={styles.label} />
                <CustomTextInput
                  placeholder="SIGNUP.CONFIRM_PASSWORD_PLACEHOLDER"
                  secureTextEntry={true}
                  onChangeText={(text: string) => setConfirmPassword(text)}
                  value={confirmPassword}
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButtonLarge title="SIGNIN.CREATE_ACCOUNT" onPress={onCreateAccount} isLoading={isLoading} />
          </View>
        </View>
        <Toast />
        <InfoModal />
      </CustomScrollView>
    </BasicView>
  );
};

export default SignUpPage;
