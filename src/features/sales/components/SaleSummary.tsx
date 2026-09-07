import styled from 'styled-components';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';

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
  discountAmount: number;
  total: number;
  totalLabel?: string;
}

export function SaleSummary({ subtotal, discountAmount, total, totalLabel = 'Total' }: SaleSummaryProps) {
  return (
    <Rows>
      <Row>
        <Label>Subtotal</Label>
        <Value>{formatSaleCurrency(subtotal)}</Value>
      </Row>
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
