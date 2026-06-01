import type { Result } from '@/features/core/error';

export interface IUserRepository {
  getUser():
    | { id: string; username: string | null; email: string | undefined; profileImageUrl: string | undefined }
    | undefined;
  signOut(): Promise<Result<void>>;
  deleteUser(): Promise<Result<void>>;
}
