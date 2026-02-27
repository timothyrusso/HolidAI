import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { spacing } from '@/ui/style/dimensions/spacing';
import type { Ionicons } from '@expo/vector-icons';
import type { FC } from 'react';
import { View } from 'react-native';
import { ButtonType } from '../../basic/CustomButton/CustomButton.logic';
import { CustomIconButtonMedium } from '../../basic/CustomIconButton/CustomIconButtonMedium';
import { useCustomHeaderLogic } from './CustomHeader.logic';

type CustomHeaderProps = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

const CustomHeader: FC<CustomHeaderProps> = ({ title, icon, onPress }) => {
  const { styleComponent } = useCustomHeaderLogic();

  return (
    <View style={styleComponent.container}>
      {onPress && icon && (
        <CustomIconButtonMedium
          iconName={icon}
          iconSize={spacing.Quintuple}
          onPress={onPress}
          buttonType={ButtonType.Quaternary}
          style={styleComponent.icon}
        />
      )}
      <CustomText text={title} style={styleComponent.title} />
    </View>
  );
};

export default CustomHeader;
