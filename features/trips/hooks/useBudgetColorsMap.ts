import { colors } from '@/features/core/ui';
import { BudgetOptions } from '@/features/trips/domain/entities/BudgetOptions';
import { useTranslation } from 'react-i18next';

export const useBudgetColorsMap = () => {
  const { t } = useTranslation();

  const budgetColorsMap = {
    [t(BudgetOptions[0].title)]: colors.primaryGreen,
    [t(BudgetOptions[1].title)]: colors.primaryBlue,
    [t(BudgetOptions[2].title)]: colors.secondaryPink,
    [t(BudgetOptions[3].title)]: colors.secondaryYellow,
  };

  return { budgetColorsMap };
};
