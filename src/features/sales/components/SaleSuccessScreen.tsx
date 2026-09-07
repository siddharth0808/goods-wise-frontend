import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';
import { getPaymentMethodLabel } from '../types/sale.types';
import type { Sale } from '../types/sale.types';

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(10)};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(6)};
  text-align: center;
`;

const Badge = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.successSoft};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xxl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const DetailRows = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RowLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RowValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalRowValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const PrintLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.sm};
  text-decoration: underline;
`;

interface SaleSuccessScreenProps {
  sale: Sale;
  onViewSaleDetails: () => void;
  onNewSale: () => void;
  onPrintReceipt?: () => void;
}

export function SaleSuccessScreen({ sale, onViewSaleDetails, onNewSale, onPrintReceipt }: SaleSuccessScreenProps) {
  return (
    <Card>
      <Badge>
        <CheckCircleIcon />
      </Badge>
      <TextGroup>
        <Title>Sale Completed Successfully</Title>
        <Subtitle>
          Transaction records have been written and inventory stock counts have been automatically adjusted.
        </Subtitle>
      </TextGroup>
      <Divider />
      <DetailRows>
        <Row>
          <RowLabel>Sale ID</RowLabel>
          <RowValue>{sale.saleNumber}</RowValue>
        </Row>
        <Row>
          <RowLabel>Total Products</RowLabel>
          <RowValue>{sale.itemCount} Items</RowValue>
        </Row>
        <Row>
          <RowLabel>Payment Method</RowLabel>
          <RowValue>{getPaymentMethodLabel(sale.paymentMethod)}</RowValue>
        </Row>
        <Row>
          <RowLabel>Total Bill Amount</RowLabel>
          <TotalRowValue>{formatSaleCurrency(sale.totalAmt)}</TotalRowValue>
        </Row>
      </DetailRows>
      <Divider />
      <Actions>
        <Button type="button" $variant="secondary" $fullWidth onClick={onViewSaleDetails}>
          View Sale Details
        </Button>
        <Button type="button" $fullWidth onClick={onNewSale}>
          + New Sale
        </Button>
      </Actions>
      <PrintLink type="button" onClick={onPrintReceipt}>
        Print Receipt (PDF)
      </PrintLink>
    </Card>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
