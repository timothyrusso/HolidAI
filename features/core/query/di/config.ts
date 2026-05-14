import { QueryClient } from '@tanstack/react-query';
import { ContainerModule } from 'inversify';

import { container } from '@/features/core/container';
import { QUERY_TYPES } from '@/features/core/query/di/types';

const queryModule = new ContainerModule(({ bind }) => {
  bind<QueryClient>(QUERY_TYPES.QueryClient).toConstantValue(new QueryClient());
});

container.load(queryModule);
