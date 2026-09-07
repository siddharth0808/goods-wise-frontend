import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';
import { getPaymentMethodLabel, type PaymentMethod } from '../types/sale.types';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: ${({ theme }) => theme.spacing(4)};
`;

const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(6)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
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
    background: ${({ theme }) => theme.colors.background};
  }
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const Intro = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
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
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DiscountRowValue = styled(RowValue)`
  color: ${({ theme }) => theme.colors.danger};
`;

const TotalRowLabel = styled(RowLabel)`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalRowValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(6)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface SaleConfirmationDialogProps {
  productCount: number;
  totalUnits: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SaleConfirmationDialog({
  productCount,
  totalUnits,
  subtotal,
  discountAmount,
  total,
  paymentMethod,
  isSubmitting,
  onCancel,
  onConfirm,
}: SaleConfirmationDialogProps) {
  return (
    <Backdrop role="dialog" aria-modal="true" aria-labelledby="confirm-sale-title">
      <Modal>
        <Header>
          <Title id="confirm-sale-title">Confirm Sale</Title>
          <CloseButton type="button" onClick={onCancel} aria-label="Close">
            <CloseIcon />
          </CloseButton>
        </Header>
        <Body>
          <Intro>You are about to complete the following transaction:</Intro>
          <Row>
            <RowLabel>Total Units</RowLabel>
            <RowValue>
              {totalUnits} unit{totalUnits === 1 ? '' : 's'} ({productCount} product{productCount === 1 ? '' : 's'})
            </RowValue>
          </Row>
          <Row>
            <RowLabel>Subtotal</RowLabel>
            <RowValue>{formatSaleCurrency(subtotal)}</RowValue>
          </Row>
          <Row>
            <RowLabel>Discount</RowLabel>
            <DiscountRowValue>{discountAmount > 0 ? `- ${formatSaleCurrency(discountAmount)}` : formatSaleCurrency(0)}</DiscountRowValue>
          </Row>
          <Row>
            <TotalRowLabel>Total Bill</TotalRowLabel>
            <TotalRowValue>{formatSaleCurrency(total)}</TotalRowValue>
          </Row>
          <Row>
            <RowLabel>Payment Method</RowLabel>
            <RowValue>{getPaymentMethodLabel(paymentMethod)}</RowValue>
          </Row>
        </Body>
        <Divider />
        <Footer>
          <Button type="button" $variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Confirming…' : 'Confirm Sale'}
          </Button>
        </Footer>
      </Modal>
    </Backdrop>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
