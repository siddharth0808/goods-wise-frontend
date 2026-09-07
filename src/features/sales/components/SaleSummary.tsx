import styled from 'styled-components';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';
import { setDiscount } from '../store/posSlice';
import { useAppDispatch } from '../../../app/store/hooks';
import { DiscountInput } from './DiscountInput';
import type { Discount } from '../types/sale.types';

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DiscountValue = styled(Value)`
  color: ${({ theme }) => theme.colors.danger};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

const TotalLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

interface SaleSummaryProps {
  subtotal: number;
  discount?: Discount | null;
  showDiscount:boolean
  discountAmount: number;
  total: number;
  totalLabel?: string;
}

export function SaleSummary({ subtotal, discount, showDiscount ,discountAmount, total, totalLabel = 'Total' }: SaleSummaryProps) {
    const dispatch = useAppDispatch();
  
  return (
    <Rows>
      <Row>
        <Label>Subtotal</Label>
        <Value>{formatSaleCurrency(subtotal)}</Value>
      </Row>
         {showDiscount && <DiscountInput discount={discount} onApply={(value) => dispatch(setDiscount(value))} />}
      <Row>
        <Label>Discount</Label>
        <DiscountValue>{discountAmount > 0 ? `- ${formatSaleCurrency(discountAmount)}` : formatSaleCurrency(0)}</DiscountValue>
      </Row>
      <Divider />
      <Row>
        <TotalLabel>{totalLabel}</TotalLabel>
        <TotalValue>{formatSaleCurrency(total)}</TotalValue>
      </Row>
    </Rows>
  );
}
