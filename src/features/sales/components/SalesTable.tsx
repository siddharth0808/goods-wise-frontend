import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Sale } from '../types/sale.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDate } from '../../../utils/formatters';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';
import { getPaymentMethodLabel } from '../types/sale.types';
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
  min-width: 980px;
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
  cursor: pointer;

  &:hover td {
    background: ${({ theme }) => theme.colors.background};
  }

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

const SaleIdCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const TotalCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const ActionLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};

  &:hover {
    text-decoration: underline;
  }
`;

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const navigate = useNavigate();

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>Sale ID</Th>
            <Th>Date &amp; Time</Th>
            <Th $align="right">Items</Th>
            <Th $align="right">Total</Th>
            <Th>Payment Method</Th>
            <Th>Status</Th>
            <Th $align="right">Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {sales.map((sale) => (
            <Tr key={sale.id} onClick={() => navigate(`/sales/${sale.id}`)}>
              <SaleIdCell>{sale.saleNumber}</SaleIdCell>
              <Td>{formatDate(sale.createdAt)}</Td>
              <Td $align="right">{sale.items.length}</Td>
              <TotalCell $align="right">{formatSaleCurrency(sale.totalAmt)}</TotalCell>
              <Td>{getPaymentMethodLabel(sale.paymentMethod)}</Td>
              <Td>
                <StatusBadge tone={sale.status === 'VOIDED' ? 'danger' : 'success'}>
                  {sale.status === 'VOIDED' ? 'Voided' : 'Completed'}
                </StatusBadge>
              </Td>
              <Td $align="right" onClick={(event) => event.stopPropagation()}>
                <ActionLink type="button" onClick={() => navigate(`/sales/${sale.id}`)}>
                  View Details
                </ActionLink>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
