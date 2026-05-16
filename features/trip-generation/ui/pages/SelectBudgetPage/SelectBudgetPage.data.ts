import { icons } from '@/features/core/ui';
import { BudgetOptions } from '@/features/trips';

const budgetIcons = [icons.cash, icons.bag, icons.card, icons.diamond];

export const BudgetData = BudgetOptions.map((opt, i) => ({
  ...opt,
  icon: budgetIcons[i],
}));
