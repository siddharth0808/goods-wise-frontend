import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Product } from "../types/product.types";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { getStockStatusMeta } from "../utils/stockStatus";
import { media } from "../../../styles/breakpoints";

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

interface ProductCardListProps {
  products: Product[];
}

export function ProductCardList({ products }: ProductCardListProps) {
  const navigate = useNavigate();

  return (
    <CardList>
      {products.map((product) => {
        const statusMeta = getStockStatusMeta(
          product.currentStock,
          product.minimumStock,
        );
        return (
          <Card
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
          >
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
                <StatusBadge tone={statusMeta.tone}>
                  {statusMeta.label}
                </StatusBadge>
              </BadgeRow>
            </TopRow>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>MRP.</DetailLabel>
                <DetailValue>{formatCurrency(product.mrp)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Rate</DetailLabel>
                <DetailValue>{formatCurrency(product.rate)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Current Stock</DetailLabel>
                <DetailValue>{product.currentStock}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Min Stock</DetailLabel>
                <DetailValue>{product.minimumStock}</DetailValue>
              </DetailItem>
            </DetailsGrid>
          </Card>
        );
      })}
    </CardList>
  );
}
