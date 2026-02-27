import { components } from '@/ui/style/dimensions/components';
import { BaseButton, type CustomButtonProps } from './BaseButton';

export function CustomButtonSmall(props: CustomButtonProps) {
  return <BaseButton {...props} size={components.buttonSmallHeight} />;
}
