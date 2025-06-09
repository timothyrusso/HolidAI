import type { TravelerInfoMap } from '@/modules/trip/domain/entities/TravelerInfoMap';
import { icons } from '@/ui/constants/style/icons';

export const TravelerData: TravelerInfoMap[] = [
  {
    id: 0,
    title: 'SELECT_TRAVELERS.SINGLE',
    icon: icons.airplane,
  },
  {
    id: 1,
    title: 'SELECT_TRAVELERS.COUPLE',
    icon: icons.heartOutline,
  },
  {
    id: 2,
    title: 'SELECT_TRAVELERS.FAMILY',
    icon: icons.home,
  },
  {
    id: 3,
    title: 'SELECT_TRAVELERS.FRIENDS',
    icon: icons.boat,
  },
];
