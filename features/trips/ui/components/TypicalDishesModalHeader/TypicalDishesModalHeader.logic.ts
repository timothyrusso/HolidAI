import { useTranslation } from 'react-i18next';

export const useTypicalDishesModalHeaderLogic = (dishNumber: number) => {
  const { t } = useTranslation();
  const dishLabel = t('MY_TRIP.DISHES', { count: dishNumber });

  return { dishLabel };
};
