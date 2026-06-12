import { container } from '@/features/core/container';
import { NetworkService } from '@/features/core/network/data/services/NetworkService';
import { NETWORK_TYPES } from '@/features/core/network/di/types';
import type { INetworkService } from '@/features/core/network/domain/entities/services/INetworkService';
import { CheckConnectivityUseCase } from '@/features/core/network/useCases/CheckConnectivityUseCase';
import { ContainerModule } from 'inversify';

const networkModule = new ContainerModule(({ bind }) => {
  bind<INetworkService>(NETWORK_TYPES.NetworkService).to(NetworkService).inSingletonScope();
  bind(NETWORK_TYPES.CheckConnectivityUseCase).to(CheckConnectivityUseCase).inSingletonScope();
});

container.load(networkModule);
