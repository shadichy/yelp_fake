
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../../schemas/enums';
import type { DecodedToken } from '../../types/jwt';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userType: UserType | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  userType: localStorage.getItem('token') ? (jwtDecode(localStorage.getItem('token')!) as DecodedToken).user_type : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state: AuthState, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
      state.userType = (jwtDecode(action.payload) as DecodedToken).user_type;
    },
    clearToken: (state: AuthState) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      state.userType = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
