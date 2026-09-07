import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Product } from "../types/product.types";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { getStockStatusMeta } from "../utils/stockStatus";
import { media } from "../../../styles/breakpoints";
import {
  AdjustIcon,
  EditIcon,
  EyeIcon,
  HistoryIcon,
  RemoveIcon,
} from "../../../components/common/Icons/Icons";
import { useAppDispatch } from "../../../app/store/hooks";
import { deleteProduct } from "../store/inventorySlice";

const TableWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow: hidden;
  overflow-x: auto;

  ${() => media.tabletDown`
    display: none;
  `}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1080px;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const Th = styled.th<{ $align?: "left" | "right" }>`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = "left" }) => $align};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

// Pinned to the right edge of the scrollable table area (not the row/table
// itself), so the quick-action icons are reachable without scrolling
// horizontally, even on a narrow/resized viewport. No visible column
// header - it's an empty, unlabeled sticky header cell purely so the
// column widths still line up correctly.
const StickyTh = styled(Th)`
  position: sticky;
  right: 0;
  background: ${({ theme }) => theme.colors.background};
`;

const Tr = styled.tr`
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
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = "left" }) => $align};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const ProductName = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const StrongPrice = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// Sticky right edge, same trick as StickyTh - keeps an opaque background so
// other cells' text doesn't show through while scrolled underneath it, and
// stays in view regardless of horizontal scroll position.
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

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>Status</Th>
            <Th>Product</Th>
            <Th $align="right">MRP.</Th>
            <Th $align="right">RATE</Th>
            <Th $align="right">Stock</Th>
            <Th $align="right">Min Stock</Th>
            <Th $align="right">Expiry Date</Th>
            <Th>Batch No.</Th>

            <StickyTh aria-label="Actions" />
          </tr>
        </Thead>
        <tbody>
          {products.map((product) => {
            const statusMeta = getStockStatusMeta(
              product.currentStock,
              product.minimumStock,
            );
            return (
              <Tr
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <Td>
                  <StatusBadge tone={statusMeta.tone}>
                    {statusMeta.label}
                  </StatusBadge>
                </Td>
                <ProductName>{product.name}</ProductName>
                <StrongPrice $align="right">
                  {formatCurrency(product.mrp)}
                </StrongPrice>
                <Td $align="right">{formatCurrency(product.rate)}</Td>
                <Td $align="right">{product.currentStock}</Td>
                <Td $align="right">{product.minimumStock}</Td>
                <Td $align="right">
                  {formatDate(
                    product.expiryDate
                      ? new Date(product.expiryDate).toISOString()
                      : "",
                  )}
                </Td>
                <Td>{product.batchNumber || "—"}</Td>

                <ActionsCell onClick={(event) => event.stopPropagation()}>
                  <RowActions className="row-actions">
                    <IconButton
                      type="button"
                      title="View Details"
                      aria-label={`View details for ${product.name}`}
                      onClick={() =>
                        navigate(`/products/${product.id}?fromRow=true`)
                      }
                    >
                      <EyeIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="Adjust Stock"
                      aria-label={`Adjust stock for ${product.name}`}
                      onClick={() =>
                        navigate(
                          `/products/${product.id}/adjust-stock?fromRow=true`,
                        )
                      }
                    >
                      <AdjustIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="View History"
                      aria-label={`View history for ${product.name}`}
                      onClick={() =>
                        navigate(`/products/${product.id}/history?fromRow=true`)
                      }
                    >
                      <HistoryIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="Edit Product"
                      aria-label={`Edit ${product.name}`}
                      onClick={() =>
                        navigate(`/products/${product.id}/edit?fromRow=true`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      title="Remove Product"
                      aria-label={`Remove ${product.name}`}
                      onClick={() =>
                        dispatch(deleteProduct({ productId: product.id || "" }))
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  </RowActions>
                </ActionsCell>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
