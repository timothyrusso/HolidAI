import type { Result } from '@/features/core/error';

export interface IProfileRepository {
  getUser(): { id: string | undefined; firstName: string | null | undefined; email: string | undefined } | undefined;
  signOut(): Promise<Result<void>>;
  deleteUser(): Promise<Result<void>>;
  deleteAllTrips(userId: string): Promise<Result<void>>;
}
