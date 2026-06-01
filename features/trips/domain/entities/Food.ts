import type { TypicalDish } from '@/features/trips/domain/entities/TypicalDish';

export interface Food {
  foodGeneralNotes: string;
  foodBudgetNotes: string;
  typicalDishes: TypicalDish[];
}
