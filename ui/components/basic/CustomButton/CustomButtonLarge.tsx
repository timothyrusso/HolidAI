import { BaseButton, type CustomButtonProps } from '@/ui/components/basic/CustomButton/BaseButton';
import { components } from '@/ui/style/dimensions/components';

export function CustomButtonLarge(props: CustomButtonProps) {
  return <BaseButton {...props} size={components.buttonLargeHeight} />;
}
