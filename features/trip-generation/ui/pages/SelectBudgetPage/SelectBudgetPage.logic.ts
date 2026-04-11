import { navigationService } from '@/features/core/navigation';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BudgetData } from './SelectBudgetPage.data';

export const useSelectBudgetPageLogic = () => {
  const { tripActions } = useTripGenerationState();
  const { t } = useTranslation();

  const [selectedBudget, setSelectedBudget] = useState<number>(0);

  const handleCardPress = (id: number) => {
    setSelectedBudget(id);
    tripActions.setBudgetInfo(t(BudgetData[id].title));
  };

  const handleButtonPress = () => navigationService.toReviewTrip();

  return {
    selectedBudget,
    handleCardPress,
    handleButtonPress,
  };
};
