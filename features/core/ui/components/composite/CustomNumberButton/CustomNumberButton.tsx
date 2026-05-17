import { CustomCard, type CustomCardProps } from '@/features/core/ui/components/basic/CustomCard/CustomCard';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';
import {
  type CustomNumberButtonLogicProps,
  useCustomNumberButtonLogic,
} from '@/features/core/ui/components/composite/CustomNumberButton/CustomNumberButton.logic';
import type { StyleProp, ViewStyle } from 'react-native';

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
