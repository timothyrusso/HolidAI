import { spacing } from '@/ui/style/dimensions/spacing';
import type { StyleProp, ViewStyle } from 'react-native';
import { CustomCard, type CustomCardProps } from '../../basic/CustomCard/CustomCard';
import { CustomIcon, type IoniconsName } from '../../basic/CustomIcon/CustomIcon';
import CustomText from '../../basic/CustomText/CustomText';
import { type CustomIconCardLogicProps, useCustomIconTextCardLogic } from './CustomIconTextCard.logic';

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
