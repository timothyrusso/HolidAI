import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIconButtonMedium } from '@/ui/components/basic/CustomIconButton/CustomIconButtonMedium';
import { useCustomTextInputLogic } from '@/ui/components/basic/CustomTextInput/CustomTextInput.logic';
import { styles as inputStyles } from '@/ui/components/basic/CustomTextInput/CustomTextInput.style';
import { colors } from '@/ui/style/colors';
import { icons } from '@/ui/style/icons';
import type { FC } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';

type CustomTextInputProps = TextInputProps & {
  placeholder: string;
  placeholderTextColor?: string;
  isPassword?: boolean;
};

export const CustomTextInput: FC<CustomTextInputProps> = ({
  placeholder,
  placeholderTextColor = colors.primaryGrey,
  isPassword = false,
  ...TextInputProps
}) => {
  const { isPasswordVisible, setIsPasswordVisible, t } = useCustomTextInputLogic();
  const styles = inputStyles(isPassword);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t(placeholder)}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input]}
        secureTextEntry={isPassword ? !isPasswordVisible : false}
        {...TextInputProps}
      />
      {isPassword && (
        <CustomIconButtonMedium
          iconName={isPasswordVisible ? icons.eye : icons.eyeOff}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          buttonType={ButtonType.Ghost}
          style={styles.eyeButton}
        />
      )}
    </View>
  );
};
