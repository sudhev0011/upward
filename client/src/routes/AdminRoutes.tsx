import { Routes, Route } from 'react-router-dom';
const AdminDashboard = () => <div className="p-8"><h1>Admin Dashboard</h1></div>;

const AdminRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
