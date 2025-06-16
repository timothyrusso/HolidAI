import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { BaseIconButton, type CustomIconButtonProps } from './BaseIconButton';

export function CustomIconButtonSmall(props: CustomIconButtonProps) {
  return <BaseIconButton {...props} size={props.size ?? components.buttonSmallHeight} iconSize={spacing.Double} />;
}
