export interface AuthUser {
  id: string;
  email: string;
  fullName:string;
}

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  /** True while a login/signup/verification request is in flight. */
  isSubmitting: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  fullName:string
  email: string;
  password: string;
}

export interface ConfirmSignupParams {
  email: string;
  code: string;
}

export interface ConfirmPasswordResetParams {
  email: string;
  code: string;
  newPassword: string;
}
