import 'reflect-metadata';

import '@/features/core/navigation/di/config';
import { NAVIGATION_TYPES } from '@/features/core/navigation/di/types';
import type { INavigationService } from '@/features/core/navigation/domain/entities/services/INavigationService';
import { container } from 'tsyringe';

export const navigationService = container.resolve<INavigationService>(NAVIGATION_TYPES.NavigationService);
