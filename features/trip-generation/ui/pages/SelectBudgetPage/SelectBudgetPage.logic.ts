import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { navigationService } from '@/features/core/navigation';
import { useTripGenerationState } from '@/features/trip-generation/state/useTripGenerationState';
import { BudgetData } from '@/features/trip-generation/ui/pages/SelectBudgetPage/SelectBudgetPage.data';

export const useSelectBudgetPageLogic = () => {
  const { tripActions } = useTripGenerationState();
  const { t } = useTranslation();

  const [selectedBudget, setSelectedBudget] = useState<number>(0);

  const handleCardPress = (id: number) => {
    setSelectedBudget(id);
    tripActions.setBudgetInfo(t(BudgetData[id].title));
  };

  const handleButtonPress = () => {
    tripActions.setBudgetInfo(t(BudgetData[selectedBudget].title));
    navigationService.toReviewTrip();
  };

  const options = BudgetData.map(option => ({ ...option, onPress: () => handleCardPress(option.id) }));

  return {
    state: {
      selectedBudget,
    },
    derived: {
      options,
    },
    effects: {
      handleButtonPress,
    },
  };
};
