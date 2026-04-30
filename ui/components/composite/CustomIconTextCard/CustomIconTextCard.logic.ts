import { styles } from '@/ui/components/composite/CustomIconTextCard/CustomIconTextCard.style';
import { colors } from '@/ui/style/colors';

export type CustomIconCardLogicProps = {
  iconBackground?: string;
  selected?: boolean;
};

export const useCustomIconTextCardLogic = ({ selected = false, iconBackground }: CustomIconCardLogicProps) => {
  const iconBackgroundColor = iconBackground ?? colors.primary;
  const labelColor = selected ? colors.primaryWhite : colors.primaryBlack;

  const componentStyle = styles(labelColor, iconBackgroundColor);

  return {
    componentStyle,
  };
};
