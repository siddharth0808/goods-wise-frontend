import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { resetApplicationState } from '../../../app/store/actions';
import * as productRepository from '../api/product.repository';
import { stockAdjusted } from './inventoryActions';
import type { InventoryState, Product } from '../types/product.types';

const initialState: InventoryState = {
  products: [],
  status: 'idle',
  error: null,
  isCreating: false,
  createError: null,
  productDetailStatus: 'idle',
  productDetailError: null,
  isUpdating: false,
  updateError: null,
};

function upsertProduct(products: Product[], product: Product): Product[] {
  const index = products.findIndex((existing) => existing.id === product.id);
  if (index === -1) {
    return [product, ...products];
  }
  const next = [...products];
  next[index] = product;
  return next;
}

export const fetchProducts = createAsyncThunk(
  'inventory/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await productRepository.getProducts();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load products');
    }
  }
);

// Used by ProductDetailsPage/AdjustStockPage/InventoryHistoryPage so a
// direct/refreshed link works even if the list hasn't been fetched yet.
export const fetchProductById = createAsyncThunk(
  'inventory/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      return await productRepository.getProductById(productId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'inventory/createProduct',
  async (payload: Product, { rejectWithValue }) => {
    try {
      return await productRepository.createProduct(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'inventory/updateProduct',
  async (
    { productId, payload }: { productId: string; payload: Product },
    { rejectWithValue }
  ) => {
    try {
      return await productRepository.updateProduct(productId, payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (
    { productId }: { productId: string },
    { rejectWithValue }
  ) => {
    try {
      return await productRepository.deleteProduct(productId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete product');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearCreateError(state) {
      state.createError = null;
    },
    clearUpdateError(state) {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.productDetailStatus = 'loading';
        state.productDetailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetailStatus = 'succeeded';
        state.products = upsertProduct(state.products, action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailStatus = 'failed';
        state.productDetailError = (action.payload as string) ?? 'Failed to load product';
      })
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = (action.payload as string) ?? 'Failed to add product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.products = upsertProduct(state.products, action.payload);
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = (action.payload as string) ?? 'Failed to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.products = state.products.filter(product => product.id !== action.meta.arg.productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = (action.payload as string) ?? 'Failed to delete product';
      })
      // Dispatched by transactionSlice once a stock adjustment is saved -
      // keeps the product list/detail cache in sync without a refetch.
      .addCase(stockAdjusted, (state, action) => {
        const product = state.products.find((item) => item.id === action.payload.productId);
        if (product) {
          product.currentStock = action.payload.newStock;
          product.amount =  action.payload.newAmount;
        }
      })
      // Sign out: clear the product list so the next user never sees a
      // previous session's inventory.
      .addCase(resetApplicationState, () => initialState);
  },
});

export const { clearCreateError, clearUpdateError } = inventorySlice.actions;
export default inventorySlice.reducer;
