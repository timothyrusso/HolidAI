import type { ViewStyle } from 'react-native';
import { match } from 'ts-pattern';

import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';

import { styles } from './CustomCard.style';

export const CardType = { Default: 'default', Secondary: 'secondary' } as const;
export type CardType = (typeof CardType)[keyof typeof CardType];

export type CustomCardStyle = {
  backgroundColor: ViewStyle['backgroundColor'];
  borderColor: ViewStyle['borderColor'];
  borderWidth: ViewStyle['borderWidth'];
};

export type CustomCardLogicProps = {
  cardType?: CardType;
  selected?: boolean;
};

export const useCustomCardLogic = ({ selected = false, cardType = CardType.Default }: CustomCardLogicProps) => {
  const cardStyle: CustomCardStyle = match({ cardType, selected })
    .with({ selected: true }, () => ({
      backgroundColor: colors.primaryBlack,
      borderColor: colors.primaryBlack,
      borderWidth: spacing.Zero,
    }))
    .with({ cardType: CardType.Default }, () => ({
      backgroundColor: colors.primaryWhite,
      borderColor: colors.primaryWhite,
      borderWidth: spacing.Zero,
    }))
    .with({ cardType: CardType.Secondary }, () => ({
      backgroundColor: colors.primaryWhite,
      borderColor: colors.primaryBlack,
      borderWidth: spacing.ThreeQuarterMinimal,
    }))
    .exhaustive();

  const componentStyle = styles(cardStyle);

  return {
    componentStyle,
  };
};
