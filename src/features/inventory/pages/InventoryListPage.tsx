import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Loader } from '../../../components/common/Loader';
import { ErrorState } from '../../../components/common/ErrorState';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchProducts } from '../store/inventorySlice';
import { ProductSearch } from '../components/ProductSearch';
import { ProductTable } from '../components/ProductTable';
import { ProductCardList } from '../components/ProductCard';
import { EmptyInventory } from '../components/EmptyInventory';
import { FilterChips } from '../components/FilterChips';
import { AddInventoryMenu } from '../../import/components/AddInventoryMenu';
import { getStockStatus } from '../../../utils/formatters';
import { media } from '../../../styles/breakpoints';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  width: 100%;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
  position: sticky;
  top: 8px;
  z-index: 10;
  padding: ${({ theme }) => theme.spacing(1)} 0;
  background: ${({ theme }) => theme.colors.background};

  ${() => media.tabletDown`
    top: 100px;
  `}
`;

const SearchWrapper = styled.div`
  flex: 1 1 280px;
  min-width: 260px;
`;

type StockFilter = 'all' | 'low-stock' | 'out-of-stock';

const filterOptions: Array<{ value: StockFilter; label: string }> = [
  { value: 'all', label: 'All Products' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
];

export default function InventoryListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useAppSelector(
    (state) => state.inventory,
  );
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  useEffect(() => {
    if(!products.length && status !== 'succeeded'){
      dispatch(fetchProducts());
    }
  }, [products, status, dispatch]);

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !trimmed ||
        [product.name, product.batchNumber, product.manufacturer, product.category]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(trimmed));

      if (!matchesQuery) return false;

      if (stockFilter === 'all') return true;
      const stockStatus = getStockStatus(product.currentStock, product.minimumStock);
      if (stockFilter === 'low-stock') return stockStatus === 'low-stock';
      return stockStatus === 'out-of-stock';
    });
  }, [products, query, stockFilter]);

  const renderBody = () => {
    if (status === 'loading' || status === 'idle') {
      return <Loader label="Loading inventory…" />;
    }
    if (status === 'failed') {
      return <ErrorState message={error ?? 'Failed to load products.'} onRetry={() => dispatch(fetchProducts())} />;
    }
    if (filteredProducts.length === 0) {
      return <EmptyInventory isFiltered={products.length > 0 && filteredProducts.length === 0} />;
    }
    return (
      <>
        <ProductTable products={filteredProducts} />
        <ProductCardList products={filteredProducts} />
      </>
    );
  };

  return (
    <Content>
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels and manage your product catalog"
        action={
          <AddInventoryMenu
            onAddProductManually={() => navigate('/products/new')}
            onImportFromInvoice={() => navigate('/import')}
          />
        }
      />
      <FilterBar>
        <SearchWrapper>
          <ProductSearch value={query} onChange={setQuery} />
        </SearchWrapper>
        <FilterChips options={filterOptions} value={stockFilter} onChange={setStockFilter} />
      </FilterBar>
      {renderBody()}
    </Content>
  );
}
