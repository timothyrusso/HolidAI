import { QueryClient } from '@tanstack/react-query';
import { ContainerModule } from 'inversify';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';

const queryModule = new ContainerModule(({ bind }) => {
  bind<QueryClient>(TYPES.QUERY).toConstantValue(new QueryClient());
});

container.load(queryModule);
