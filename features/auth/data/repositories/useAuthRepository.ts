import { AuthError } from '@/features/auth/domain/entities/errors/AuthError';
import type { IAuthRepository } from '@/features/auth/domain/entities/repositories/IAuthRepository';
import { ErrorCode, ensureError, fail, ok } from '@/features/core/error';
import { useClerk, useSignIn, useSignUp } from '@clerk/clerk-expo';

export const useAuthRepository = (): IAuthRepository => {
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { signOut } = useClerk();

  return {
    signIn: async (email, password) => {
      if (!signInLoaded) return fail(new AuthError(ErrorCode.AuthSignInFailed));
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

    signUp: async (email, password, fullName) => {
      if (!signUpLoaded) return fail(new AuthError(ErrorCode.AuthSignUpFailed));
      try {
        await signUp.create({ emailAddress: email, password, firstName: fullName });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        return ok(undefined);
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthSignUpFailed, ensureError(err)));
      }
    },

    verifyEmail: async code => {
      if (!signUpLoaded) return fail(new AuthError(ErrorCode.AuthVerificationFailed));
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
      if (!signInLoaded) return fail(new AuthError(ErrorCode.AuthPasswordResetFailed));
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
      if (!signInLoaded) return fail(new AuthError(ErrorCode.AuthPasswordResetFailed));
      try {
        const attempt = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code,
          password: newPassword,
        });
        if (attempt.status === 'complete') {
          await signOut();
          return ok(undefined);
        }
        return fail(new AuthError(ErrorCode.AuthPasswordResetFailed));
      } catch (err) {
        return fail(new AuthError(ErrorCode.AuthPasswordResetFailed, ensureError(err)));
      }
    },
  };
};
