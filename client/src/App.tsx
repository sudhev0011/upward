import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import ProviderRoutes from "./routes/ProviderRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/*" element={<ClientRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/provider/*" element={<ProviderRoutes />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    </Router>
  );
};

export default App;
