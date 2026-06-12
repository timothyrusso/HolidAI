import { container } from '@/features/core/container';
import '@/features/core/network/di/config';
import { NETWORK_TYPES } from '@/features/core/network/di/types';
import type { CheckConnectivityUseCase } from '@/features/core/network/useCases/CheckConnectivityUseCase';

export const checkConnectivityUseCase = container.get<CheckConnectivityUseCase>(NETWORK_TYPES.CheckConnectivityUseCase);
