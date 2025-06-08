import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useTripState } from '@/ui/state/trip';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BudgetData } from './SelectBudgetPage.data';

export const useSelectBudgetPageLogic = () => {
  const router = useRouter();
  const { tripActions } = useTripState();
  const { t } = useTranslation();

  const [selectedBudget, setSelectedBudget] = useState<number>(0);

  const handleCardPress = (id: number) => {
    setSelectedBudget(id);
    tripActions.setBudgetInfo(t(BudgetData[id].title));
  };

  const handleButtonPress = () => router.push(`/${Stacks.CreateTrip}/${Routes.ReviewTrip}`);

  return {
    selectedBudget,
    handleCardPress,
    handleButtonPress,
  };
};
