import * as cognitoService from '../../../services/cognito/cognito.service';
import { AUTH_ERROR_MESSAGES } from '../auth.constants';
import type {
  AuthUser,
  ConfirmPasswordResetParams,
  ConfirmSignupParams,
  LoginCredentials,
  SignupCredentials,
} from '../types/auth.types';

function toMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  try {
    await cognitoService.signIn(credentials.email, credentials.password);
  } catch (error) {
    throw new Error(toMessage(error, AUTH_ERROR_MESSAGES.genericLoginFailure));
  }

  const user = await cognitoService.getAuthenticatedUser();
  if (!user) {
    throw new Error(AUTH_ERROR_MESSAGES.genericLoginFailure);
  }
  return user;
}

export async function signup(credentials: SignupCredentials): Promise<void> {
  try {
    await cognitoService.signUp({ fullName: credentials.fullName, email: credentials.email, password: credentials.password });
  } catch (error) {
    throw new Error(toMessage(error, AUTH_ERROR_MESSAGES.genericSignupFailure));
  }
}

export async function confirmSignup(params: ConfirmSignupParams): Promise<void> {
  try {
    await cognitoService.confirmSignUp(params.email, params.code);
  } catch (error) {
    throw new Error(toMessage(error, AUTH_ERROR_MESSAGES.genericVerificationFailure));
  }
}

export async function resendConfirmationCode(email: string): Promise<void> {
  try {
    await cognitoService.resendConfirmationCode(email);
  } catch (error) {
    throw new Error(toMessage(error, 'Could not resend the code. Please try again.'));
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await cognitoService.forgotPassword(email);
  } catch (error) {
    throw new Error(toMessage(error, AUTH_ERROR_MESSAGES.genericForgotPasswordFailure));
  }
}

export async function confirmPasswordReset(params: ConfirmPasswordResetParams): Promise<void> {
  try {
    await cognitoService.confirmForgotPassword(params.email, params.code, params.newPassword);
  } catch (error) {
    throw new Error(toMessage(error, AUTH_ERROR_MESSAGES.genericResetPasswordFailure));
  }
}

export function signOut(): void {
  cognitoService.signOut();
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  return cognitoService.getAuthenticatedUser();
}
