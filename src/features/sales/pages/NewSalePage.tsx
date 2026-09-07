import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { useAppSelector } from '../../../app/store/hooks';
import { media } from '../../../styles/breakpoints';
import type { CartItem } from '../types/sale.types';
import type { Product } from '../../inventory/types/product.types';

const Layout = styled.div`display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 24px; width: 100%; ${() => media.tabletDown`grid-template-columns: 1fr;`}`;
const ProductArea = styled.section`min-width: 0;`;
const Header = styled.div`display: flex; align-items: center; gap: 12px; margin-bottom: 24px;`;
const Back = styled.button`border: 0; background: transparent; color: ${({ theme }) => theme.colors.textSecondary}; font-size: 22px;`;
const Title = styled.h1`margin: 0; font-size: ${({ theme }) => theme.font.size.xxxl};`;
const Search = styled.input`width: 100%; height: 42px; padding: 0 14px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.md}; font-size: ${({ theme }) => theme.font.size.base};`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 24px; ${() => media.mobile`grid-template-columns: 1fr 1fr; gap: 12px;`}`;
const ProductCard = styled.div`display: flex; flex-direction: column; min-height: 144px; padding: 16px; background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg};`;
const Brand = styled.span`margin-top: 4px; color: ${({ theme }) => theme.colors.textSecondary}; font-size: ${({ theme }) => theme.font.size.sm};`;
const PriceRow = styled.div`display: flex; justify-content: space-between; margin-top: auto; margin-bottom: 12px; font-weight: ${({ theme }) => theme.font.weight.semibold}; span { color: ${({ theme }) => theme.colors.textSecondary}; font-size: ${({ theme }) => theme.font.size.xs}; font-weight: ${({ theme }) => theme.font.weight.regular}; }`;
const Add = styled.button`height: 32px; border: 1px solid ${({ theme }) => theme.colors.primary}; border-radius: ${({ theme }) => theme.radius.md}; background: ${({ theme }) => theme.colors.primarySoft}; color: ${({ theme }) => theme.colors.primary}; font-weight: ${({ theme }) => theme.font.weight.semibold};`;
const Cart = styled.aside`padding: 24px; background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg}; height: max-content; position: sticky; top: 24px;`;
const CartRow = styled.div`display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.border};`;
const CartFooter = styled.div`display: flex; justify-content: space-between; margin: 20px 0; font-size: ${({ theme }) => theme.font.size.lg}; font-weight: ${({ theme }) => theme.font.weight.bold};`;

const fallbackProducts: Product[] = [
  { id: 'maggi', name: 'Maggi 70g', manufacturer: 'Nestle', rate: 15, mrp: 15, currentStock: 100, minimumStock: 10, expiryDate: '' },
  { id: 'coke', name: 'Coke 500ml', manufacturer: 'Coca-Cola', rate: 40, mrp: 40, currentStock: 48, minimumStock: 10, expiryDate: '' },
  { id: 'rice', name: 'Rice 5kg', manufacturer: 'India Gate', rate: 450, mrp: 450, currentStock: 12, minimumStock: 5, expiryDate: '' },
  { id: 'dal', name: 'Toor Dal 1kg', manufacturer: 'Tata', rate: 180, mrp: 180, currentStock: 45, minimumStock: 5, expiryDate: '' },
  { id: 'shirt', name: 'Cotton T-Shirt', manufacturer: 'Uniqlo', rate: 899, mrp: 899, currentStock: 24, minimumStock: 5, expiryDate: '' },
];

export default function NewSalePage() {
  const navigate = useNavigate();
  const products = useAppSelector((state) => state.inventory.products);
  const available = products.length ? products : fallbackProducts;
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const filtered = useMemo(() => available.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [available, query]);
  const add = (product: Product) => setCart((items) => items.some((item) => item.product.id === product.id) ? items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { product, quantity: 1 }]);
  const total = cart.reduce((sum, item) => sum + item.product.rate * item.quantity, 0);
  return <Layout><ProductArea><Header><Back type="button" onClick={() => navigate('/sales')} aria-label="Back to sales">‹</Back><Title>New Sale</Title></Header><Search placeholder="Search products by name or HSN..." value={query} onChange={(event) => setQuery(event.target.value)} /><Grid>{filtered.map((product) => <ProductCard key={product.id ?? product.name}><strong>{product.name}</strong><Brand>{product.manufacturer ?? 'Generic'}</Brand><PriceRow>₹{product.rate}<span>{product.currentStock} available</span></PriceRow><Add type="button" onClick={() => add(product)}>+ Add</Add></ProductCard>)}</Grid></ProductArea><Cart><h2 style={{ margin: 0, fontSize: 18 }}>Current Cart</h2>{cart.length ? cart.map((item) => <CartRow key={item.product.id}><span>{item.product.name}<br /><small>{item.quantity} × ₹{item.product.rate}</small></span><strong>₹{item.product.rate * item.quantity}</strong></CartRow>) : <p style={{ color: 'inherit' }}>Add products to begin a sale.</p>}<CartFooter><span>Total</span><span>₹{total}</span></CartFooter><Button $fullWidth disabled={!cart.length} onClick={() => navigate('/sales/checkout', { state: { cart } })}>Continue to Checkout</Button></Cart></Layout>;
}
