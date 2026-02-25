import { Routes, Route } from 'react-router-dom';
const ProviderDashboard = () => <div className="p-8"><h1>Provider Dashboard</h1></div>;

const ProviderRoutes = () => {
  return (
    <Routes>
        {/* All Provider specific routes go here */}
        <Route path="/" element={<ProviderDashboard />} />
    </Routes>
  );
};

export default ProviderRoutes;
