import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import * as authService from '../api/auth.service';
import type {
  AuthState,
  ConfirmPasswordResetParams,
  ConfirmSignupParams,
  LoginCredentials,
  SignupCredentials,
} from '../types/auth.types';

const initialState: AuthState = {
  status: 'initializing',
  user: null,
  error: null,
  isSubmitting: false,
};

// Runs once at app startup to restore an existing Cognito session, so the
// router doesn't redirect to /login before we actually know the answer.
export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  return authService.getAuthenticatedUser();
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { rejectWithValue }) => {
    try {
      await authService.signup(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed');
    }
  }
);

export const confirmSignup = createAsyncThunk(
  'auth/confirmSignup',
  async (params: ConfirmSignupParams, { rejectWithValue }) => {
    try {
      await authService.confirmSignup(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Verification failed');
    }
  }
);

export const resendConfirmationCode = createAsyncThunk(
  'auth/resendConfirmationCode',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.resendConfirmationCode(email);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Could not resend code');
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.requestPasswordReset(email);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Could not send reset code');
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (params: ConfirmPasswordResetParams, { rejectWithValue }) => {
    try {
      await authService.confirmPasswordReset(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Could not reset password');
    }
  }
);

// Signs out of Cognito, then dispatches the shared `resetApplicationState`
// action so every feature slice (business, inventory, and this one) clears
// its data in one place (spec section 10 - Sign Out).
export const signOut = createAsyncThunk('auth/signOut', async (_: void, { dispatch }) => {
  authService.signOut();
  dispatch(resetApplicationState());
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialization
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'initializing';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Login failed';
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Signup failed';
      })
      // Confirm signup
      .addCase(confirmSignup.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(confirmSignup.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(confirmSignup.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Verification failed';
      })
      // Resend code
      .addCase(resendConfirmationCode.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(resendConfirmationCode.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(resendConfirmationCode.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Could not resend code';
      })
      // Request password reset (send code)
      .addCase(requestPasswordReset.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Could not send reset code';
      })
      // Confirm password reset (code + new password)
      .addCase(confirmPasswordReset.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = (action.payload as string) ?? 'Could not reset password';
      })
      // Sign out: go straight to "unauthenticated" (not "initializing") so
      // route guards redirect immediately without re-checking the session.
      .addCase(resetApplicationState, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = null;
        state.isSubmitting = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
