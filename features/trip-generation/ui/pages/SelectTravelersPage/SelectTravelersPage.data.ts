import { icons } from '@/features/core/ui';
import { TravelerOptions } from '@/features/trip-generation/domain/entities/TravelerOptions';

const travelerIcons = [icons.airplane, icons.heartOutline, icons.home, icons.boat];

export const TravelerData = TravelerOptions.map((opt, i) => ({
  ...opt,
  icon: travelerIcons[i],
}));
