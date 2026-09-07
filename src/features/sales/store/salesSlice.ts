import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import * as saleRepository from '../api/sale.repository';
import type { Sale, SalesState } from '../types/sale.types';

const initialState: SalesState = {
  sales: [],
  nextToken: null,
  status: 'idle',
  error: null,

  activeSale: null,
  activeSaleStatus: 'idle',
  activeSaleError: null,

  isVoiding: false,
  voidError: null,
};

export const fetchSales = createAsyncThunk('sales/fetchAll', async (_: void, { rejectWithValue }) => {
  try {
    return await saleRepository.getSales();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to load sales');
  }
});

export const fetchSaleById = createAsyncThunk(
  'sales/fetchById',
  async (saleId: string, { rejectWithValue }) => {
    try {
      return await saleRepository.getSaleById(saleId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load sale');
    }
  }
);

export const voidSale = createAsyncThunk('sales/void', async (saleId: string, { rejectWithValue }) => {
  try {
    return await saleRepository.voidSale(saleId);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to void sale');
  }
});

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearVoidError(state) {
      state.voidError = null;
    },
    // Lets the just-completed sale (returned by the POS create-sale call)
    // populate Sale Details instantly, without a redundant fetch.
    primeActiveSale(state, action: PayloadAction<Sale>) {
      state.activeSale = action.payload;
      state.activeSaleStatus = 'succeeded';
      state.activeSaleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sales = action.payload.items;
        state.nextToken = action.payload.nextToken;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load sales';
      })
      .addCase(fetchSaleById.pending, (state) => {
        state.activeSaleStatus = 'loading';
        state.activeSaleError = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.activeSaleStatus = 'succeeded';
        state.activeSale = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.activeSaleStatus = 'failed';
        state.activeSaleError = (action.payload as string) ?? 'Failed to load sale';
      })
      .addCase(voidSale.pending, (state) => {
        state.isVoiding = true;
        state.voidError = null;
      })
      .addCase(voidSale.fulfilled, (state, action) => {
        state.isVoiding = false;
        state.activeSale = action.payload;
        const summary = state.sales.find((sale) => sale.id === action.payload.id);
        if (summary) {
          summary.status = action.payload.status;
        }
      })
      .addCase(voidSale.rejected, (state, action) => {
        state.isVoiding = false;
        state.voidError = (action.payload as string) ?? 'Failed to void sale';
      })
      // Sign out: clear sales data so the next session never sees a
      // previous user's transactions.
      .addCase(resetApplicationState, () => initialState);
  },
});

export const { clearVoidError, primeActiveSale } = salesSlice.actions;
export default salesSlice.reducer;
