import styled from 'styled-components';
import { PAYMENT_METHOD_OPTIONS, type PaymentMethod } from '../types/sale.types';

const Grid = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Option = styled.button<{ $active: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : theme.colors.surface)};
  text-align: left;

  &:hover {
    border-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.borderStrong)};
  }
`;

const RadioDot = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.borderStrong)};
  flex-shrink: 0;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  }
`;

const Label = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textPrimary)};
`;

interface PaymentMethodSelectorProps {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <Grid role="radiogroup" aria-label="Payment method">
      {PAYMENT_METHOD_OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <Option
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            $active={isActive}
            onClick={() => onChange(option.value)}
          >
            <RadioDot $active={isActive} />
            <Label $active={isActive}>{option.label}</Label>
          </Option>
        );
      })}
    </Grid>
  );
}
