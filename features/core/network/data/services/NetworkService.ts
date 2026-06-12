import type { Result } from '@/features/core/error';
import { BaseError, ErrorCode, ensureError, fail, ok } from '@/features/core/error';
import type { INetworkService } from '@/features/core/network/domain/entities/services/INetworkService';
import * as Network from 'expo-network';
import { injectable } from 'inversify';

@injectable()
export class NetworkService implements INetworkService {
  async isConnected(): Promise<Result<boolean>> {
    try {
      const state = await Network.getNetworkStateAsync();
      return ok(state.isConnected === true);
    } catch (err) {
      return fail(new BaseError('Failed to read network state', ErrorCode.NetworkFailure, { cause: ensureError(err) }));
    }
  }
}
