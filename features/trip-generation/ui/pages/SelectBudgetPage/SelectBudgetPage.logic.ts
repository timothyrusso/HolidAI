import { navigationService } from '@/features/core/navigation';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { BudgetData } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.data';
import { useTranslation } from 'react-i18next';

export const useSelectBudgetPageLogic = () => {
  const { tripActions, tripSelectors } = useTripGenerationState();
  const { t } = useTranslation();

  const budgetInfo = tripSelectors.budgetInfo();
  const selectedBudget = Math.max(
    0,
    BudgetData.findIndex(item => t(item.title) === budgetInfo),
  );

  const handleCardPress = (id: number) => {
    tripActions.setBudgetInfo(t(BudgetData[id].title));
  };

  const handleButtonPress = () => navigationService.toReviewTrip();

  return {
    selectedBudget,
    handleCardPress,
    handleButtonPress,
  };
};
