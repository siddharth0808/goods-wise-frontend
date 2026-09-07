import styled from "styled-components";
import { media } from "../../../styles/breakpoints";
import type { InvoiceProducts } from "../types/import.types";
import { ProductMatchBadge } from "./ProductMatchBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { RemoveIcon } from "../../../components/common/Icons/Icons";

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
  gap: ${({ theme }) => theme.spacing(2)};
  cursor: pointer;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const NameBlock = styled.div`
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
`;

const Meta = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-shrink: 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(1)};
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

interface InvoiceRevieCardProps {
  products: InvoiceProducts[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export function InvoiceReviewCardList({
  products,
  onEdit,
  onRemove,
}: InvoiceRevieCardProps) {
  return (
    <CardList>
      {products.map((product) => {
        return (
          <Card key={product.id} onClick={() => onEdit(product.id)}>
            <TopRow>
              <NameBlock>
                <Name>{product.name}</Name>
                <Meta>
                  {[
                    product.batchNumber,
                    product.manufacturer,
                    formatDate(product.expiryDate),
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Meta>
              </NameBlock>
              <BadgeRow>
                <ProductMatchBadge matchType={product.status} />
                <div onClick={() => onRemove(product.id)}>
                  <RemoveIcon></RemoveIcon>
                </div>
              </BadgeRow>
            </TopRow>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>MRP.</DetailLabel>
                <DetailValue>{formatCurrency(product?.mrp || 0)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Rate</DetailLabel>
                <DetailValue>{formatCurrency(product.rate)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Quantity.</DetailLabel>
                <DetailValue>{product.quantity}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Current Qty.</DetailLabel>
                <DetailValue>{product.currentQuantity}</DetailValue>
              </DetailItem>
              <DetailItem>
                  <DetailLabel>Expected Qty.</DetailLabel>
                  <DetailValue>
                    {product.currentQuantity + product.quantity}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Total Amt.</DetailLabel>
                  <DetailValue>
                    {product.amount}
                  </DetailValue>
                </DetailItem>
             
            </DetailsGrid>
          </Card>
        );
      })}
    </CardList>
  );
}
