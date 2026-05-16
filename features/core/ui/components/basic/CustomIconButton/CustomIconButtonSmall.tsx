import {
  BaseIconButton,
  type CustomIconButtonProps,
} from '@/features/core/ui/components/basic/CustomIconButton/BaseIconButton';
import { components } from '@/features/core/ui/style/dimensions/components';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

export function CustomIconButtonSmall(props: CustomIconButtonProps) {
  return <BaseIconButton {...props} size={props.size ?? components.buttonSmallHeight} iconSize={spacing.Double} />;
}
