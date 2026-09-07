import styled from 'styled-components';
import type { InventoryTransaction } from '../types/transaction.types';
import { getTransactionLabel, getTransactionTone } from '../types/transaction.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDate } from '../../../utils/formatters';
import { media } from '../../../styles/breakpoints';

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
  min-width: 900px;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const Th = styled.th<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Td = styled.td<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const QuantityCell = styled(Td)<{ $positive: boolean }>`
  color: ${({ theme, $positive }) => ($positive ? theme.colors.primary : theme.colors.danger)};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const ReasonCell = styled(Td)`
  white-space: normal;
  max-width: 280px;
`;

interface TransactionHistoryTableProps {
  transactions: InventoryTransaction[];
}

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
    <TableWrapper>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th $align="right">Quantity</Th>
            <Th $align="right">Prev Stock</Th>
            <Th $align="right">New Stock</Th>
            <Th>Reason</Th>
            <Th>Created By</Th>
          </Tr>
        </Thead>
        <tbody>
          {transactions.map((transaction) => (
            <Tr key={transaction.id}>
              <Td>{formatDate(transaction.createdAt)}</Td>
              <Td>
                <StatusBadge tone={getTransactionTone(transaction.type)}>
                  {getTransactionLabel(transaction.type)}
                </StatusBadge>
              </Td>
              <QuantityCell $align="right" $positive={Number(transaction.newStock) > Number(transaction.previousStock)}>
                {/* {formatSignedQuantity(transaction.quantity)} */}
                {Number(transaction.newStock) > Number(transaction.previousStock) ? `+${transaction.quantity}` : `-${transaction.quantity}`}
              </QuantityCell>
              <Td $align="right">{transaction.previousStock}</Td>
              <Td $align="right">{transaction.newStock}</Td>
              <ReasonCell>{transaction.reason || '—'}</ReasonCell>
              <Td>{transaction.createdBy || '—'}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
