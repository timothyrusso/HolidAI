import '@/features/core/http/di/config';

import { container } from '@/features/core/container';
import { HTTP_TYPES } from '@/features/core/http/di/types';
import type { IHttpClient } from '@/features/core/http/domain/entities/services/IHttpClient';

export const httpClient = container.get<IHttpClient>(HTTP_TYPES.HttpClient);
