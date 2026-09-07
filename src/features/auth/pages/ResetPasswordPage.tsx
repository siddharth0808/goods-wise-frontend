import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, PageContainer } from '../../../components/common/PageContainer';
import { Button } from '../../../components/common/Button';
import { PasswordInput } from '../../../components/common/PasswordInput';
import { FormField } from '../../../components/common/FormField';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearAuthError, confirmPasswordReset, requestPasswordReset } from '../store/authSlice';
import { CodeInput } from '../components/CodeInput';
import { isRequired, validateFields } from '../../../utils/validation';
import {
  Actions,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  AuthTitleBlock,
  FormError,
  InlineLink,
  LinksRow,
} from '../components/AuthCard.styles';

const IconBadge = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const FieldStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  width: 100%;
`;

const Hint = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const ResendSuccess = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

interface LocationState {
  email?: string;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as LocationState | null)?.email ?? '';

  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);
  const authError = useAppSelector((state) => state.auth.error);

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const [values, setValues] = useState<FormValues>({ newPassword: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [resendState, setResendState] = useState<'idle' | 'loading' | 'sent'>('idle');

  const handleCodeChange = (value: string) => {
    setCode(value);
    setCodeError(undefined);
    if (authError) dispatch(clearAuthError());
  };

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    if (authError) dispatch(clearAuthError());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (code.length !== 6) {
      setCodeError('Enter the full 6-digit code.');
      return;
    }

    const errors = validateFields(values, {
      newPassword: (value) => {
        if (!isRequired(value)) return 'New Password is required.';
        if (value.length < 8) return 'Password must be at least 8 characters.';
        return undefined;
      },
      confirmPassword: (value, allValues) => {
        if (!isRequired(value)) return 'Confirm Password is required.';
        if (value !== allValues.newPassword) return 'Passwords do not match.';
        return undefined;
      },
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isSubmitting) return;

    const result = await dispatch(confirmPasswordReset({ email, code, newPassword: values.newPassword }));
    if (confirmPasswordReset.fulfilled.match(result)) {
      navigate('/login', {
        replace: true,
        state: { notice: 'Password reset successful. Please log in with your new password.' },
      });
    }
  };

  const handleResend = async () => {
    setResendState('loading');
    const result = await dispatch(requestPasswordReset(email));
    setResendState(requestPasswordReset.fulfilled.match(result) ? 'sent' : 'idle');
  };

  return (
    <PageContainer>
      <Card as="form" onSubmit={handleSubmit} noValidate>
        <AuthHeader>
          <IconBadge>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconBadge>
          <AuthTitleBlock>
            <AuthTitle>Reset your password</AuthTitle>
            <AuthSubtitle>
              {email ? `Enter the code we sent to ${email}` : 'Enter the code we sent to your email'}
            </AuthSubtitle>
          </AuthTitleBlock>
        </AuthHeader>

        {authError && <FormError role="alert">{authError}</FormError>}

        <div>
          <CodeInput value={code} onChange={handleCodeChange} disabled={isSubmitting} />
          {codeError && (
            <Hint role="alert" style={{ color: '#dc2626', marginTop: 8 }}>
              {codeError}
            </Hint>
          )}
        </div>

        <FieldStack>
          <FormField label="New Password" htmlFor="newPassword" error={fieldErrors.newPassword}>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.newPassword}
              onChange={handleChange('newPassword')}
              hasError={!!fieldErrors.newPassword}
            />
          </FormField>
          <FormField label="Confirm New Password" htmlFor="confirmPassword" error={fieldErrors.confirmPassword}>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              hasError={!!fieldErrors.confirmPassword}
            />
          </FormField>
        </FieldStack>

        <Actions>
          <Button type="submit" $fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Resetting…' : 'Reset Password'}
          </Button>
          {resendState === 'sent' ? (
            <ResendSuccess>A new code has been sent.</ResendSuccess>
          ) : (
            <LinksRow>
              <span>Didn&apos;t receive a code?</span>
              <InlineLink type="button" onClick={handleResend} disabled={resendState === 'loading'}>
                {resendState === 'loading' ? 'Resending…' : 'Resend code'}
              </InlineLink>
            </LinksRow>
          )}
        </Actions>
      </Card>
    </PageContainer>
  );
}
