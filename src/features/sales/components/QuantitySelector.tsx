import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

const StepButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.font.size.md};
  line-height: 1;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 36px;
  height: 28px;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.surface};
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
  }
`;

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, maxQuantity, onIncrement, onDecrement, onChange }: QuantitySelectorProps) {
  return (
    <Wrapper>
      <StepButton type="button" onClick={onDecrement} disabled={quantity <= 1} aria-label="Decrease quantity">
        −
      </StepButton>
      <QuantityInput
        type="number"
        inputMode="numeric"
        min={1}
        max={maxQuantity}
        value={quantity}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (Number.isFinite(parsed)) onChange(parsed);
        }}
        aria-label="Quantity"
      />
      <StepButton
        type="button"
        onClick={onIncrement}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        +
      </StepButton>
    </Wrapper>
  );
}
