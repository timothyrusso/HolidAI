import '@/features/core/navigation/di/config';

import { container } from '@/features/core/container';
import { NAVIGATION_TYPES } from '@/features/core/navigation/di/types';
import type { INavigationService } from '@/features/core/navigation/domain/entities/services/INavigationService';

export const navigationService = container.get<INavigationService>(NAVIGATION_TYPES.NavigationService);
