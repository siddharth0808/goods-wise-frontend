import styled from 'styled-components';
import type { CartItem } from '../types/sale.types';
import { QuantitySelector } from './QuantitySelector';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Name = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UnitPrice = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StockWarning = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-shrink: 0;
`;

const LineTotal = styled.span`
  min-width: 48px;
  text-align: right;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSoft};
  }
`;

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onIncrement, onDecrement, onChangeQuantity, onRemove }: CartItemRowProps) {
  const exceedsStock = item.quantity > item.availableStock;

  return (
    <Row>
      <Details>
        <Name title={item.productName}>{item.productName}</Name>
        <UnitPrice>{formatSaleCurrency(item.unitPrice)} each</UnitPrice>
        {exceedsStock && (
          <StockWarning role="alert">⚠ Only {item.availableStock} units are available.</StockWarning>
        )}
      </Details>
      <ControlsGroup>
        <QuantitySelector
          quantity={item.quantity}
          maxQuantity={item.availableStock}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onChange={onChangeQuantity}
        />
        <LineTotal>{formatSaleCurrency(item.unitPrice * item.quantity)}</LineTotal>
        <RemoveButton type="button" onClick={onRemove} aria-label={`Remove ${item.productName} from cart`}>
          <TrashIcon />
        </RemoveButton>
      </ControlsGroup>
    </Row>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
