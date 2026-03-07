  import { Routes, Route } from "react-router-dom";
  import ClientRoutes from "./routes/ClientRoutes";
  import ProviderRoutes from "./routes/ProviderRoutes";
  import AdminRoutes from "./routes/AdminRoutes";
  import AutoScroller from "./components/AutoScroller";
  import PublicRoutes from "./routes/PublicRoutes";
  
  const App = () => {
  return (
    <>
      <AutoScroller />
      <Routes>
        <Route path="/client/*" element={<ClientRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/provider/*" element={<ProviderRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
};

  export default App;
