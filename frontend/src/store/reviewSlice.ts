import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';
import type { AxiosError } from 'axios'; // Import pour le typage des erreurs

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  productId: number;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  filters: {
    sort: 'newest' | 'highest' | 'lowest';
    search: string;
  };
  distribution: {
    rating: number;
    count: number;
  }[];
  currentProductId: number | null;
}

interface ApiError {
  message: string;
  response?: {
    data?: {
      error?: string;
    };
  };
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  filters: {
    sort: 'newest',
    search: ''
  },
  distribution: [],
  currentProductId: null
};

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async ({ 
    productId, 
    sort, 
    search 
  }: { 
    productId: number; 
    sort?: string; 
    search?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`, {
        params: { sort, search }
      });
      return {
        productId,
        reviews: response.data
      };
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(
        error.response?.data?.error || 'Erreur de chargement des avis'
      );
    }
  }
);

export const fetchRatingDistribution = createAsyncThunk(
  'reviews/fetchRatingDistribution',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/ratings/distribution`);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(
        error.response?.data?.error || 'Erreur de chargement de la distribution'
      );
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async ({ 
    productId, 
    rating, 
    comment 
  }: {
    productId: number;
    rating: number;
    comment: string
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', {
        productId,
        rating,
        comment
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      return rejectWithValue(
        error.response?.data?.error || 'Erreur lors de l\'ajout de l\'avis'
      );
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{
      sort?: 'newest' | 'highest' | 'lowest';
      search?: string
    }>) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetReviews: (state) => {
      state.reviews = [];
      state.distribution = [];
      state.currentProductId = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Product Reviews
    builder.addCase(fetchProductReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
      state.currentProductId = action.payload.productId;
    });
    builder.addCase(fetchProductReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string; 
    });

    // Fetch Rating Distribution
    builder.addCase(fetchRatingDistribution.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchRatingDistribution.fulfilled, (state, action) => {
      state.distribution = action.payload;
    });
    builder.addCase(fetchRatingDistribution.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Add Review
    builder.addCase(addReview.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addReview.fulfilled, (state, action) => {
      // Ajouter le nouvel avis au début de la liste
      state.reviews = [action.payload, ...state.reviews];

      // Mettre à jour la distribution des notes
      const ratingIndex = state.distribution.findIndex(
        d => d.rating === action.payload.rating
      );

      if (ratingIndex !== -1) {
        state.distribution[ratingIndex].count += 1;
      } else {
        state.distribution.push({
          rating: action.payload.rating,
          count: 1
        });
        state.distribution.sort((a, b) => a.rating - b.rating);
      }
    });
    builder.addCase(addReview.rejected, (state, action) => {
      state.error = action.payload as string; 
    });
  }
});

export const { setFilters, resetReviews } = reviewSlice.actions;

export default reviewSlice.reducer;