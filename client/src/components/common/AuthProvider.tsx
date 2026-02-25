import type { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}


import React, { useEffect } from 'react';
import { Loading } from '../ui/Loading';
import { type RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckAuthQuery } from '@/hooks/auth/useCheckAuth';
import { setCredentials } from '@/store/slices/authSlice';


const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const dispatch = useDispatch();
  const {user} = useSelector((state: RootState)=> state.auth);
  const {data} = useCheckAuthQuery();
    console.log(data)
  if(data?.data){
    dispatch(setCredentials(data.data))
  }
  if (!user) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthProvider;