import styled from "styled-components";
import type { InvoiceProducts } from "../types/import.types";
import { ProductMatchBadge } from "./ProductMatchBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { EditIcon, RemoveIcon } from "../../../components/common/Icons/Icons";

const Row = styled.tr`
  cursor: pointer;

  &:hover td {
    background: ${({ theme }) => theme.colors.background};
  }

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  /* Row-level quick actions stay invisible (but still in layout, so the
     column doesn't jump) until the row is hovered or a button inside it
     has keyboard focus - keeps the table quiet until it's needed. */
  &:hover .row-actions,
  .row-actions:focus-within {
    opacity: 1;
  }
`;

const Td = styled.td<{ $align?: "left" | "right" }>`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(4)};
  text-align: ${({ $align = "left" }) => $align};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const ProductNameCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  white-space: normal;
  max-width: 220px;
`;

const ActionsCell = styled(Td)`
  text-align: right;
  position: sticky;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const RowActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  opacity: 0;
  transition: opacity 0.12s ease;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
`;

interface InvoiceReviewRowProps {
  product: InvoiceProducts;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function InvoiceReviewRow({
  product,
  onEdit,
  onRemove,
}: InvoiceReviewRowProps) {
  return (
    <Row>
      <Td>
        <ProductMatchBadge matchType={product.status} />
      </Td>
      <ProductNameCell>
        {product.name || <em>Unnamed product</em>}
      </ProductNameCell>
      <Td $align="right">{product.quantity}</Td>
      <Td $align="right">{product.currentQuantity}</Td>
      <Td $align="right">{product.currentQuantity + product.quantity}</Td>

      <Td $align="right">{product.rate ? formatCurrency(product.rate) : "—"}</Td>
      <Td $align="right">{product.mrp ? formatCurrency(product.mrp) : "—"}</Td>

      <Td $align="right">{product.expiryDate ? formatDate(new Date(product.expiryDate).toISOString()): "—"}</Td>
      <Td $align="right">{product.amount ? formatCurrency(product.amount): "—"}</Td>
      <ActionsCell onClick={(event) => event.stopPropagation()}>
        <RowActions className="row-actions">
          <IconButton
            type="button"
            title="Edit"
            aria-label={`Edit for ${product.name}`}
            onClick={() => onEdit(product.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            type="button"
            title="Remove"
            aria-label={`Remove for ${product.name}`}
            onClick={() => onRemove(product.id)}
          >
            <RemoveIcon />
          </IconButton>
        </RowActions>
      </ActionsCell>
    </Row>
  );
}
