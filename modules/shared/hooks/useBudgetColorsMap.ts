import { colors } from '@/ui/style/colors';
import { useTranslation } from 'react-i18next';
import { BudgetData } from '../../trips/ui/pages/SelectBudgetPage/SelectBudgetPage.data';

export const useBudgetColorsMap = () => {
  const { t } = useTranslation();

  const budgetColorsMap = {
    [t(BudgetData[0].title)]: colors.primaryGreen,
    [t(BudgetData[1].title)]: colors.primaryBlue,
    [t(BudgetData[2].title)]: colors.secondaryPink,
    [t(BudgetData[3].title)]: colors.primary,
  };

  return {
    budgetColorsMap,
  };
};
