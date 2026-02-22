import type { StyleProp, ViewStyle } from 'react-native';
import { CustomCard, type CustomCardProps } from '../../basic/CustomCard/CustomCard';
import CustomText from '../../basic/CustomText/CustomText';
import { type CustomNumberButtonLogicProps, useCustomNumberButtonLogic } from './CustomNumberButton.logic';

export type CustomNumberButtonProps = CustomNumberButtonLogicProps &
  CustomCardProps & {
    label: string;
    style?: StyleProp<ViewStyle>;
  };

export const CustomNumberButton = ({ label, style, ...rest }: CustomNumberButtonProps) => {
  const { componentStyle } = useCustomNumberButtonLogic(rest);
  return (
    <CustomCard style={[componentStyle.card, style]} {...rest}>
      <CustomText style={componentStyle.label} text={label} numberOfLines={2} ellipsizeMode="tail" />
    </CustomCard>
  );
};
