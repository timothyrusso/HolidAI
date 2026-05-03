import { styles } from '@/ui/components/composite/CustomNumberButton/CustomNumberButton.style';
import { colors } from '@/ui/style/colors';

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
