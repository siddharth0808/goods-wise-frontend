import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { media } from '../../../styles/breakpoints';
import type { CartItem } from '../types/sale.types';

const Layout = styled.div`width: 100%;`;
const Header = styled.div`display: flex; align-items: center; gap: 12px; margin-bottom: 24px;`;
const Back = styled.button`border: 0; background: transparent; color: ${({ theme }) => theme.colors.textSecondary}; font-size: 22px;`;
const Title = styled.h1`margin: 0; font-size: ${({ theme }) => theme.font.size.xxxl};`;
const Columns = styled.div`display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr); gap: 24px; max-width: 1100px; ${() => media.tabletDown`grid-template-columns: 1fr;`}`;
const Card = styled.section`padding: 28px; background: ${({ theme }) => theme.colors.surface}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.lg};`;
const CardTitle = styled.h2`margin: 0 0 24px; font-size: ${({ theme }) => theme.font.size.lg};`;
const Item = styled.div`display: grid; grid-template-columns: 1fr 80px 100px 80px; gap: 12px; padding: 14px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; font-size: ${({ theme }) => theme.font.size.base}; ${() => media.mobile`grid-template-columns: 1fr auto; span:nth-child(2), span:nth-child(3) { display: none; }`}`;
const Label = styled.label`display: flex; flex-direction: column; gap: 6px; margin-top: 20px; color: ${({ theme }) => theme.colors.textSecondary}; font-size: ${({ theme }) => theme.font.size.sm};`;
const Input = styled.input`height: 38px; padding: 0 12px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.md}; color: ${({ theme }) => theme.colors.textPrimary};`;
const Payment = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; ${() => media.mobile`grid-template-columns: 1fr;`}`;
const Pay = styled.button<{ $active: boolean }>`height: 48px; border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border}; border-radius: ${({ theme }) => theme.radius.md}; background: ${({ $active, theme }) => $active ? theme.colors.primarySoft : theme.colors.surface}; color: ${({ theme }) => theme.colors.textPrimary}; font-weight: ${({ theme }) => theme.font.weight.semibold};`;
const Total = styled.div`display: flex; justify-content: space-between; padding-top: 18px; margin-top: 18px; border-top: 1px solid ${({ theme }) => theme.colors.border}; font-size: ${({ theme }) => theme.font.size.xxl}; font-weight: ${({ theme }) => theme.font.weight.bold};`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = ((location.state as { cart?: CartItem[] } | null)?.cart ?? []) as CartItem[];
  const [payment, setPayment] = useState<'UPI' | 'Cash' | 'Card'>('UPI');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.rate * item.quantity, 0), [cart]);
  return <Layout><Header><Back type="button" onClick={() => navigate('/sales/new')} aria-label="Back to cart">‹</Back><Title>Checkout</Title></Header><Columns><div><Card><CardTitle>Order Summary ({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)</CardTitle>{cart.length ? cart.map((item) => <Item key={item.product.id}><span>{item.product.name}</span><span>{item.quantity}</span><span>₹{item.product.rate}</span><strong>₹{item.product.rate * item.quantity}</strong></Item>) : <p>No items in cart. Go back to add products.</p>}</Card><Card style={{ marginTop: 24 }}><CardTitle>Customer Info</CardTitle><Label>Name<Input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Walk-in customer" /></Label><Label>Phone number<Input value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="Optional" /></Label></Card><Card style={{ marginTop: 24 }}><CardTitle>Select Payment Method</CardTitle><Payment>{(['UPI', 'Cash', 'Card'] as const).map((method) => <Pay key={method} type="button" $active={payment === method} onClick={() => setPayment(method)}>{method}</Pay>)}</Payment></Card></div><Card><CardTitle>Payment Summary</CardTitle><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{subtotal}</span></div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}><span>Discount</span><span>- ₹0</span></div><Total><span>Total Payable</span><span>₹{subtotal}</span></Total><Button $fullWidth disabled={!cart.length} onClick={() => navigate('/sales')}>Complete Sale</Button><Button $fullWidth $variant="secondary" style={{ marginTop: 12 }} onClick={() => navigate('/sales/new')}>Back to Cart</Button></Card></Columns></Layout>;
}
