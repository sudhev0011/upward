import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponseData } from '@/interfaces/auth';
import { UserRole } from '@/constants/user-role';

interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  roles: UserRole[] | null;
  avatar: string | null;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthState {
  user: User | null;  
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  activeRole: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  activeRole: null
};

const setAuthData = (state: AuthState, data: AuthResponseData) => {
  state.isAuthenticated = data.isVerified && !data.isBlocked;

  state.user = {
    id: data.id,
    name: data.name,
    email: data.email,
    roles: data.roles,
    avatar: data?.avatar || null,
    isVerified: data.isVerified,
    isBlocked: data.isBlocked,
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<AuthResponseData >
    ) => {
      setAuthData(state, action.payload)
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    setActiveRole: (state, action)=>{
      state.activeRole = action.payload
    },
  },
});

export const { setCredentials, logout, setAuthChecked,clearCredentials, setActiveRole } = authSlice.actions;

export default authSlice.reducer;
