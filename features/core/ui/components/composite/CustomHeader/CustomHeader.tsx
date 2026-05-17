import { ButtonType } from '@/features/core/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIconButtonMedium } from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonMedium';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { useCustomHeaderLogic } from '@/features/core/ui/components/composite/CustomHeader/CustomHeader.logic';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import type { Ionicons } from '@expo/vector-icons';
import type { FC } from 'react';
import { View } from 'react-native';

type CustomHeaderProps = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export const CustomHeader: FC<CustomHeaderProps> = ({ title, icon, onPress }) => {
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
