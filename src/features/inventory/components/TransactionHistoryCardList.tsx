import styled from 'styled-components';
import type { InventoryTransaction } from '../types/transaction.types';
import { getTransactionLabel, getTransactionTone } from '../types/transaction.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDate } from '../../../utils/formatters';
import { media } from '../../../styles/breakpoints';

const List = styled.div`
  display: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;

  ${() => media.tabletDown`
    display: flex;
  `}
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuantityText = styled.span<{ $positive: boolean }>`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme, $positive }) => ($positive ? theme.colors.primary : theme.colors.danger)};
`;

const StockRow = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReasonText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ByLine = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface TransactionHistoryCardListProps {
  transactions: InventoryTransaction[];
}

export function TransactionHistoryCardList({ transactions }: TransactionHistoryCardListProps) {
  return (
    <List>
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <TopRow>
            <StatusBadge tone={getTransactionTone(transaction.type)}>
              {getTransactionLabel(transaction.type)}
            </StatusBadge>
            <QuantityText $positive={Number(transaction.newStock) > Number(transaction.previousStock)}>
                {Number(transaction.newStock) > Number(transaction.previousStock) ? `+${transaction.quantity}` : `-${transaction.quantity}`}
            </QuantityText>
          </TopRow>
          <StockRow>
            {transaction.previousStock} → {transaction.newStock} units
          </StockRow>
          {transaction.reason && <ReasonText>{transaction.reason}</ReasonText>}
          <ByLine>
            {formatDate(transaction.createdAt)}
            {transaction.createdBy ? ` · ${transaction.createdBy}` : ''}
          </ByLine>
        </Card>
      ))}
    </List>
  );
}
