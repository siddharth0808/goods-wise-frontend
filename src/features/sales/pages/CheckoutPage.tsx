import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { FormField } from '../../../components/common/FormField';
import { Input } from '../../../components/common/Input';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearCreateError, confirmSale, decrementCartItem, incrementCartItem, removeCartItem, resetPos, setCartItemQuantity, setCustomerDetails, setDiscount, setPaymentMethod } from '../store/posSlice';
import { CartItemRow } from '../components/CartItemRow';
import { SaleSummary } from '../components/SaleSummary';
import { DiscountInput } from '../components/DiscountInput';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { SaleConfirmationDialog } from '../components/SaleConfirmationDialog';
import { SaleSuccessScreen } from '../components/SaleSuccessScreen';
import { SaleErrorScreen } from '../components/SaleErrorScreen';
import { ImportProgress } from '../../import/components/ImportProgress';
import { calculateDiscountAmount, calculateSubtotal, calculateTotal, calculateTotalUnits, isCartValid } from '../utils/saleMath';
import { media } from '../../../styles/breakpoints';
import type { ProcessingStep } from '../../import/types/import.types';
import { isValidEmail, isValidPhone } from '../../../utils/validation';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
  min-height: calc(100vh - 160px);
`;

const CenteredArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: ${({ theme }) => theme.spacing(6)};
  align-items: start;

  ${() => media.tabletDown`
    grid-template-columns: 1fr;
  `}
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const PaymentNotice = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

const CustomerFields = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const PROCESSING_STEP_LABELS = ['Validating products', 'Checking stock', 'Completing sale'];

function buildSteps(progress: number): ProcessingStep[] {
  return PROCESSING_STEP_LABELS.map((label, index) => ({
    label,
    state: index < progress ? 'done' : index === progress ? 'active' : 'pending',
  }));
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, discount, paymentMethod, customer, createStatus, createError, errorCode, completedSale } = useAppSelector(
    (state) => state.pos
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentMissing, setPaymentMissing] = useState(false);
  const [customerErrors, setCustomerErrors] = useState<{ phone?: string; email?: string }>({});
  const [processingProgress, setProcessingProgress] = useState(0);

  // A cart-less checkout can only happen via a direct URL visit or a page
  // refresh (Redux state is in-memory only) - send the cashier back to
  // build a sale rather than showing an empty checkout.
  useEffect(() => {
    if (cart.length === 0 && createStatus === 'idle') {
      navigate('/sales/new', { replace: true });
    }
  }, [cart.length, createStatus, navigate]);

  useEffect(() => {
    if (createStatus === 'loading') {
      const timer = setInterval(() => {
        setProcessingProgress((prev) => Math.min(prev + 1, PROCESSING_STEP_LABELS.length - 1));
      }, 700);
      return () => clearInterval(timer);
    }
  }, [createStatus]);

  const subtotal = calculateSubtotal(cart);
  const discountAmount = calculateDiscountAmount(subtotal, discount);
  const total = calculateTotal(subtotal, discountAmount);
  const totalUnits = calculateTotalUnits(cart);
  const cartValid = isCartValid(cart);

  const handleOpenConfirm = () => {
    if (!paymentMethod) {
      setPaymentMissing(true);
      return;
    }
    const nextCustomerErrors: { phone?: string; email?: string } = {};
    if (customer.phone?.trim() && !isValidPhone(customer.phone)) {
      nextCustomerErrors.phone = 'Enter a valid phone number.';
    }
    if (customer.email?.trim() && !isValidEmail(customer.email)) {
      nextCustomerErrors.email = 'Enter a valid email address.';
    }
    setCustomerErrors(nextCustomerErrors);
    if (Object.keys(nextCustomerErrors).length > 0) return;
    setPaymentMissing(false);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setProcessingProgress(0);
    dispatch(confirmSale());
  };

  const handleNewSale = () => {
    dispatch(resetPos());
    navigate('/sales/new');
  };

  const step = useMemo(() => {
    if (createStatus === 'succeeded' && completedSale) return 'success';
    if (createStatus === 'loading') return 'processing';
    if (createStatus === 'failed') return 'failed';
    return 'checkout';
  }, [createStatus, completedSale]);

  if (step === 'processing') {
    return (
      <Content>
        <CenteredArea>
          <ImportProgress
            title="Processing Sale"
            message="Validating your cart, checking stock, and recording the sale. This won't take long."
            steps={buildSteps(processingProgress)}
          />
        </CenteredArea>
      </Content>
    );
  }

  if (step === 'success' && completedSale) {
    return (
      <Content>
        <CenteredArea>
          <SaleSuccessScreen
            sale={completedSale}
            onViewSaleDetails={() => {
              const saleId = completedSale.id;
              dispatch(resetPos());
              navigate(`/sales/${saleId}`);
            }}
            onNewSale={handleNewSale}
          />
        </CenteredArea>
      </Content>
    );
  }

  if (step === 'failed') {
    return (
      <Content>
        <CenteredArea>
          <SaleErrorScreen
            message={createError ?? 'Unable to complete sale.'}
            errorCode={errorCode}
            onBackToCart={() => {
              dispatch(clearCreateError());
              navigate('/sales/new');
            }}
            onTryAgain={() => dispatch(clearCreateError())}
          />
        </CenteredArea>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Checkout" subtitle="Review the sale before completing payment" onBack={() => navigate('/sales/new')} />

      <SplitLayout>
        <Card>
          <SectionTitle>Order Summary ({cart.length} items)</SectionTitle>
          <div>
            <div> Product</div>
            <div> Quantity</div>
            <div> Price</div>
            <div> Total</div>
            {cart.map((item) => (
              <>
                <div>{item.productName}</div>
                <div>{item.quantity}</div>
                <div>${item.unitPrice.toFixed(2)}</div>
                <div>${(item.unitPrice * item.quantity).toFixed(2)}</div>
              </>
            ))}
          </div>
        </Card>

        <RightColumn>
          <Card>
            <SectionTitle>Customer Details (Optional)</SectionTitle>
            <CustomerFields>
              <FormField label="Name" htmlFor="customer-name">
                <Input
                  id="customer-name"
                  value={customer.name ?? ''}
                  onChange={(event) => dispatch(setCustomerDetails({ name: event.target.value }))}
                  placeholder="Customer name"
                />
              </FormField>
              <FormField label="Phone" htmlFor="customer-phone" error={customerErrors.phone}>
                <Input
                  id="customer-phone"
                  type="tel"
                  value={customer.phone ?? ''}
                  onChange={(event) => {
                    dispatch(setCustomerDetails({ phone: event.target.value }));
                    if (customerErrors.phone) setCustomerErrors((errors) => ({ ...errors, phone: undefined }));
                  }}
                  placeholder="Customer phone"
                  $hasError={Boolean(customerErrors.phone)}
                />
              </FormField>
              <FormField label="Email" htmlFor="customer-email" error={customerErrors.email}>
                <Input
                  id="customer-email"
                  type="email"
                  value={customer.email ?? ''}
                  onChange={(event) => {
                    dispatch(setCustomerDetails({ email: event.target.value }));
                    if (customerErrors.email) setCustomerErrors((errors) => ({ ...errors, email: undefined }));
                  }}
                  placeholder="Customer email"
                  $hasError={Boolean(customerErrors.email)}
                />
              </FormField>
            </CustomerFields>
          </Card>

          <Card>
            <SectionTitle>Discount</SectionTitle>
            <DiscountInput discount={discount} onApply={(value) => dispatch(setDiscount(value))} />
          </Card>

          <Card>
            <SectionTitle>Payment Method</SectionTitle>
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={(method) => {
                setPaymentMissing(false);
                dispatch(setPaymentMethod(method));
              }}
            />
            {paymentMissing && <PaymentNotice role="alert">Select a payment method to continue.</PaymentNotice>}
          </Card>

          <Card>
            <SectionTitle>Final Total</SectionTitle>
            <SaleSummary subtotal={subtotal} discountAmount={discountAmount} total={total} totalLabel="Final Total" />
            <Button type="button" $fullWidth disabled={!cartValid} onClick={handleOpenConfirm}>
              Complete Sale
            </Button>
            <Button type="button" $variant="ghost" $fullWidth onClick={() => navigate('/sales/new')}>
              Back to Cart
            </Button>
          </Card>
        </RightColumn>
      </SplitLayout>

      {showConfirm && paymentMethod && (
        <SaleConfirmationDialog
          productCount={cart.length}
          totalUnits={totalUnits}
          subtotal={subtotal}
          discountAmount={discountAmount}
          total={total}
          paymentMethod={paymentMethod}
          isSubmitting={false}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            handleConfirm();
          }}
        />
      )}
    </Content>
  );
}
