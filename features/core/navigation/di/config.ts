import 'reflect-metadata';
import { NavigationService } from '@/features/core/navigation/data/services/NavigationService';
import { routerClient } from '@/features/core/navigation/di/factories/routerClient';
import { NAVIGATION_TYPES } from '@/features/core/navigation/di/types';
import type { INavigationService } from '@/features/core/navigation/domain/entities/services/INavigationService';
import type { IRouterClient } from '@/features/core/navigation/domain/entities/services/IRouterClient';
import { container } from 'tsyringe';

container.registerInstance<IRouterClient>(NAVIGATION_TYPES.RouterClient, routerClient);
container.registerSingleton<INavigationService>(NAVIGATION_TYPES.NavigationService, NavigationService);
