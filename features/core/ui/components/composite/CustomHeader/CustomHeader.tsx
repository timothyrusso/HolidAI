import type { FC } from 'react';
import { View } from 'react-native';
import { ButtonType } from '@/features/core/ui/components/basic/CustomButton/CustomButton.logic';
import type { IoniconsName } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomIconButtonMedium } from '@/features/core/ui/components/basic/CustomIconButton/CustomIconButtonMedium';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import { useCustomHeaderLogic } from '@/features/core/ui/components/composite/CustomHeader/CustomHeader.logic';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

type CustomHeaderProps = {
  title?: string;
  icon?: IoniconsName;
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
      {title && <CustomText text={title} style={styleComponent.title} />}
    </View>
  );
};
