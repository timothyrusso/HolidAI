import { useTranslation } from 'react-i18next';
import { colors } from '../constants/style/colors';
import { BudgetData } from '../pages/create-trip/SelectBudgetPage/SelectBudgetPage.data';

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
