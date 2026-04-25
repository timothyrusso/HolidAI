import { TravelerOptions } from '@/features/trip-generation/domain/entities/TravelerOptions';
import { icons } from '@/ui/style/icons';

const travelerIcons = [icons.airplane, icons.heartOutline, icons.home, icons.boat];

export const TravelerData = TravelerOptions.map((opt, i) => ({
  ...opt,
  icon: travelerIcons[i],
}));
