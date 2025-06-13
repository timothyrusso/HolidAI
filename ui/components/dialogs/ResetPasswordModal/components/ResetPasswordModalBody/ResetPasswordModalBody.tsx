import CustomText from '@/ui/components/basic/CustomText/CustomText';
import CustomTextInput from '@/ui/components/basic/CustomTextInput/CustomTextInput';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';
import { styles } from './ResetPasswordModalBody.style';

type ResetPasswordModalBodyProps = {
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  password: string;
  setPassword: (password: string) => void;
  successfulCreation: boolean;
};

export const ResetPasswordModalBody: FC<ResetPasswordModalBodyProps> = ({
  email,
  setEmail,
  code,
  setCode,
  password,
  setPassword,
  successfulCreation,
}) => {
  return (
    <View style={styles.container}>
      {!successfulCreation && (
        <Fragment>
          <CustomTextInput placeholder="Email" value={email} onChangeText={setEmail} />
        </Fragment>
      )}
      {successfulCreation && (
        <View style={styles.inputContainer}>
          <CustomText text="SIGNIN.RESET_PASSWORD_EMAIL_CODE" style={styles.label} />
          <CustomTextInput placeholder="Code" value={code} onChangeText={setCode} />
          <CustomText text="SIGNIN.PASSWORD" style={styles.label} />
          <CustomTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
      )}
    </View>
  );
};
