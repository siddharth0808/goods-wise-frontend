export const AUTH_ROUTES = {
  login: '/login',
  signup: '/signup',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const;

export const AUTH_ERROR_MESSAGES = {
  genericLoginFailure: 'Invalid email or password. Please try again.',
  genericSignupFailure: 'We could not create your account. Please try again.',
  genericVerificationFailure: 'That code is invalid or has expired. Please try again.',
  genericForgotPasswordFailure: 'We could not send a reset code. Please try again.',
  genericResetPasswordFailure: 'That code is invalid or has expired. Please try again.',
  sessionExpired: 'Your session has expired. Please sign in again.',
} as const;
