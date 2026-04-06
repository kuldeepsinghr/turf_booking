import { useState, useMemo, useEffect, useCallback } from "react";
import { Btn, Field, Input, Select } from "../../components/dashboard/UI";
import Modal from "../../components/dashboard/Modal";
import { useSlot } from "../../context/SlotContext";
import { useTurf } from "../../context/TurfContext";

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

/** Format a Date → "YYYY-MM-DD" using LOCAL time (not UTC) — fixes the +5:30 off-by-one bug */
function dateStr(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

/**
 * Return the Monday of the week containing today, shifted by `offset` weeks.
 * Fix: normalise getDay() so Mon=0…Sun=6 via (getDay() + 6) % 7
 */
function getWeekDates(offset) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dowMon = (today.getDay() + 6) % 7;
  const mon = new Date(today);
  mon.setDate(today.getDate() - dowMon + offset * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
}

function formatWeekLabel(days) {
  const s = days[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const e = days[6].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return `${s} – ${e}`;
}

/**
 * "HH:MM" or "HH:MM:SS" → total minutes since midnight.
 * DB returns start_time as "HH:MM:SS" — we slice to 5 chars first.
 */
function toMins(t) {
  if (!t) return 0;
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

/** total minutes → "HH:MM" */
function fromMins(m) {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function generateSlotTimes(startTime, endTime, gapMins) {
  const startM = toMins(startTime);
  const endM   = toMins(endTime);
  const result = [];
  for (let cur = startM; cur + gapMins <= endM; cur += gapMins) {
    result.push({ start: fromMins(cur), end: fromMins(cur + gapMins) });
  }
  return result;
}

/**
 * Overlap check against a list of normalised slots.
 * Accepts both DB shape (start_time/end_time) and normalised shape (start/end).
 */
function hasOverlapInList(slotList, start, end) {
  const s = toMins(start);
  const e = toMins(end);
  return slotList.some((x) => {
    const xs = toMins(x.start_time ?? x.start);
    const xe = toMins(x.end_time   ?? x.end);
    return xs < e && xe > s;
  });
}

/**
 * Normalise a raw DB slot → UI shape.
 * DB:  slot_id, start_time, end_time, is_booked, booked_by, price, date
 * UI:  id,      start,      end,      booked,    bookedBy,  price, date
 */
function normaliseSlot(s) {
  return {
    id:       s.slot_id,
    start:    (s.start_time ?? s.start)?.slice(0, 5),
    end:      (s.end_time   ?? s.end)?.slice(0, 5),
    price:    Number(s.price) || 0,
    booked:   Boolean(s.is_booked ?? s.booked),
    bookedBy: s.booked_by ?? s.bookedBy ?? null,
    date:     s.date,
  };
}

const DOWS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);

const GAP_OPTIONS = [
  { label: "30 min",    value: "30"  },
  { label: "45 min",    value: "45"  },
  { label: "1 hour",    value: "60"  },
  { label: "1.5 hours", value: "90"  },
  { label: "2 hours",   value: "120" },
];

/* ═══════════════════════════════════════════════════════════
   SlotBlock — inline price editing, unchanged UI
═══════════════════════════════════════════════════════════ */
function SlotBlock({ slot, isPast, isToday, onDelete, onPriceChange }) {
  const [editing, setEditing]   = useState(false);
  const [priceVal, setPriceVal] = useState(String(slot.price));

  const state = isPast ? "past" : slot.booked ? "booked" : "open";
  const styles = {
    open:   "bg-green-500/10 border-green-500/25 hover:bg-green-500/18",
    booked: "bg-blue-500/10 border-blue-500/25",
    past:   "bg-white/[0.02] border-white/[0.06] opacity-50",
  };
  const priceColor  = { open: "text-green-400", booked: "text-blue-400", past: "text-[#475569]" };
  const dotColor    = { open: "bg-green-400",   booked: "bg-blue-400",   past: "bg-[#475569]"  };
  const statusLabel = { open: "Available",       booked: "Booked",        past: "Past"           };
  const canEditPrice = !slot.booked && !isPast;

  const commitPrice = () => {
    const n = Number(priceVal);
    if (!isNaN(n) && n > 0) onPriceChange(slot.id, n);
    setEditing(false);
  };

  return (
    <div className={`group relative rounded-xl border px-3 py-2.5 transition-all ${styles[state]}`}>
      <div className="text-[11px] font-mono text-[#94a3b8] font-medium tracking-tight">
        {slot.start}–{slot.end}
      </div>

      {editing ? (
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-xs text-[#64748b]">₹</span>
          <input
            autoFocus
            type="number"
            value={priceVal}
            onChange={(e) => setPriceVal(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={(e) => {
              if (e.key === "Enter")  commitPrice();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-20 text-sm font-semibold bg-white/10 border border-white/20 rounded-md px-1.5 py-0.5 text-green-300 outline-none focus:border-green-400"
          />
        </div>
      ) : (
        <div
          className={`text-sm font-semibold mt-0.5 ${priceColor[state]} ${canEditPrice ? "cursor-pointer" : ""}`}
          title={canEditPrice ? "Click to edit price" : undefined}
          onClick={() => { if (canEditPrice) { setPriceVal(String(slot.price)); setEditing(true); } }}
        >
          ₹{slot.price.toLocaleString("en-IN")}
          {canEditPrice && (
            <span className="ml-1 text-[9px] text-[#475569] opacity-0 group-hover:opacity-100 transition">✎</span>
          )}
        </div>
      )}

      {slot.booked && (
        <div className="text-[11px] text-blue-400 mt-0.5 truncate">👤 {slot.bookedBy}</div>
      )}
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor[state]}`} />
        <span className="text-[10px] text-[#64748b] font-medium">{statusLabel[state]}</span>
      </div>

      {!slot.booked && !isPast && (
        <button
          onClick={() => onDelete(slot.id)}
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-red-500/10 text-red-400 text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-red-500/20"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
function SlotsPage() {

  /* ── context ──────────────────────────────────────────── */
  const { turfs }                                            = useTurf();
  const { fetchSlots, createSlots, updateSlot, deleteSlot } = useSlot();

  /* ── local state ──────────────────────────────────────── */
  /**
   * slotMap — keyed as "turfId|YYYY-MM-DD" → NormalisedSlot[]
   * Keeps slots for every turf+date we've fetched so switching
   * turfs / navigating weeks doesn't re-flash the skeleton.
   */
  const [slotMap,       setSlotMap]      = useState({});
  const [loadingKeys,   setLoadingKeys]  = useState(new Set());
  const [activeTurfId,  setActiveTurfId] = useState(null);
  const [weekOffset,    setWeekOffset]   = useState(0);

  const [modalMode,  setModalMode]  = useState(null); // null | "single" | "bulk"
  const [singleForm, setSingleForm] = useState({});
  const [bulkForm,   setBulkForm]   = useState({});
  const [errors,     setErrors]     = useState([]);
  const [saving,     setSaving]     = useState(false);

  /* ── derived ──────────────────────────────────────────── */
  const days       = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const activeTurf = useMemo(() => turfs.find((t) => t.id === activeTurfId) ?? null, [turfs, activeTurfId]);

  // Initialise first turf once turfs load from context
  useEffect(() => {
    if (turfs.length && activeTurfId === null) setActiveTurfId(turfs[0].id);
  }, [turfs, activeTurfId]);

  /* ── fetch 7 days in parallel ─────────────────────────── */
  const fetchWeek = useCallback(async (turfId, weekDays) => {
    if (!turfId) return;
    await Promise.all(
      weekDays.map(async (d) => {
        const ds  = dateStr(d);
        const key = `${turfId}|${ds}`;
        setLoadingKeys((prev) => new Set(prev).add(key));
        try {
          // fetchSlots in SlotContext returns res.data.slots array
          // We call it and collect the return value directly here
          // instead of reading from context.slots (which is shared state)
          const res = await fetchSlots(turfId, ds);
          const normalised = (Array.isArray(res) ? res : []).map(normaliseSlot);
          setSlotMap((prev) => ({ ...prev, [key]: normalised }));
        } catch (_) {
          // toast already shown by context
        } finally {
          setLoadingKeys((prev) => { const n = new Set(prev); n.delete(key); return n; });
        }
      })
    );
  }, [fetchSlots]);

  useEffect(() => {
    fetchWeek(activeTurfId, days);
  }, [activeTurfId, days, fetchWeek]);

  /* ── slot accessors ───────────────────────────────────── */
  const slotsForDate = useCallback((ds) =>
    (slotMap[`${activeTurfId}|${ds}`] ?? [])
      .slice()
      .sort((a, b) => toMins(a.start) - toMins(b.start)),
  [slotMap, activeTurfId]);

  const allActiveTurfSlots = useMemo(() =>
    Object.entries(slotMap)
      .filter(([k]) => k.startsWith(`${activeTurfId}|`))
      .flatMap(([, arr]) => arr),
  [slotMap, activeTurfId]);

  /* ── sidebar stats ────────────────────────────────────── */
  const sidebarStats = useMemo(() => {
    const todaySlots = slotsForDate(dateStr(TODAY));
    const allBooked  = allActiveTurfSlots.filter((s) => s.booked);
    return {
      openToday:   todaySlots.filter((s) => !s.booked).length,
      bookedToday: todaySlots.filter((s) =>  s.booked).length,
      revenue:     allBooked.reduce((a, s) => a + s.price, 0),
    };
  }, [slotsForDate, allActiveTurfSlots]);

  /* ── modals ───────────────────────────────────────────── */
  const defaultPrice = activeTurf?.price ? String(activeTurf.price) : "";

  const openSingle = (date = "") => {
    setSingleForm({ date, start: "06:00", end: "07:00", price: defaultPrice });
    setErrors([]);
    setModalMode("single");
  };
  const openBulk = () => {
    setBulkForm({ date: "", start: "06:00", end: "22:00", gap: "60", price: defaultPrice });
    setErrors([]);
    setModalMode("bulk");
  };
  const closeModal = () => { setModalMode(null); setErrors([]); };

  const setSF = (f) => (e) => setSingleForm((p) => ({ ...p, [f]: e.target.value }));
  const setBF = (f) => (e) => setBulkForm((p)   => ({ ...p, [f]: e.target.value }));

  /* ── bulk preview ─────────────────────────────────────── */
  const bulkPreview = useMemo(() => {
    if (!bulkForm.date || !bulkForm.price) return [];
    if (toMins(bulkForm.start) >= toMins(bulkForm.end)) return [];
    return generateSlotTimes(bulkForm.start, bulkForm.end, Number(bulkForm.gap));
  }, [bulkForm.start, bulkForm.end, bulkForm.gap, bulkForm.date, bulkForm.price]);

  const slotsOnBulkDate = useMemo(
    () => slotsForDate(bulkForm.date),
    [slotsForDate, bulkForm.date]
  );

  const bulkConflicts = useMemo(
    () => bulkPreview.filter((t) => hasOverlapInList(slotsOnBulkDate, t.start, t.end)),
    [bulkPreview, slotsOnBulkDate]
  );
  const bulkNew = bulkPreview.length - bulkConflicts.length;

  /* ── helper: refresh a single date from API ───────────── */
  const refreshDate = useCallback(async (turfId, ds) => {
    const key = `${turfId}|${ds}`;
    setLoadingKeys((prev) => new Set(prev).add(key));
    try {
      const res = await fetchSlots(turfId, ds);
      const normalised = (Array.isArray(res) ? res : []).map(normaliseSlot);
      setSlotMap((prev) => ({ ...prev, [key]: normalised }));
    } finally {
      setLoadingKeys((prev) => { const n = new Set(prev); n.delete(key); return n; });
    }
  }, [fetchSlots]);

  /* ── save single ──────────────────────────────────────── */
  const saveSingle = async () => {
    const errs = [];
    if (!singleForm.date)  errs.push("Date is required.");
    if (!singleForm.price) errs.push("Price is required.");
    if (toMins(singleForm.start) >= toMins(singleForm.end))
      errs.push("Start time must be before end time.");
    if (hasOverlapInList(slotsForDate(singleForm.date), singleForm.start, singleForm.end))
      errs.push(`A slot already exists that overlaps ${singleForm.start}–${singleForm.end} on this date.`);
    if (errs.length) { setErrors(errs); return; }

    setSaving(true);
    // API expects: { slots: [{ date, start_time, end_time, price }] }
    const ok = await createSlots(activeTurfId, [{
      date:       singleForm.date,
      start_time: singleForm.start,
      end_time:   singleForm.end,
      price:      Number(singleForm.price),
    }]);
    setSaving(false);

    if (ok) {
      await refreshDate(activeTurfId, singleForm.date);
      closeModal();
    }
  };

  /* ── save bulk ────────────────────────────────────────── */
  const saveBulk = async () => {
    const errs = [];
    if (!bulkForm.date)  errs.push("Date is required.");
    if (!bulkForm.price) errs.push("Price is required.");
    if (toMins(bulkForm.start) >= toMins(bulkForm.end))
      errs.push("Start time must be before end time.");
    if (bulkPreview.length === 0) errs.push("No slots can be generated — check your times and gap.");
    if (bulkNew === 0)            errs.push("All generated slots already exist for this date.");
    if (errs.length) { setErrors(errs); return; }

    // Filter out conflicts, map to API shape
    const toAdd = bulkPreview
      .filter((t) => !hasOverlapInList(slotsOnBulkDate, t.start, t.end))
      .map((t) => ({
        date:       bulkForm.date,
        start_time: t.start,
        end_time:   t.end,
        price:      Number(bulkForm.price),
      }));

    setSaving(true);
    const ok = await createSlots(activeTurfId, toAdd);
    setSaving(false);

    if (ok) {
      await refreshDate(activeTurfId, bulkForm.date);
      closeModal();
    }
  };

  /* ── delete ───────────────────────────────────────────── */
  const handleDelete = async (slotId, date) => {
    if (!window.confirm("Delete this slot?")) return;
    await deleteSlot(slotId);
    // Optimistic removal — no need to re-fetch
    const key = `${activeTurfId}|${date}`;
    setSlotMap((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((s) => s.id !== slotId),
    }));
  };

  /* ── update price inline ──────────────────────────────── */
  const handlePriceChange = async (slotId, newPrice, date) => {
    const ok = await updateSlot(slotId, { price: newPrice });
    if (ok) {
      const key = `${activeTurfId}|${date}`;
      setSlotMap((prev) => ({
        ...prev,
        [key]: (prev[key] ?? []).map((s) => s.id === slotId ? { ...s, price: newPrice } : s),
      }));
    }
  };

  /* ── column visual helper ─────────────────────────────── */
  function getColStyle(d) {
    const todayS = dateStr(TODAY);
    const ds     = dateStr(d);
    const isPast = d < TODAY;
    if (ds === todayS) return {
      header: "bg-green-500/8 border-b-2 border-b-green-500/50",
      body:   "bg-green-500/[0.03]",
    };
    if (isPast) return { header: "opacity-50", body: "bg-[#0a1520]/50" };
    return { header: "", body: "" };
  }

  /* ════════════════════════════════════════════════════════
     RENDER — identical markup to original
  ════════════════════════════════════════════════════════ */
  return (
    <div className="fade-in flex flex-col" style={{ margin: "-1.5rem", height: "calc(100vh - 56px)" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0f1e32] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-[#f0f4f8]">Slots</h2>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setWeekOffset((w) => w - 1)} className="px-2.5 py-1 text-xs border border-white/10 rounded-lg text-[#94a3b8] hover:bg-white/5 transition">‹</button>
            <span className="text-xs text-[#64748b] min-w-[150px] text-center">{formatWeekLabel(days)}</span>
            <button onClick={() => setWeekOffset((w) => w + 1)} className="px-2.5 py-1 text-xs border border-white/10 rounded-lg text-[#94a3b8] hover:bg-white/5 transition">›</button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-2.5 py-1 text-xs border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/10 transition ml-1"
            >
              Today
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openBulk}
            className="px-3 py-1.5 text-xs rounded-lg border border-white/15 text-[#94a3b8] hover:bg-white/5 hover:text-white transition font-medium"
          >
            ⚡ Auto-generate
          </button>
          <Btn onClick={() => openSingle()}>+ Add slot</Btn>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <div className="w-52 shrink-0 bg-[#0a1929] border-r border-white/10 flex flex-col overflow-y-auto">
          <div className="px-3 pt-4 pb-2">
            <div className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-2 mb-2">Turfs</div>
            {turfs.map((t) => {
              const tSlots = Object.entries(slotMap)
                .filter(([k]) => k.startsWith(`${t.id}|`))
                .flatMap(([, arr]) => arr);
              const open   = tSlots.filter((s) => !s.booked).length;
              const booked = tSlots.filter((s) =>  s.booked).length;
              const active = activeTurfId === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTurfId(t.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition mb-1 ${active ? "bg-white/8" : "hover:bg-white/5"}`}
                >
                  <span className="text-base">{t.img || "⚽"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#f0f4f8] truncate">{t.name}</div>
                    <div className="text-[10px] text-[#475569] mt-0.5">{open} open · {booked} booked</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 mx-3 pt-3 border-t border-white/8">
            <div className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-2 mb-2">Today</div>
            {[
              { label: "Open",    value: sidebarStats.openToday },
              { label: "Booked",  value: sidebarStats.bookedToday },
              { label: "Revenue", value: `₹${sidebarStats.revenue.toLocaleString("en-IN")}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center px-2 py-1.5">
                <span className="text-xs text-[#64748b]">{label}</span>
                <span className="text-xs font-semibold text-[#f0f4f8]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Calendar ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Day headers */}
          <div className="grid grid-cols-7 bg-[#0f1e32] border-b border-white/10 shrink-0">
            {days.map((d, i) => {
              const ds      = dateStr(d);
              const todayS  = dateStr(TODAY);
              const isToday = ds === todayS;
              const isPast  = d < TODAY;
              const col     = getColStyle(d);
              return (
                <div key={i} className={`py-2.5 px-2 text-center border-r border-white/8 last:border-r-0 ${col.header}`}>
                  <div className={`text-[10px] uppercase tracking-wider font-semibold
                    ${isToday ? "text-green-400" : isPast ? "text-[#2d3f52]" : "text-[#475569]"}`}>
                    {DOWS[i]}
                  </div>
                  <div className={`text-base font-medium mt-0.5 mx-auto w-8 h-8 flex items-center justify-center rounded-full
                    ${isToday
                      ? "bg-green-500 text-white text-sm shadow-lg shadow-green-500/30"
                      : isPast ? "text-[#2d3f52]" : "text-[#f0f4f8]"}`}
                  >
                    {d.getDate()}
                  </div>
                  {isToday && (
                    <div className="text-[9px] text-green-400/60 font-semibold tracking-widest uppercase mt-0.5">Today</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Slot grid */}
          <div className="grid grid-cols-7 flex-1 overflow-y-auto divide-x divide-white/8">
            {days.map((d, i) => {
              const ds      = dateStr(d);
              const todayS  = dateStr(TODAY);
              const isToday = ds === todayS;
              const isPast  = d < TODAY;
              const col     = getColStyle(d);
              const loading = loadingKeys.has(`${activeTurfId}|${ds}`);
              const daySlots = slotsForDate(ds);  // sorted ascending by start

              return (
                <div key={i} className={`p-2 flex flex-col gap-2 relative ${col.body}`}>
                  {/* Past diagonal stripe overlay */}
                  {isPast && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundImage: "repeating-linear-gradient(135deg,transparent,transparent 10px,rgba(255,255,255,0.015) 10px,rgba(255,255,255,0.015) 11px)" }}
                    />
                  )}

                  {/* Loading skeleton — 2 placeholder cards */}
                  {loading && [1, 2].map((k) => (
                    <div key={k} className="rounded-xl border border-white/8 px-3 py-2.5 animate-pulse bg-white/3">
                      <div className="h-2 w-14 bg-white/10 rounded mb-2" />
                      <div className="h-3 w-10 bg-white/8 rounded mb-2" />
                      <div className="h-2 w-12 bg-white/5 rounded" />
                    </div>
                  ))}

                  {/* Slots */}
                  {!loading && daySlots.map((slot) => (
                    <SlotBlock
                      key={slot.id}
                      slot={slot}
                      isPast={isPast}
                      isToday={isToday}
                      onDelete={(id) => handleDelete(id, ds)}
                      onPriceChange={(id, price) => handlePriceChange(id, price, ds)}
                    />
                  ))}

                  {/* Inline add button */}
                  {!isPast && !loading && (
                    <button
                      onClick={() => openSingle(ds)}
                      className={`w-full text-center text-[11px] border border-dashed rounded-xl py-2 transition mt-1
                        ${isToday
                          ? "border-green-500/20 text-green-800 hover:border-green-500/40 hover:text-green-600"
                          : "border-white/10 text-[#334155] hover:border-white/20 hover:text-[#64748b]"}`}
                    >
                      + add
                    </button>
                  )}

                  {/* Empty state */}
                  {!loading && daySlots.length === 0 && (
                    <div className={`text-center pt-4 text-[11px] ${isPast ? "text-[#1e293b]" : "text-[#2d3f52]"}`}>
                      No slots
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-5 px-5 py-2.5 bg-[#0f1e32] border-t border-white/10 shrink-0">
        {[
          { dot: "bg-green-400", label: "Available" },
          { dot: "bg-blue-400",  label: "Booked"    },
          { dot: "bg-[#475569]", label: "Past"       },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${dot}`} />
            <span className="text-[11px] text-[#64748b]">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-white/10">
          <span className="text-[11px] text-[#475569]">✎ Click a slot's price to edit it</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MODAL — Single slot
      ════════════════════════════════════════════════════ */}
      {modalMode === "single" && (
        <Modal title="Add single slot" onClose={closeModal} width={420}>
          <Field label="Date *">
            <Input type="date" value={singleForm.date} onChange={setSF("date")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start time *"><Input type="time" value={singleForm.start} onChange={setSF("start")} /></Field>
            <Field label="End time *">  <Input type="time" value={singleForm.end}   onChange={setSF("end")}   /></Field>
          </div>
          <Field label="Price (₹) *">
            <Input type="number" placeholder="800" value={singleForm.price} onChange={setSF("price")} />
          </Field>

          {singleForm.date && singleForm.price && toMins(singleForm.start) < toMins(singleForm.end) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/8 border border-green-500/20 text-xs text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              {activeTurf?.name} · {singleForm.date} · {singleForm.start}–{singleForm.end} · ₹{Number(singleForm.price).toLocaleString("en-IN")}
            </div>
          )}

          {errors.length > 0 && (
            <div className="flex flex-col gap-1">
              {errors.map((e, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  <span className="shrink-0 mt-0.5">⚠</span> {e}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Btn variant="ghost" onClick={closeModal} disabled={saving}>Cancel</Btn>
            <Btn onClick={saveSingle} disabled={saving}>{saving ? "Saving…" : "Add slot"}</Btn>
          </div>
        </Modal>
      )}

      {/* ════════════════════════════════════════════════════
          MODAL — Bulk / Auto-generate
      ════════════════════════════════════════════════════ */}
      {modalMode === "bulk" && (
        <Modal title="⚡ Auto-generate slots" onClose={closeModal} width={480}>
          <p className="text-xs text-[#64748b] -mt-1 mb-1">
            Pick a date, operating window, slot gap and price — slots are generated automatically. Conflicts with existing slots are skipped.
          </p>

          <Field label="Date *">
            <Input type="date" value={bulkForm.date} onChange={setBF("date")} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Operating start *"><Input type="time" value={bulkForm.start} onChange={setBF("start")} /></Field>
            <Field label="Operating end *">  <Input type="time" value={bulkForm.end}   onChange={setBF("end")}   /></Field>
          </div>

          <Field label="Slot duration (gap)">
            <Select value={bulkForm.gap} onChange={setBF("gap")}>
              {GAP_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </Select>
          </Field>

          <Field label="Price per slot (₹) *">
            <Input type="number" placeholder="800" value={bulkForm.price} onChange={setBF("price")} />
          </Field>

          {bulkPreview.length > 0 && bulkForm.price && (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-white/4 border-b border-white/8">
                <span className="text-xs font-semibold text-[#f0f4f8]">
                  {bulkPreview.length} slots · {bulkNew} new
                  {bulkConflicts.length > 0 && `, ${bulkConflicts.length} skipped (conflict)`}
                </span>
                <span className="text-xs text-[#64748b]">₹{Number(bulkForm.price).toLocaleString("en-IN")} each</span>
              </div>
              <div className="max-h-44 overflow-y-auto">
                {bulkPreview.map((t, idx) => {
                  const conflict = hasOverlapInList(slotsOnBulkDate, t.start, t.end);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-3 py-2 border-b border-white/5 last:border-0 ${conflict ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${conflict ? "bg-red-400" : "bg-green-400"}`} />
                        <span className="text-xs font-mono text-[#f0f4f8]">{t.start}–{t.end}</span>
                      </div>
                      <span className={`text-[10px] font-medium ${conflict ? "text-red-400" : "text-[#64748b]"}`}>
                        {conflict ? "conflict — skip" : "will be added"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="flex flex-col gap-1">
              {errors.map((e, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  <span className="shrink-0 mt-0.5">⚠</span> {e}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Btn variant="ghost" onClick={closeModal} disabled={saving}>Cancel</Btn>
            <Btn onClick={saveBulk} disabled={bulkNew === 0 || saving}>
              {saving ? "Saving…" : `Add ${bulkNew > 0 ? `${bulkNew} slot${bulkNew > 1 ? "s" : ""}` : "slots"}`}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SlotsPage;
