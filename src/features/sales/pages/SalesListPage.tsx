import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorState } from '../../../components/common/ErrorState';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchSales } from '../store/salesSlice';
import { SalesSearchBar } from '../components/SalesSearchBar';
import { FilterChips } from '../../inventory/components/FilterChips';
import { SalesTable } from '../components/SalesTable';
import { SaleCardList } from '../components/SaleCard';

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
`;

const SearchWrapper = styled.div`
  flex: 1 1 280px;
  min-width: 260px;
`;

type DateFilter = 'all' | 'today' | 'week' | 'month';

const filterOptions: Array<{ value: DateFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

function isWithinRange(isoDate: string, range: DateFilter): boolean {
  if (range === 'all') return true;
  const date = new Date(isoDate);
  const now = new Date();
  if (range === 'today') {
    return date.toDateString() === now.toDateString();
  }
  if (range === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo && date <= now;
  }
  // month
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function SalesListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sales, status, error } = useAppSelector((state) => state.sales);
  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSales());
    }
  }, [dispatch]);

  const filteredSales = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return sales.filter((sale) => {
      const matchesQuery = !trimmed || sale.saleNumber.toLowerCase().includes(trimmed);
      return matchesQuery && isWithinRange(sale.createdAt, dateFilter);
    });
  }, [sales, query, dateFilter]);

  const renderBody = () => {
    if (status === 'loading' || status === 'idle') {
      return <Loader label="Loading sales…" />;
    }
    if (status === 'failed') {
      return <ErrorState message={error ?? 'Unable to load sales.'} onRetry={() => dispatch(fetchSales())} />;
    }
    if (sales.length === 0) {
      return (
        <EmptyState
          title="No sales yet"
          description="Completed sales will appear here."
          action={
            <Button type="button" onClick={() => navigate('/sales/new')}>
              + New Sale
            </Button>
          }
        />
      );
    }
    if (filteredSales.length === 0) {
      return (
        <EmptyState
          title="No matching sales"
          description="Try a different search term or date range."
        />
      );
    }
    return (
      <>
        <SalesTable sales={filteredSales} />
        <SaleCardList sales={filteredSales} />
      </>
    );
  };

  return (
    <Content>
      <PageHeader
        title="Sales"
        subtitle="View and manage your sales"
        action={
          <Button type="button" onClick={() => navigate('/sales/new')}>
            + New Sale
          </Button>
        }
      />
      <FilterBar>
        <SearchWrapper>
          <SalesSearchBar value={query} onChange={setQuery} />
        </SearchWrapper>
        <FilterChips options={filterOptions} value={dateFilter} onChange={setDateFilter} />
      </FilterBar>
      {renderBody()}
    </Content>
  );
}
