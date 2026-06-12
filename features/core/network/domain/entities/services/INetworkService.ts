import type { Result } from '@/features/core/error';

export interface INetworkService {
  isConnected(): Promise<Result<boolean>>;
}
