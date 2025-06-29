import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../api'; 
import { AppDispatch } from './store';
import type { AxiosError } from 'axios'; // Import pour le typage des erreurs

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk pour l'authentification
export const login = (username: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  
  try {
    const response = await api.post('/auth/login', { username, password });
    dispatch(loginSuccess(response.data.token));
    localStorage.setItem('adminToken', response.data.token);
  } catch (err) {
    // Correction: Typage fort de l'erreur
    const error = err as AxiosError<{ error?: string }>;
    const errorMessage = error.response?.data?.error || 'Échec de la connexion';
    dispatch(loginFailure(errorMessage));
  }
};

export const checkAuth = () => (dispatch: AppDispatch) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    dispatch(loginSuccess(token));
  }
};

export default authSlice.reducer;