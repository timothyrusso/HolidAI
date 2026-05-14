import '@/features/core/query/di/config';

import type { QueryClient } from '@tanstack/react-query';

import { container } from '@/features/core/container';
import { QUERY_TYPES } from '@/features/core/query/di/types';

export const queryClient = container.get<QueryClient>(QUERY_TYPES.QueryClient);
