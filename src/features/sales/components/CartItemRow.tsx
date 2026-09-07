import styled from "styled-components";
import type { CartItem } from "../types/sale.types";
import { QuantitySelector } from "./QuantitySelector";
import { formatSaleCurrency } from "../utils/formatSaleCurrency";
import { CartItemRowContainer, ControlsGroup, ItemDetails, ItemName, LineItem } from "../../../styles/common";





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





const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.danger};

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.dangerSoft};
  }
`;

interface CartItemRowProps {
  item: CartItem;
  readonly?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  readonly,
  onIncrement,
  onDecrement,
  onChangeQuantity,
  onRemove,
}: CartItemRowProps) {
  const exceedsStock = item.quantity > item.availableStock;

  return (
    <CartItemRowContainer>
      <ItemDetails $readonly={readonly}>
        <ItemName title={item.productName}>{item.productName}</ItemName>
        {readonly ? null : (
          <UnitPrice>{formatSaleCurrency(item.unitPrice)} each</UnitPrice>
        )}
        {exceedsStock && (
          <StockWarning role="alert">
            ⚠ Only {item.availableStock} units are available.
          </StockWarning>
        )}
      </ItemDetails>
      <ControlsGroup>
        {readonly ? (
          <>
            <LineItem>{formatSaleCurrency(item.unitPrice)}</LineItem>
            <LineItem>{item.quantity}</LineItem>
          </>
        ) : (
          <QuantitySelector
            quantity={item.quantity}
            maxQuantity={item.availableStock}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onChange={onChangeQuantity}
          />
        )}
        <LineItem>
          {formatSaleCurrency(item.unitPrice * item.quantity)}
        </LineItem>

        {!readonly && (
          <RemoveButton
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.productName} from cart`}
          >
            <TrashIcon />
          </RemoveButton>
        )}
      </ControlsGroup>
    </CartItemRowContainer>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline
        points="3 6 5 6 21 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
