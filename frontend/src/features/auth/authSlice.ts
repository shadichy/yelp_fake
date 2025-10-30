
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../../schemas/enums';
import type { DecodedToken } from '../../types/jwt';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  userType: UserType | null;
  user: DecodedToken | null;
}

const token = localStorage.getItem('token');

const initialState: AuthState = {
  token,
  isAuthenticated: !!token,
  userType: token ? (jwtDecode<DecodedToken>(token) as DecodedToken).user_type : null,
  user: token ? (jwtDecode<DecodedToken>(token) as DecodedToken) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state: AuthState, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
      const decodedToken = jwtDecode<DecodedToken>(action.payload) as DecodedToken;
      state.userType = decodedToken.user_type;
      state.user = decodedToken;
    },
    clearToken: (state: AuthState) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      state.userType = null;
      state.user = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
