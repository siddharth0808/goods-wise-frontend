import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import { stockAdjusted } from '../../inventory/store/inventoryActions';
import * as saleRepository from '../api/sale.repository';
import { ApiError } from '../../../services/api/apiError';
import { primeActiveSale } from './salesSlice';
import type { CustomerDetails, Discount, PaymentMethod, PosState } from '../types/sale.types';
import type { Product } from '../../inventory/types/product.types';

const initialState: PosState = {
  cart: [],
  discount: null,
  discountAmount: null,
  subTotalAmt:null,
  totalAmt:null,
  paymentMethod: null,
  customer: {},
  createStatus: 'idle',
  createError: null,
  errorCode: undefined,
  completedSale: null,
};

// Adding a product increases its quantity if already in the cart (per
// spec: "Do not create a duplicate cart row") - see the `addToCart`
// reducer below.

export const confirmSale = createAsyncThunk(
  'pos/confirmSale',
  async (_: void, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { pos: PosState };
    const { cart, discount, paymentMethod, customer } = state.pos;

    if (!paymentMethod) {
      return rejectWithValue('Select a payment method to continue.');
    }
    if (cart.length === 0) {
      return rejectWithValue('Your cart is empty.');
    }

    try {
      const sale = await saleRepository.createSale({
        items: cart.map((item) => ({ productId: item.productId, productName: item.productName, quantity: item.quantity, rate: item.rate, unitPrice: item.unitPrice, currentStock: item.availableStock, total: Number(item.unitPrice * item.quantity) })),
        discount,
        discountAmount: discount?.value || 0,
        subTotalAmt: cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        totalAmt: cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) - (discount?.value || 0),
        paymentMethod,
        customerInfo: Object.values(customer).some((value) => value?.trim()) ? customer : null,
      });

      // The backend already decremented stock and wrote the SALE /
      // STOCK_OUT inventory transaction atomically; this just reflects
      // that result in the already-loaded product list so Inventory and
      // the POS grid don't show stale numbers without a refetch.
      sale.items.forEach((item) => {
        const product = (getState() as { inventory: { products: Product[] } }).inventory.products.find(
          (candidate) => candidate.id === item.productId
        );
        if (product) {
          const newStock =   product.currentStock - item.quantity;
          const newAmount =  newStock*product.rate
          dispatch(stockAdjusted({
            productId: item.productId, newStock,
            newAmount
          }));
        }
      });

      dispatch(primeActiveSale(sale));
      return sale;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue({ message: error.message, code: error.code });
      }
      return rejectWithValue({ message: 'Unable to complete sale. Your inventory was not changed.' });
    }
  }
);

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Pick<Product, 'id' | 'name' | 'mrp' | 'currentStock' | 'rate'> }>) {
      const { product } = action.payload;
      const existing = state.cart.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity < existing.availableStock) {
          existing.quantity += 1;
        }
        return;
      }
      if (product.currentStock <= 0) return;
      state.cart.push({
        productId: product.id || '',
        productName: product.name,
        unitPrice: product.mrp,
        quantity: 1,
        rate: product.rate,
        total: product.mrp,
        availableStock: product.currentStock,
      });
    },
    setCartItemQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.cart.find((cartItem) => cartItem.productId === action.payload.productId);
      if (!item) return;
      // Clamp to at least 1 - removing is a distinct, explicit action.
      item.quantity = Math.max(1, action.payload.quantity);
    },
    incrementCartItem(state, action: PayloadAction<string>) {
      const item = state.cart.find((cartItem) => cartItem.productId === action.payload);
      if (item) item.quantity += 1;
    },
    decrementCartItem(state, action: PayloadAction<string>) {
      const item = state.cart.find((cartItem) => cartItem.productId === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeCartItem(state, action: PayloadAction<string>) {
      state.cart = state.cart.filter((item) => item.productId !== action.payload);
    },
    setDiscount(state, action: PayloadAction<Discount | null>) {
      state.discount = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
      if (state.createStatus === 'failed') {
        state.createStatus = 'idle';
        state.createError = null;
      }
    },
    setCustomerDetails(state, action: PayloadAction<Partial<CustomerDetails>>) {
      state.customer = { ...state.customer, ...action.payload };
    },
    clearCreateError(state) {
      state.createError = null;
      state.errorCode = undefined;
      if (state.createStatus === 'failed') {
        state.createStatus = 'idle';
      }
    },
    // "New Sale" - clears everything so the next transaction starts clean.
    resetPos: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmSale.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
        state.errorCode = undefined;
      })
      .addCase(confirmSale.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.completedSale = action.payload;
      })
      .addCase(confirmSale.rejected, (state, action) => {
        state.createStatus = 'failed';
        const payload = action.payload as { message?: string; code?: string } | string | undefined;
        if (typeof payload === 'string') {
          state.createError = payload;
        } else {
          state.createError = payload?.message ?? 'Unable to complete sale.';
          state.errorCode = payload?.code;
        }
      })
      .addCase(resetApplicationState, () => initialState);
  },
});

export const {
  addToCart,
  setCartItemQuantity,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
  setDiscount,
  setPaymentMethod,
  setCustomerDetails,
  clearCreateError,
  resetPos,
} = posSlice.actions;
export default posSlice.reducer;
