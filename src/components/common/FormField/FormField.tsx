import type { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.5)};
  width: 100%;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  /** Optional right-aligned link/action next to the label, e.g. "Forgot password?". */
  labelAction?: ReactNode;
}

export function FormField({ label, htmlFor, error, children, labelAction }: FormFieldProps) {
  return (
    <Wrapper>
      <LabelRow>
        <Label htmlFor={htmlFor}>{label}</Label>
        {labelAction}
      </LabelRow>
      {children}
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Wrapper>
  );
}
