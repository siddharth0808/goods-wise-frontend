import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorState } from '../../../components/common/ErrorState';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { deleteProduct, fetchProductById, fetchProducts } from '../store/inventorySlice';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { getStockStatusMeta } from '../utils/stockStatus';
import {
  DetailCard,
  DetailCardHeaderRow,
  DetailCardTitle,
  InfoLabel,
  InfoRow,
  InfoRows,
  InfoValue,
  RightColumn,
  StatBlock,
  StatGrid,
  StatLabel,
  StatValue,
  TwoColumnLayout,
} from '../components/DetailCard.styles';
import { AdjustIcon, EditIcon, HistoryIcon, RemoveIcon } from '../../../components/common/Icons/Icons';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export default function ProductDetailsPage() {
  const { productId = '' } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = useAppSelector((state) => state.inventory.products.find((item) => item.id === productId));
  const listStatus = useAppSelector((state) => state.inventory.status);
  const detailStatus = useAppSelector((state) => state.inventory.productDetailStatus);
  const detailError = useAppSelector((state) => state.inventory.productDetailError);
  // The product may already be in the store from the Inventory List; only
  // fetch it directly (e.g. on a hard refresh / deep link) if it's missing.
  useEffect(() => {
    if (!product && listStatus === 'idle') {
      dispatch(fetchProducts());
    } else if (!product && listStatus !== 'loading') {
      dispatch(fetchProductById(productId));
    }
  }, [product, listStatus, productId, dispatch]);

  if (!product) {
    if (detailStatus === 'failed') {
      return (
        <ErrorState
          message={detailError ?? 'Product not found.'}
          onRetry={() => dispatch(fetchProductById(productId))}
        />
      );
    }
    return <Loader label="Loading product…" />;
  }

  const statusMeta = getStockStatusMeta(product.currentStock, product.minimumStock);

  return (
    <Content>
      <PageHeader
        title="Product Details"
        subtitle={product.batchNumber ? `${product.batchNumber} — ${product.name}` : product.name}
        onBack={() => navigate('/inventory')}
        action={
          <HeaderActions>
            <Button title="View History" type="button" $variant="secondary" onClick={() => navigate(`/products/${product.id}/history`)}>
              <HistoryIcon />
            </Button>
            <Button
              title="Adjust Stock"
              type="button"
              $variant="secondary"
              onClick={() => navigate(`/products/${product.id}/adjust-stock`)}
            >
              <AdjustIcon />
            </Button>
            <Button title="Edit Product" type="button" onClick={() => navigate(`/products/${product.id}/edit`)}>
              <EditIcon />
            </Button>
            <Button title="Delete Product" type="button" $variant="danger" onClick={() =>{dispatch(deleteProduct({ productId: product.id || "" }));  navigate(`/inventory`)}}>
              <RemoveIcon />
            </Button>
          </HeaderActions>
        }
      />

      <TwoColumnLayout>
        <DetailCard>
          <DetailCardTitle>General Information</DetailCardTitle>
          <InfoRows>
            <InfoRow>
              <InfoLabel>Product Name</InfoLabel>
              <InfoValue>{product.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Batch No.</InfoLabel>
              <InfoValue>{product.batchNumber || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>HSN</InfoLabel>
              <InfoValue>{product.hsn || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Brand</InfoLabel>
              <InfoValue>{product.manufacturer || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Total Amt.</InfoLabel>
              <InfoValue>{formatCurrency(product.amount || 0) || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
                <InfoLabel>Expiry Date</InfoLabel>
                <InfoValue>{product.expiryDate  ? formatDate(new Date(product.expiryDate).toISOString()) : '—'}</InfoValue>
              </InfoRow>
            <InfoRow>
                <InfoLabel>Created Date</InfoLabel>
                <InfoValue>{product.createdAt ? formatDate(product.createdAt) : '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Last Updated</InfoLabel>
                <InfoValue>{product.updatedAt ? formatDate(product.updatedAt) : '—'}</InfoValue>
              </InfoRow>
          </InfoRows>
        </DetailCard>

        <RightColumn>
          <DetailCard>
            <DetailCardHeaderRow>
              <DetailCardTitle>Stock Status</DetailCardTitle>
              <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
            </DetailCardHeaderRow>
            <StatGrid>
              <StatBlock>
                <StatLabel>Current Stock</StatLabel>
                <StatValue>{product.currentStock}</StatValue>
              </StatBlock>
              <StatBlock>
                <StatLabel>Minimum Stock</StatLabel>
                <StatValue>{product.minimumStock}</StatValue>
              </StatBlock>
            </StatGrid>
          </DetailCard>

          <DetailCard>
            <DetailCardTitle>Pricing &amp; Value</DetailCardTitle>
            <StatGrid>
              <StatBlock>
                <StatLabel>MRP.</StatLabel>
                <StatValue>{formatCurrency(product.mrp)}</StatValue>
              </StatBlock>
              <StatBlock>
                <StatLabel>Rate</StatLabel>
                <StatValue>{formatCurrency(product.rate)}</StatValue>
              </StatBlock>
              <StatBlock>
                <StatLabel>Margin</StatLabel>
                <StatValue>{formatCurrency(product.mrp - product.rate)}</StatValue>
              </StatBlock>
            </StatGrid>
          </DetailCard>

          {/* <DetailCard>
            <InfoRows>
              <InfoRow>
                <InfoLabel>Created Date</InfoLabel>
                <InfoValue>{product.createdAt ? formatDate(product.createdAt) : '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Last Updated</InfoLabel>
                <InfoValue>{product.updatedAt ? formatDate(product.updatedAt) : '—'}</InfoValue>
              </InfoRow>
            </InfoRows>
          </DetailCard> */}
        </RightColumn>
      </TwoColumnLayout>
    </Content>
  );
}
