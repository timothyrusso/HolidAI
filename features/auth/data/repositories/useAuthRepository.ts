import { AuthError } from '@/features/auth/domain/entities/errors/AuthError';
import type { IAuthRepository } from '@/features/auth/domain/entities/repositories/IAuthRepository';
import { BaseError, ErrorCode, ensureError, fail, ok } from '@/features/core/error';
import { useClerk, useSignIn, useSignUp } from '@clerk/clerk-expo';

export const useAuthRepository = (): IAuthRepository => {
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { signOut } = useClerk();

  return {
    signIn: async (email, password) => {
      if (!signInLoaded) return fail(new BaseError('Clerk not loaded', ErrorCode.NetworkFailure));
      try {
        const attempt = await signIn.create({ identifier: email, password });
        if (attempt.status === 'complete') {
          await setActiveSignIn({ session: attempt.createdSessionId });
          return ok(undefined);
        }
        return fail(new AuthError(ErrorCode.AuthSignInFailed));
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthSignInFailed, ensureError(err)));
      }
    },

    signUp: async (email, password, name) => {
      if (!signUpLoaded) return fail(new BaseError('Clerk not loaded', ErrorCode.NetworkFailure));
      try {
        await signUp.create({ emailAddress: email, password, firstName: name });
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthSignUpFailed, ensureError(err)));
      }
      try {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        return ok(undefined);
      } catch (err) {
        return fail(
          new BaseError('Failed to send verification email', ErrorCode.NetworkFailure, { cause: ensureError(err) }),
        );
      }
    },

    verifyEmail: async code => {
      if (!signUpLoaded) return fail(new BaseError('Clerk not loaded', ErrorCode.NetworkFailure));
      try {
        const attempt = await signUp.attemptEmailAddressVerification({ code });
        if (attempt.status === 'complete') {
          await setActiveSignUp({ session: attempt.createdSessionId });
          return ok(undefined);
        }
        return fail(new AuthError(ErrorCode.AuthVerificationFailed));
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthVerificationFailed, ensureError(err)));
      }
    },

    sendPasswordResetCode: async email => {
      if (!signInLoaded) return fail(new BaseError('Clerk not loaded', ErrorCode.NetworkFailure));
      try {
        await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: email,
        });
        return ok(undefined);
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthPasswordResetFailed, ensureError(err)));
      }
    },

    resetPassword: async (code, newPassword) => {
      if (!signInLoaded) return fail(new BaseError('Clerk not loaded', ErrorCode.NetworkFailure));
      try {
        const attempt = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password: newPassword,
        });
        if (attempt.status === 'complete') {
          try {
            await signOut();
          } catch {
            /*TODO: best-effort cleanup — password already reset */
          }
          return ok(undefined);
        }
        return fail(new AuthError(ErrorCode.AuthPasswordResetFailed));
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthPasswordResetFailed, ensureError(err)));
      }
    },
  };
};
