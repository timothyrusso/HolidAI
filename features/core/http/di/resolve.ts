import 'reflect-metadata';

import '@/features/core/http/di/config';
import { HTTP_TYPES } from '@/features/core/http/di/types';
import type { IHttpClient } from '@/features/core/http/domain/entities/services/IHttpClient';
import { container } from 'tsyringe';

export const httpClient = container.resolve<IHttpClient>(HTTP_TYPES.HttpClient);
