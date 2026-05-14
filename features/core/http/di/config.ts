import { ContainerModule } from 'inversify';

import { container } from '@/di/container';
import { HttpClient } from '@/features/core/http/data/services/HttpClient';
import { HTTP_TYPES } from '@/features/core/http/di/types';
import type { IHttpClient } from '@/features/core/http/domain/entities/services/IHttpClient';

const httpModule = new ContainerModule(({ bind }) => {
  bind<IHttpClient>(HTTP_TYPES.HttpClient).to(HttpClient).inSingletonScope();
});

container.load(httpModule);
