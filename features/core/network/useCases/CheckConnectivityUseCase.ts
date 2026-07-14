import { inject, injectable } from 'inversify';
import type { ILogger, Result } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error';
import { NETWORK_TYPES } from '@/features/core/network/di/types';
import type { INetworkService } from '@/features/core/network/domain/entities/services/INetworkService';

@injectable()
export class CheckConnectivityUseCase {
  constructor(
    @inject(NETWORK_TYPES.NetworkService) private readonly networkService: INetworkService,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  /**
   * Checks whether the device currently has an active internet connection.
   * @returns A `Result` with `true` if connected, `false` if not; failure is logged and returned when the network state cannot be read.
   */
  async execute(): Promise<Result<boolean>> {
    const result = await this.networkService.isConnected();
    if (!result.success) this.logger.error(result.error);
    return result;
  }
}
