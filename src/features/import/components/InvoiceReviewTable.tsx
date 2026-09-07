import styled from "styled-components";
import type { InvoiceProducts } from "../types/import.types";
import { InvoiceReviewRow } from "./InvoiceReviewRow";
import { media } from "../../../styles/breakpoints";

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
  min-width: 1200px;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const Th = styled.th<{ $align?: "left" | "right" }>`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  text-align: ${({ $align = "left" }) => $align};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const StickyTh = styled(Th)`
  position: sticky;
  right: 0;
  background: ${({ theme }) => theme.colors.background};
`;

interface InvoiceReviewTableProps {
  products: InvoiceProducts[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function InvoiceReviewTable({
  products,
  onEdit,
  onRemove,
}: InvoiceReviewTableProps) {
  // const allSelected = products.length > 0 && products.every((product) => product.selected);

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>Status</Th>
            <Th>Product</Th>
            <Th $align="right">Quantity</Th>
            <Th $align="right">Current Qty.</Th>
            <Th $align="right">Expected Qty.</Th>

            <Th $align="right">Rate</Th>
            <Th $align="right">MRP</Th>
            <Th $align="right">Expiry Date</Th>
            <Th $align="right">Total Amt.</Th>

            <StickyTh aria-label="Actions" />
          </tr>
        </Thead>
        <tbody>
          {products.map((product) => (
            <InvoiceReviewRow
              product={product}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
