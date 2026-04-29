import { BaseButton, type CustomButtonProps } from '@/ui/components/basic/CustomButton/BaseButton';
import { components } from '@/ui/style/dimensions/components';

export function CustomButtonMedium(props: CustomButtonProps) {
  return <BaseButton {...props} size={components.buttonMediumHeight} />;
}
