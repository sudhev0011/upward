import { useEffect, type ReactNode } from 'react';
import { Loading } from '../ui/Loading';
import { type RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { useCheckAuthQuery } from '@/hooks/auth/useCheckAuth';
import { setCredentials, setAuthChecked,setActiveRole } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthChecked } = useAppSelector(
    (state: RootState) => state.auth
  );

  const { data, isPending } = useCheckAuthQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials(data.data));
    }

    if(data?.data?.roles){
      if(data?.data?.roles?.length === 1){
        dispatch(setActiveRole(data?.data?.roles[0]));
      }
    }

    dispatch(setAuthChecked())

  }, [data, dispatch]);

  if (isPending) {
    return <Loading />;
  }

  if (!isAuthChecked) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthProvider;