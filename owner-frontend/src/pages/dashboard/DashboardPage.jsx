import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import DashboardHome from "../../pages/dashboard/DashboardHome";
import SlotsPage from "./SlotsPage";
import BookingsPage from "./BookingsPage";
import TurfsPage from "./TurfsPage";

export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentPage = location.pathname.split("/")[2] || "home";

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      
      <Sidebar
        active={currentPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <Topbar page={currentPage} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto p-7">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="turfs" element={<TurfsPage />} />
            <Route path="slots" element={<SlotsPage />} />
            <Route path="bookings" element={<BookingsPage />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}