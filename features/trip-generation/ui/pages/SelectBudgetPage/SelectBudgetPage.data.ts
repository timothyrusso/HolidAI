import { BudgetOptions } from '@/features/trip-generation/domain/entities/BudgetOptions';
import { icons } from '@/ui/style/icons';

const budgetIcons = [icons.cash, icons.bag, icons.card, icons.diamond];

export const BudgetData = BudgetOptions.map((opt, i) => ({
  ...opt,
  icon: budgetIcons[i],
}));
