import { styles } from '@/features/auth/ui/components/ResetPasswordModal/components/ResetPasswordModalBody/ResetPasswordModalBody.style';
import { CustomText, CustomTextInput } from '@/features/core/ui';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';

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
          <CustomTextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
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
