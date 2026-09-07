import { useState } from 'react';
import styled from 'styled-components';
import type { Discount, DiscountType } from '../types/sale.types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const ToggleRow = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  width: fit-content;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  border: none;
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : theme.colors.surface)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.colors.primarySoft : theme.colors.background)};
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const Prefix = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing(3)};
  top: 50%;
  transform: translateY(-50%);
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AmountInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing(3)} 0 ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ApplyButton = styled.button`
  padding: 0 ${({ theme }) => theme.spacing(4)};
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface DiscountInputProps {
  discount: Discount | null;
  onApply: (discount: Discount | null) => void;
}

export function DiscountInput({ discount, onApply }: DiscountInputProps) {
  const [type, setType] = useState<DiscountType>(discount?.type ?? 'fixed');
  const [rawValue, setRawValue] = useState(discount ? String(discount.value) : '');

  const handleTypeChange = (nextType: DiscountType) => {
    setType(nextType);
    if (discount) onApply(null); // Changing the mode clears any already-applied discount.
  };

  const handleApply = () => {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      onApply(null);
      return;
    }
    const clamped = type === 'percentage' ? Math.min(parsed, 100) : parsed;
    onApply({ type, value: clamped });
  };

  const isApplied = !!discount && discount.type === type && String(discount.value) === rawValue;

  return (
    <Wrapper>
      <ToggleRow role="radiogroup" aria-label="Discount type">
        <ToggleButton type="button" $active={type === 'fixed'} onClick={() => handleTypeChange('fixed')}>
          Fixed Amount
        </ToggleButton>
        <ToggleButton type="button" $active={type === 'percentage'} onClick={() => handleTypeChange('percentage')}>
          Percentage
        </ToggleButton>
      </ToggleRow>
      <InputRow>
        <InputWrapper>
          <Prefix>{type === 'percentage' ? '%' : '₹'}</Prefix>
          <AmountInput
            type="number"
            min={0}
            max={type === 'percentage' ? 100 : undefined}
            placeholder="0"
            value={rawValue}
            onChange={(event) => setRawValue(event.target.value)}
            aria-label="Discount value"
          />
        </InputWrapper>
        <ApplyButton type="button" onClick={handleApply} disabled={isApplied || rawValue === ''}>
          {isApplied ? 'Applied' : 'Apply'}
        </ApplyButton>
      </InputRow>
    </Wrapper>
  );
}
