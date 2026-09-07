import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorState } from '../../../components/common/ErrorState';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchSaleById, voidSale } from '../store/salesSlice';
import { SaleSummary } from '../components/SaleSummary';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';
import { formatDate } from '../../../utils/formatters';
import { getPaymentMethodLabel } from '../types/sale.types';
import { media } from '../../../styles/breakpoints';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  max-width: 760px;
`;

const MetaBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)} 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  ${() => media.mobile`
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  `}
`;

const ItemTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemName = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ItemMeta = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ItemTotal = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-wrap: wrap;
`;

const DangerZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: flex-end;
`;

const DangerHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default function SaleDetailsPage() {
  const { saleId = '' } = useParams<{ saleId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeSale, activeSaleStatus, activeSaleError, isVoiding, voidError } = useAppSelector(
    (state) => state.sales
  );

  useEffect(() => {
    // If this sale was just completed by the POS flow, it's already primed
    // into `activeSale` - no need to refetch it immediately after creation.
    if (!activeSale || activeSale.id !== saleId) {
      dispatch(fetchSaleById(saleId));
    }
  }, [saleId, activeSale, dispatch]);

  if (activeSaleStatus === 'loading' || (activeSaleStatus === 'idle' && !activeSale)) {
    return <Loader label="Loading sale…" />;
  }

  if (activeSaleStatus === 'failed' || !activeSale) {
    return (
      <ErrorState
        message={activeSaleError ?? 'Sale not found.'}
        onRetry={() => dispatch(fetchSaleById(saleId))}
      />
    );
  }

  const sale = activeSale;
  const isVoided = sale.status === 'VOIDED';

  return (
    <Content>
      <PageHeader
        title={`Sale ${sale.saleNumber}`}
        onBack={() => navigate('/sales')}
        action={<StatusBadge tone={isVoided ? 'danger' : 'success'}>{isVoided ? 'Voided' : 'Completed'}</StatusBadge>}
      />

      <MetaBar>
        <MetaItem>
          <MetaLabel>Date &amp; Time</MetaLabel>
          <MetaValue>{formatDate(sale.createdAt)}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Payment Method</MetaLabel>
          <MetaValue>{getPaymentMethodLabel(sale.paymentMethod)}</MetaValue>
        </MetaItem>
      </MetaBar>

      {voidError && <ErrorState message={voidError} />}

      <Card>
        <SectionTitle>Items</SectionTitle>
        <div>
          {sale.items.map((item) => (
            <ItemRow key={item.id}>
              <ItemTextGroup>
                <ItemName>{item.productName}</ItemName>
                <ItemMeta>
                  {item.quantity} × {formatSaleCurrency(item.unitPrice)}
                </ItemMeta>
              </ItemTextGroup>
              <ItemTotal>{formatSaleCurrency(item.lineTotal)}</ItemTotal>
            </ItemRow>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Summary</SectionTitle>
        <SaleSummary subtotal={sale.subTotalAmt} discountAmount={sale.discountAmount} total={sale.totalAmt} />
      </Card>

      <Actions>
        <Button type="button" onClick={() => navigate('/sales/new')}>
          + New Sale
        </Button>

        {!isVoided && (
          <DangerZone>
            <Button
              type="button"
              $variant="danger"
              disabled={isVoiding}
              onClick={() => dispatch(voidSale(sale.id))}
            >
              {isVoiding ? 'Voiding…' : 'Void Sale'}
            </Button>
            <DangerHint>Voiding reverses this sale's effect on inventory.</DangerHint>
          </DangerZone>
        )}
      </Actions>
    </Content>
  );
}
