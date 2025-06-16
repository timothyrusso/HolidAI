import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { BaseIconButton, type CustomIconButtonProps } from './BaseIconButton';

export function CustomIconButtonMedium(props: CustomIconButtonProps) {
  return (
    <BaseIconButton {...props} size={props.size ?? components.buttonMediumHeight} iconSize={spacing.TripleAndHalf} />
  );
}
