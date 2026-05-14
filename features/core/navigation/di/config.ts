import { ContainerModule } from 'inversify';

import { container } from '@/di/container';
import { NavigationService } from '@/features/core/navigation/data/services/NavigationService';
import { routerClient } from '@/features/core/navigation/di/factories/routerClient';
import { NAVIGATION_TYPES } from '@/features/core/navigation/di/types';
import type { INavigationService } from '@/features/core/navigation/domain/entities/services/INavigationService';
import type { IRouterClient } from '@/features/core/navigation/domain/entities/services/IRouterClient';

const navigationModule = new ContainerModule(({ bind }) => {
  bind<IRouterClient>(NAVIGATION_TYPES.RouterClient).toConstantValue(routerClient);
  bind<INavigationService>(NAVIGATION_TYPES.NavigationService).to(NavigationService).inSingletonScope();
});

container.load(navigationModule);
