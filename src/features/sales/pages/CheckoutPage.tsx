import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearCreateError, confirmSale, decrementCartItem, incrementCartItem, removeCartItem, resetPos, setCartItemQuantity, setDiscount, setPaymentMethod } from '../store/posSlice';
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
  const { cart, discount, paymentMethod, createStatus, createError, errorCode, completedSale } = useAppSelector(
    (state) => state.pos
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentMissing, setPaymentMissing] = useState(false);
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
          <SectionTitle>Sale Items</SectionTitle>
          <div>
            {cart.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onIncrement={() => dispatch(incrementCartItem(item.productId))}
                onDecrement={() => dispatch(decrementCartItem(item.productId))}
                onChangeQuantity={(quantity) => dispatch(setCartItemQuantity({ productId: item.productId, quantity }))}
                onRemove={() => dispatch(removeCartItem(item.productId))}
              />
            ))}
          </div>
        </Card>

        <RightColumn>
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
