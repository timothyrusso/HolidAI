import type { Result } from '@/features/core/error';

export interface IUserRepository {
  getUser(): { id: string; firstName: string | null; email: string | undefined } | undefined;
  signOut(): Promise<Result<void>>;
  deleteUser(): Promise<Result<void>>;
}
