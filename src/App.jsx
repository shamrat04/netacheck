import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import PoliticianList from "./features/politicians/PoliticianList";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
   <Router>
  <Routes>
    <Route path="/login" element={<LoginPage />} /> {/* changed from "/" to "/login" */}
    
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="ratings" element={<PoliticianList />} />
    </Route>
  </Routes>
</Router>

  );
}

export default App;
