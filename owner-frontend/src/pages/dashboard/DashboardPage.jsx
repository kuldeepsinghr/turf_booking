import { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

import DashboardHome from "./DashboardHome";
import TurfsPage from "./TurfsPage";
import SlotsPage from "./SlotsPage";
import BookingsPage from "./BookingsPage";

// import "../../styles/dashboard.css";

export default function DashboardPage() {
  const [page, setPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const pages = {
    home: DashboardHome,
    turfs: TurfsPage,
    slots: SlotsPage,
    bookings: BookingsPage,
  };

  const PageComponent = pages[page];

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      
      <Sidebar
        active={page}
        setActive={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <Topbar page={page} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto p-7">
          <PageComponent setPage={setPage} />
        </main>

      </div>
    </div>
  );
}