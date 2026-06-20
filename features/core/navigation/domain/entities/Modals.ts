export const Modals = {
  TypicalDishes: 'typical-dishes-modal',
  DishDetails: 'dish-details-modal',
  AccountSettings: 'account-settings-modal',
} as const;

export type Modals = (typeof Modals)[keyof typeof Modals];
