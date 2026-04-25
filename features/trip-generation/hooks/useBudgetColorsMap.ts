import { BudgetOptions } from '@/features/trip-generation/domain/entities/BudgetOptions';
import { colors } from '@/ui/style/colors';
import { useTranslation } from 'react-i18next';

export const useBudgetColorsMap = () => {
  const { t } = useTranslation();

  const budgetColorsMap = {
    [t(BudgetOptions[0].title)]: colors.primaryGreen,
    [t(BudgetOptions[1].title)]: colors.primaryBlue,
    [t(BudgetOptions[2].title)]: colors.secondaryPink,
    [t(BudgetOptions[3].title)]: colors.primary,
  };

  return { budgetColorsMap };
};
