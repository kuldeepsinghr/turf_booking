import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TurfDetails from "./pages/TurfDetails";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import LoginPage from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/turf/:id" element={<TurfDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booking-success" element={<Booking />} />
      <Route path="/login" element={<LoginPage/>} />
    </Routes>
  );
}