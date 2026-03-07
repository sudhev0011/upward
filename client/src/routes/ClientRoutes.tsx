import { Routes, Route } from 'react-router-dom';
import ClientLayout from '@/layouts/ClientLayout';

const ClientRoutes = () => {
  return (
    <Routes>
        <Route element={<ClientLayout />}>
          
        </Route>
    </Routes>
  );
};

export default ClientRoutes;
