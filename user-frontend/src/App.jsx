import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TurfDetails from "./pages/TurfDetails";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/turf/:id" element={<TurfDetails />} />

      {/* 🔒 Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking-success"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />

      {/* Public */}
      <Route
  path="/login"
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  }
/>
    </Routes>
  );
}