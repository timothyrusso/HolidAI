import { colors } from '@/ui/style/colors';
import { styles } from './CustomNumberButton.style';

export type CustomNumberButtonLogicProps = {
  selected?: boolean;
};

export const useCustomNumberButtonLogic = ({ selected = false }: CustomNumberButtonLogicProps) => {
  const labelColor = selected ? colors.primaryWhite : colors.primaryBlack;

  const componentStyle = styles(labelColor);

  return {
    componentStyle,
  };
};
