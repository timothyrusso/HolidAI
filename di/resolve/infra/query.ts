import type { QueryClient } from '@tanstack/react-query';

import { container } from '@/di/config';
import { TYPES } from '@/di/types';

export const queryClient = container.resolve<QueryClient>(TYPES.QUERY);
