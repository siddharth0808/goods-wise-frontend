import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { PageHeader } from '../../../components/layout/PageHeader';
import { media } from '../../../styles/breakpoints';
import { sampleSales, type SaleRecord } from '../types/sale.types';

const Content = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing(6)}; width: 100%;`;
const FilterBar = styled.div`display: flex; align-items: center; justify-content: space-between; gap: ${({ theme }) => theme.spacing(4)}; padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)}; background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg}; ${() => media.mobile`padding: 12px; flex-direction: column; align-items: stretch;`}`;
const Search = styled.input`flex: 1; min-width: 0; border: 0; outline: 0; font-size: ${({ theme }) => theme.font.size.base}; color: ${({ theme }) => theme.colors.textPrimary}; background: transparent; &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }`;
const SearchWrap = styled.div`display: flex; align-items: center; gap: 12px; flex: 1;`;
const Tabs = styled.div`display: flex; gap: 4px;`;
const Tab = styled.button<{ $active: boolean }>`border: 0; border-radius: ${({ theme }) => theme.radius.sm}; padding: 6px 12px; color: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.textSecondary}; background: ${({ $active, theme }) => $active ? theme.colors.primarySoft : 'transparent'}; font-size: ${({ theme }) => theme.font.size.sm}; font-weight: ${({ theme }) => theme.font.weight.semibold};`;
const Table = styled.div`background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg}; overflow: hidden; ${() => media.mobile`display: none;`}`;
const Row = styled.div`display: grid; grid-template-columns: 1.2fr 1.5fr .8fr 1.2fr 1.2fr 1fr 1fr; align-items: center; min-height: 55px; padding: 0 24px; border-top: 1px solid ${({ theme }) => theme.colors.border}; font-size: ${({ theme }) => theme.font.size.base};`;
const Head = styled(Row)`min-height: 39px; border-top: 0; background: ${({ theme }) => theme.colors.background}; color: ${({ theme }) => theme.colors.textSecondary}; font-size: ${({ theme }) => theme.font.size.xs}; font-weight: ${({ theme }) => theme.font.weight.semibold};`;
const Link = styled.button`border: 0; background: transparent; color: ${({ theme }) => theme.colors.primary}; font-size: inherit; font-weight: ${({ theme }) => theme.font.weight.semibold}; text-align: left;`;
const Status = styled.span`display: inline-flex; width: max-content; padding: 4px 8px; border-radius: ${({ theme }) => theme.radius.pill}; background: ${({ theme }) => theme.colors.successSoft}; color: ${({ theme }) => theme.colors.success}; font-size: ${({ theme }) => theme.font.size.xs}; font-weight: ${({ theme }) => theme.font.weight.semibold};`;
const Cards = styled.div`display: none; gap: 12px; flex-direction: column; ${() => media.mobile`display: flex;`}`;
const Card = styled.div`padding: 16px; background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg};`;
const CardTop = styled.div`display: flex; justify-content: space-between; align-items: flex-start;`;
const CardMeta = styled.div`display: flex; gap: 36px; margin-top: 16px; padding-top: 12px; border-top: 1px solid ${({ theme }) => theme.colors.border};`;
const Meta = styled.div`display: flex; flex-direction: column; gap: 2px; font-size: ${({ theme }) => theme.font.size.sm}; color: ${({ theme }) => theme.colors.textSecondary}; span:last-child { color: ${({ theme }) => theme.colors.textPrimary}; font-size: ${({ theme }) => theme.font.size.base}; }`;

export default function SalesListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All Sales');
  const tabs = ['All Sales', 'Today', 'This Week', 'This Month'];
  const sales = useMemo(() => sampleSales.filter((sale) => sale.id.toLowerCase().includes(query.toLowerCase())), [query]);
  const renderSale = (sale: SaleRecord) => (
    <Card key={sale.id}>
      <CardTop><div><strong>{sale.id}</strong><div style={{ color: 'inherit', fontSize: 13, marginTop: 4 }}>{sale.date}</div></div><Status>{sale.status}</Status></CardTop>
      <CardMeta><Meta><span>Items</span><span>{sale.items} Qty</span></Meta><Meta><span>Payment</span><span>{sale.payment}</span></Meta><Meta style={{ marginLeft: 'auto', textAlign: 'right' }}><span>Total Amount</span><span>₹{sale.total}</span></Meta></CardMeta>
    </Card>
  );
  return <Content>
    <PageHeader title="Sales Transactions" subtitle="View, record, and manage real-time retail & POS sales" action={<Button onClick={() => navigate('/sales/new')}><PlusIcon /> New Sale</Button>} />
    <FilterBar><SearchWrap><SearchIcon /><Search placeholder="Search sales by transaction ID, product, or customer name..." value={query} onChange={(event) => setQuery(event.target.value)} /></SearchWrap><Tabs>{tabs.map((item) => <Tab key={item} type="button" $active={tab === item} onClick={() => setTab(item)}>{item}</Tab>)}</Tabs></FilterBar>
    <Table><Head><span>Sale ID</span><span>Date & Time</span><span>Items Qty</span><span>Total Amount</span><span>Payment Method</span><span>Status</span><span>Actions</span></Head>{sales.map((sale) => <Row key={sale.id}><strong>{sale.id}</strong><span>{sale.date}</span><span>{sale.items}</span><span>₹{sale.total}</span><span>{sale.payment}</span><Status>{sale.status}</Status><Link type="button" onClick={() => navigate(`/sales/${sale.id}`)}>View Details</Link></Row>)}</Table>
    <Cards>{sales.map(renderSale)}</Cards>
  </Content>;
}

function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>; }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>; }
