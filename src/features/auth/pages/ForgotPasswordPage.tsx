import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageContainer } from '../../../components/common/PageContainer';
import { Logo } from '../../../components/layout/Logo';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { FormField } from '../../../components/common/FormField';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearAuthError, requestPasswordReset } from '../store/authSlice';
import { isRequired, isValidEmail, validateFields } from '../../../utils/validation';
import {
  Actions,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  AuthTitleBlock,
  Form,
  FormError,
  InlineLink,
  LinksRow,
} from '../components/AuthCard.styles';

interface FormValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);
  const authError = useAppSelector((state) => state.auth.error);

  const [values, setValues] = useState<FormValues>({ email: '' });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    if (authError) dispatch(clearAuthError());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const errors = validateFields(values, {
      email: (value) => {
        if (!isRequired(value)) return 'Email is required.';
        if (!isValidEmail(value)) return 'Enter a valid email address.';
        return undefined;
      },
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isSubmitting) return;

    const result = await dispatch(requestPasswordReset(values.email));
    if (requestPasswordReset.fulfilled.match(result)) {
      // Pass the email via route state (never the URL/query string) so
      // ResetPasswordPage can display it and use it in the confirm call.
      navigate('/reset-password', { state: { email: values.email } });
    }
  };

  return (
    <PageContainer>
      <Card as="form" onSubmit={handleSubmit} noValidate>
        <AuthHeader>
          <Logo />
          <AuthTitleBlock>
            <AuthTitle>Forgot your password?</AuthTitle>
            <AuthSubtitle>Enter your email and we&apos;ll send you a reset code</AuthSubtitle>
          </AuthTitleBlock>
        </AuthHeader>

        {authError && <FormError role="alert">{authError}</FormError>}

        <Form as="div">
          <FormField label="Email Address" htmlFor="email" error={fieldErrors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@inventoryflow.co"
              value={values.email}
              onChange={handleChange('email')}
              $hasError={!!fieldErrors.email}
            />
          </FormField>
        </Form>

        <Actions>
          <Button type="submit" $fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Sending code…' : 'Send Reset Code'}
          </Button>
          <LinksRow>
            <span>Remembered your password?</span>
            <InlineLink type="button" onClick={() => navigate('/login')}>
              Log In
            </InlineLink>
          </LinksRow>
        </Actions>
      </Card>
    </PageContainer>
  );
}
