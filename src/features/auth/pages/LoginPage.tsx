import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, PageContainer } from '../../../components/common/PageContainer';
import { Logo } from '../../../components/layout/Logo';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { PasswordInput } from '../../../components/common/PasswordInput';
import { FormField } from '../../../components/common/FormField';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearAuthError, login } from '../store/authSlice';
import { isRequired, isValidEmail, validateFields } from '../../../utils/validation';
import {
  Actions,
  AuthHeader,
  AuthSubtitle,
  AuthTitle,
  AuthTitleBlock,
  Form,
  FormError,
  FormSuccess,
  InlineLink,
  LinksRow,
} from '../components/AuthCard.styles';

interface FormValues {
  email: string;
  password: string;
}

interface LocationState {
  notice?: string;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as LocationState | null)?.notice;

  const isSubmitting = useAppSelector((state) => state.auth.isSubmitting);
  const authError = useAppSelector((state) => state.auth.error);

  const [values, setValues] = useState<FormValues>({ email: '', password: '' });
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
      password: (value) => (!isRequired(value) ? 'Password is required.' : undefined),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (isSubmitting) return; // Prevent duplicate submissions.

    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      // AuthenticatedRoute/BusinessSetupRoute will settle the exact
      // destination once business status is fetched; go to a neutral
      // authenticated URL and let the guards redirect appropriately.
      navigate('/', { replace: true });
    }
  };

  return (
    <PageContainer>
      <Card as="form" onSubmit={handleSubmit} noValidate>
        <AuthHeader>
          <Logo />
          <AuthTitleBlock>
            <AuthTitle>Welcome back</AuthTitle>
            <AuthSubtitle>Sign in to manage your stock</AuthSubtitle>
          </AuthTitleBlock>
        </AuthHeader>

        {notice && !authError && <FormSuccess role="status">{notice}</FormSuccess>}
        {authError && <FormError role="alert">{authError}</FormError>}

        <Form as="div">
          <FormField label="Email Address" htmlFor="email" error={fieldErrors.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@inventorystack.co"
              value={values.email}
              onChange={handleChange('email')}
              $hasError={!!fieldErrors.email}
            />
          </FormField>
          <FormField
            label="Password"
            htmlFor="password"
            error={fieldErrors.password}
            labelAction={
              <InlineLink type="button" onClick={() => navigate('/forgot-password')}>
                Forgot password?
              </InlineLink>
            }
          >
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange('password')}
              hasError={!!fieldErrors.password}
            />
          </FormField>
        </Form>

        <Actions>
          <Button type="submit" $fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log In'}
          </Button>
          <LinksRow>
            <span>Don&apos;t have an account?</span>
            <InlineLink type="button" onClick={() => navigate('/signup')}>
              Sign Up
            </InlineLink>
          </LinksRow>
        </Actions>
      </Card>
    </PageContainer>
  );
}
