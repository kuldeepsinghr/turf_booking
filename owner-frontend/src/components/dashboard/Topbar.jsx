function Topbar({ page, setMobileOpen }) {
  const titles = {
    home: "Dashboard",
    turfs: "My Turfs",
    slots: "Slots",
    bookings: "Bookings",
  };

  return (
    <header className="sticky top-0 z-40 h-[60px] flex items-center justify-between px-7 border-b border-white/10 bg-[#0d1829]">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-[#64748b] text-xl px-1 hover:text-white"
        >
          ☰
        </button>

        {/* Title */}
        <span className="font-semibold text-base text-[#f0f4f8]">
          {titles[page]}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          
          {/* Bell */}
          <button className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-base flex items-center justify-center hover:bg-white/10">
            🔔
          </button>

          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-green-500 border-2 border-[#0d1829]" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;