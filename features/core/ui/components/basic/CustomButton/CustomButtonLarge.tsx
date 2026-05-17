import { BaseButton, type CustomButtonProps } from '@/features/core/ui/components/basic/CustomButton/BaseButton';
import { components } from '@/features/core/ui/style/dimensions/components';

export function CustomButtonLarge(props: CustomButtonProps) {
  return <BaseButton {...props} size={components.buttonLargeHeight} />;
}
