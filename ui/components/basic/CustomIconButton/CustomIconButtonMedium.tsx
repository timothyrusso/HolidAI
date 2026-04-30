import { BaseIconButton, type CustomIconButtonProps } from '@/ui/components/basic/CustomIconButton/BaseIconButton';
import { components } from '@/ui/style/dimensions/components';
import { spacing } from '@/ui/style/dimensions/spacing';

export function CustomIconButtonMedium(props: CustomIconButtonProps) {
  return (
    <BaseIconButton {...props} size={props.size ?? components.buttonMediumHeight} iconSize={spacing.TripleAndHalf} />
  );
}
