import 'reflect-metadata';
import '@/features/core/performance/di/config';

import { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
import type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';
import { container } from 'tsyringe';

export const performanceTracker = container.resolve<IPerformanceTracker>(PERFORMANCE_TYPES.PerformanceTracker);
