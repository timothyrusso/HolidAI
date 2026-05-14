import '@/di/config/infra/query';

import type { QueryClient } from '@tanstack/react-query';

import { container } from '@/di/container';
import { TYPES } from '@/di/types';

export const queryClient = container.get<QueryClient>(TYPES.QUERY);
