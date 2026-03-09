import { useEffect, type ReactNode } from 'react';
import { Loading } from '../ui/Loading';
import { type RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckAuthQuery } from '@/hooks/auth/useCheckAuth';
import { setCredentials, setAuthChecked } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector(
    (state: RootState) => state.auth
  );

  const { data, isPending } = useCheckAuthQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials(data.data));
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