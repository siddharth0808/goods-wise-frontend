import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Sale } from '../types/sale.types';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatDate } from '../../../utils/formatters';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';
import { getPaymentMethodLabel } from '../types/sale.types';
import { media } from '../../../styles/breakpoints';

const CardList = styled.div`
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
  gap: ${({ theme }) => theme.spacing(3)};
  cursor: pointer;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const IdBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SaleId = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DateText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const DetailsGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

interface SaleCardListProps {
  sales: Sale[];
}

export function SaleCardList({ sales }: SaleCardListProps) {
  const navigate = useNavigate();

  return (
    <CardList>
      {sales.map((sale) => (
        <Card key={sale.id} onClick={() => navigate(`/sales/${sale.id}`)}>
          <TopRow>
            <IdBlock>
              <SaleId>{sale.saleNumber}</SaleId>
              <DateText>{formatDate(sale.createdAt)}</DateText>
            </IdBlock>
            <StatusBadge tone={sale.status === 'VOIDED' ? 'danger' : 'success'}>
              {sale.status === 'VOIDED' ? 'Voided' : 'Completed'}
            </StatusBadge>
          </TopRow>
          <Divider />
          <DetailsRow>
            <DetailsGroup>
              <DetailItem>
                <DetailLabel>Items</DetailLabel>
                <DetailValue>{sale.items.length} Qty</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Payment</DetailLabel>
                <DetailValue>{getPaymentMethodLabel(sale.paymentMethod)}</DetailValue>
              </DetailItem>
            </DetailsGroup>
            <DetailItem>
              <DetailLabel>Total Amount</DetailLabel>
              <TotalValue>{formatSaleCurrency(sale.totalAmt)}</TotalValue>
            </DetailItem>
          </DetailsRow>
        </Card>
      ))}
    </CardList>
  );
}
