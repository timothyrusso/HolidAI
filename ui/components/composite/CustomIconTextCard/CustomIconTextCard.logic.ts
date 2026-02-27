import { colors } from '@/ui/style/colors';
import { styles } from './CustomIconTextCard.style';

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
