import type { BudgetInfo } from '@/modules/trips/domain/entities/BudgetInfo';
import { icons } from '@/ui/style/icons';

export const BudgetData: BudgetInfo[] = [
  {
    id: 0,
    title: 'SELECT_BUDGET.BASIC',
    icon: icons.cash,
  },
  {
    id: 1,
    title: 'SELECT_BUDGET.CHEAP',
    icon: icons.bag,
  },
  {
    id: 2,
    title: 'SELECT_BUDGET.MODERATE',
    icon: icons.card,
  },
  {
    id: 3,
    title: 'SELECT_BUDGET.LUXURY',
    icon: icons.diamond,
  },
];
