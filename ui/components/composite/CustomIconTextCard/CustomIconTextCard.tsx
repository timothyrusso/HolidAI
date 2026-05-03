import { CustomCard, type CustomCardProps } from '@/ui/components/basic/CustomCard/CustomCard';
import { CustomIcon, type IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import {
  type CustomIconCardLogicProps,
  useCustomIconTextCardLogic,
} from '@/ui/components/composite/CustomIconTextCard/CustomIconTextCard.logic';
import { spacing } from '@/ui/style/dimensions/spacing';
import type { StyleProp, ViewStyle } from 'react-native';

export type CustomIconTextCardProps = CustomIconCardLogicProps &
  CustomCardProps & {
    label: string;
    icon: IoniconsName;
    style?: StyleProp<ViewStyle>;
    iconColor?: string;
  };

export const CustomIconTextCard = ({ icon, label, style, iconColor, ...rest }: CustomIconTextCardProps) => {
  const { componentStyle } = useCustomIconTextCardLogic(rest);
  return (
    <CustomCard style={[componentStyle.card, style]} {...rest}>
      <CustomIcon style={componentStyle.icon} size={spacing.Fourfold} name={icon} isOutlined color={iconColor} />
      <CustomText style={componentStyle.label} text={label} numberOfLines={2} ellipsizeMode="tail" />
    </CustomCard>
  );
};
