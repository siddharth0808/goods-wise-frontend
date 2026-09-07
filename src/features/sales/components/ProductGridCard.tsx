import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { StockAvailabilityBadge } from './StockAvailabilityBadge';
import { formatSaleCurrency } from '../utils/formatSaleCurrency';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Name = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Brand = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PricingRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;



interface ProductGridCardProps {
  name: string;
  brand?: string;
  sellingPrice: number;
  availableStock: number;
  onAdd: () => void;
}

export function ProductGridCard({ name, brand, sellingPrice, availableStock, onAdd }: ProductGridCardProps) {
  const isOutOfStock = availableStock <= 0;

  return (
    <Card>
      <TextGroup>
        <Name title={name}>{name}</Name>
        {brand && <Brand>{brand}</Brand>}
      </TextGroup>
      <PricingRow>
        <Price>{formatSaleCurrency(sellingPrice)}</Price>
        <StockAvailabilityBadge availableStock={availableStock} />
      </PricingRow>
      <Button type="button" $variant={isOutOfStock ? 'secondary' : 'primary'} $fullWidth disabled={isOutOfStock} onClick={onAdd}>
        {isOutOfStock ? 'Unavailable' : '+ Add'}
      </Button>
    </Card>
  );
}
