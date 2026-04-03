function StatCard({ icon, label, value, sub, color = "#22c55e", delay = 0 }) {
  return (
    <div
      className="card-hover fade-up bg-[#0f1e32] border border-white/10 rounded-2xl px-5 py-5"
      style={{ animationDelay: `${delay}ms` }} // ✅ only dynamic (allowed)
    >
      {/* Top */}
      <div className="flex items-start justify-between mb-3.5">
        
        {/* Icon Box */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}30`,
          }}
        >
          {icon}
        </div>

        {/* Tag */}
        <span className="text-[10px] text-[#64748b] bg-white/5 border border-white/10 rounded-full px-2.5 py-[3px]">
          This month
        </span>
      </div>

      {/* Value */}
      <div className="text-[28px] font-bold text-[#f0f4f8] leading-none">
        {value}
      </div>

      {/* Label */}
      <div className="text-xs text-[#64748b] mt-1.5">
        {label}
      </div>

      {/* Sub */}
      {sub && (
        <div
          className="text-[11px] mt-1.5 flex items-center gap-1"
          style={{ color }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export default StatCard;