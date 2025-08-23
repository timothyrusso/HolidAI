import { colors } from '@/ui/constants/style/colors';
import { icons } from '@/ui/constants/style/icons';
import type { FC } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { ButtonType } from '../CustomButton/CustomButton.logic';
import { CustomIconButtonMedium } from '../CustomIconButton/CustomIconButtonMedium';
import { useCustomTextInputLogic } from './CustomTextInput.logic';
import { styles as inputStyles } from './CustomTextInput.style';

type CustomTextInputProps = TextInputProps & {
  placeholder: string;
  placeholderTextColor?: string;
  isPassword?: boolean;
};

const CustomTextInput: FC<CustomTextInputProps> = ({
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

export default CustomTextInput;
