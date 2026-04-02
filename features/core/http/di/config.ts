import 'reflect-metadata';

import { HttpClient } from '@/features/core/http/data/services/HttpClient';
import { HTTP_TYPES } from '@/features/core/http/di/types';
import type { IHttpClient } from '@/features/core/http/domain/entities/services/IHttpClient';
import { container } from 'tsyringe';

container.registerSingleton<IHttpClient>(HTTP_TYPES.HttpClient, HttpClient);
