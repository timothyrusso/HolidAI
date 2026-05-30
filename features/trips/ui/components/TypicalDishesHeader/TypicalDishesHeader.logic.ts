import { useTranslation } from 'react-i18next';

export const useTypicalDishesHeaderLogic = (location: string, dishNumber: number) => {
  const { t } = useTranslation();
  const dishLabel = t('MY_TRIP.DISHES', { count: dishNumber });

  return { location, dishLabel };
};
