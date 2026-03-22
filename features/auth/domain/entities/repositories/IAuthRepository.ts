import type { Result } from '@/features/core/error';

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<Result<void>>;
  signUp(email: string, password: string, fullName: string): Promise<Result<void>>;
  verifyEmail(code: string): Promise<Result<void>>;
  sendPasswordResetCode(email: string): Promise<Result<void>>;
  resetPassword(code: string, newPassword: string): Promise<Result<void>>;
}
