import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import Payments from "./pages/Payments";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Payment initiation page */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        {/* MamoPay return routes */}
        <Route path="/payments/success" element={<PaymentSuccessful />} />

        <Route path="/payments/failed" element={<PaymentFailed />} />
      </Routes>

      <Toaster position="top-center" richColors closeButton expand={false} />
    </BrowserRouter>
  );
}

export default App;
