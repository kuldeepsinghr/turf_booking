import { staticBookings } from "../../data/staticData";

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  const navLinks = [
  { id: "home", label: "Dashboard", icon: "🏠" },
  { id: "turfs", label: "My Turfs", icon: "⚽" },
  { id: "slots", label: "Slots", icon: "🕐" },
  { id: "bookings", label: "Bookings", icon: "📋" },
];
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-black/60 z-40 md:hidden ${
          mobileOpen ? "block" : "hidden"
        }`}
      />

      <aside
        className={`fixed md:sticky top-0 z-50 md:z-auto
  w-[228px] h-screen bg-[#0d1829] border-r border-white/10
  flex flex-col transition-transform duration-300
  ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-lg bg-green-500 flex items-center justify-center font-bold text-sm text-[#0b1120]">
              T
            </div>
            <div>
              <div className="font-bold text-sm text-[#f0f4f8]">TurfBook</div>
              <div className="text-[10px] text-[#64748b]">Owner Dashboard</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3">
          <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider px-3 mb-1">
            Menu
          </div>

          {navLinks.map(({ id, label, icon }) => (
            <div
              key={id}
              onClick={() => {
                setActive(id);
                setMobileOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1 text-sm font-medium cursor-pointer transition-all
              
              ${
                active === id
                  ? "bg-green-500/10 text-green-500 border-l-2 border-green-500"
                  : "text-[#64748b] hover:bg-white/5 hover:text-[#f0f4f8]"
              }
              `}
            >
              <span className="text-base">{icon}</span>

              {label}

              {id === "bookings" && (
                <span className="ml-auto text-[10px] font-bold px-2 py-[2px] rounded-full bg-green-500/15 text-green-500">
                  {
                    staticBookings.filter(
                      (b) => b.status === "confirmed"
                    ).length
                  }
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Owner Card */}
        <div className="px-2 py-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-md bg-green-500/15 flex items-center justify-center text-sm font-bold text-green-500">
              VP
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#f0f4f8] truncate">
                Vikram Patel
              </div>
              <div className="text-[11px] text-[#64748b]">Owner</div>
            </div>
          </div>

          <button
            onClick={() => alert("Logout")}
            className="w-full mt-2 py-2 rounded-lg text-xs text-[#64748b] flex items-center justify-center gap-1 hover:bg-white/5"
          >
            ↩ Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;