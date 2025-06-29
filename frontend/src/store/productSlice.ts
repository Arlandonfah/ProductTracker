import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import type { AxiosError } from 'axios'; // Import pour le typage des erreurs

// Définition du type Product
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  averageRating?: number;
}

interface ProductState {
  items: Product[];
  loading: boolean;
  pagination: { 
    page: number; 
    total: number;
    last_page: number;
  };
}

interface ApiResponse {
  data: Product[];
  meta: {
    page: number;
    total: number;
    last_page: number;
  };
}

const initialState: ProductState = {
  items: [],
  loading: false,
  pagination: { page: 1, total: 0, last_page: 1 },
};

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse>(`/products?page=${page}`);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors du chargement des produits'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors de la suppression'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.pagination = {
          page: action.payload.meta.page,
          total: action.payload.meta.total,
          last_page: action.payload.meta.last_page,
        };
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(product => product.id !== action.payload);
      });
  },
});

export default productSlice.reducer;