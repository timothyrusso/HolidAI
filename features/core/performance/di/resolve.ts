import '@/features/core/performance/di/config';

import { container } from '@/di/container';
import { PERFORMANCE_TYPES } from '@/features/core/performance/di/types';
import type { IPerformanceTracker } from '@/features/core/performance/domain/entities/services/IPerformanceTracker';

export const performanceTracker = container.get<IPerformanceTracker>(PERFORMANCE_TYPES.PerformanceTracker);
