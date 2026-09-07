import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  type CognitoUserSession,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import { cognitoConfig } from "../../config/cognito.config";
import type { CognitoAuthUser, CognitoSignUpParams } from "./cognito.types";

// This is the ONLY module that talks to the Cognito SDK directly. Every
// other layer (auth.service, authSlice, page components) goes through the
// functions exported here, so Cognito could be swapped for another
// authentication provider without touching UI code.
const userPool = new CognitoUserPool(cognitoConfig);

function getCurrentCognitoUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}

function getSession(user: CognitoUser): Promise<CognitoUserSession | null> {
  return new Promise((resolve, reject) => {
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) return reject(err);
      resolve(session);
    });
  });
}

export function signUp(params: CognitoSignUpParams): Promise<void> {
  const attributes = [
    new CognitoUserAttribute({
      Name: "given_name",
      Value: params.fullName,
    }),
  ];
  return new Promise((resolve, reject) => {
    userPool.signUp(params.email, params.password, attributes, [], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function resendConfirmationCode(email: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.resendConfirmationCode((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function signIn(email: string, password: string): Promise<CognitoUserSession> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut(): void {
  getCurrentCognitoUser()?.signOut();
}

// Step 1 of the Forgot Password flow: asks Cognito to email a verification
// code to the account. Cognito's SDK intentionally succeeds even for
// unknown emails (to avoid leaking which addresses have accounts), so the
// UI should show the same "check your email" message regardless.
export function forgotPassword(email: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.forgotPassword({
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

// Step 2: submits the emailed code plus a new password.
export function confirmForgotPassword(email: string, code: string, newPassword: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: (err) => reject(err),
    });
  });
}

// Returns the current, still-valid session (refreshing silently if the
// access token expired but the refresh token is still good), or null if
// there is no authenticated user. Used at app startup to restore sessions.
export async function getCurrentSession(): Promise<CognitoUserSession | null> {
  const user = getCurrentCognitoUser();
  if (!user) return null;

  try {
    const session = await getSession(user);
    if (!session || !session.isValid()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getIdToken(): Promise<string | null> {
  const session = await getCurrentSession();
  return session ? session.getIdToken().getJwtToken() : null;
}

export async function getAuthenticatedUser(): Promise<CognitoAuthUser | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const payload = session.getIdToken().payload as {
    sub: string;
    email?: string;
    given_name?:string
  };
  return {
    id: payload.sub,
    email: payload.email ?? "",
    fullName: payload.given_name ?? ""
  };
}
