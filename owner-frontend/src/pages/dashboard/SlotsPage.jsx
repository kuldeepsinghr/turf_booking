import { useState } from "react";
import { staticSlots } from "../../data/staticData";
import { Field, Input, Select, Btn } from "../../components/dashboard/UI";
import Modal from "../../components/dashboard/Modal";

function SlotsPage() {
  const [slots, setSlots] = useState(staticSlots);
  const [showModal, setShowModal] = useState(false);
  const [selectedTurf, setSelectedTurf] = useState("all");
  const [form, setForm] = useState({
    turf: "Green Arena",
    date: "",
    start: "06:00",
    end: "07:00",
    price: "",
  });

  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const addSlot = () => {
    if (!form.date || !form.price)
      return alert("Fill date and price");

    setSlots((p) => [
      ...p,
      {
        id: Date.now(),
        turf: form.turf,
        date: form.date,
        start: form.start,
        end: form.end,
        price: Number(form.price),
        booked: false,
        bookedBy: null,
      },
    ]);

    setShowModal(false);
  };

  const deleteSlot = (id) => {
    if (window.confirm("Delete this slot?")) {
      setSlots((p) => p.filter((s) => s.id !== id));
    }
  };

  const turfs = ["all", ...new Set(staticSlots.map((s) => s.turf))];

  const filtered =
    selectedTurf === "all"
      ? slots
      : slots.filter((s) => s.turf === selectedTurf);

  return (
    <div className="fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#f0f4f8]">
            Time Slots
          </h2>
          <p className="text-sm text-[#64748b] mt-0.5">
            {slots.filter((s) => !s.booked).length} available ·{" "}
            {slots.filter((s) => s.booked).length} booked
          </p>
        </div>

        <Btn onClick={() => setShowModal(true)}>
          + Add slot
        </Btn>
      </div>

      {/* Turf Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {turfs.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTurf(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition
              ${
                selectedTurf === t
                  ? "bg-green-500/10 border border-green-500/40 text-green-500"
                  : "bg-white/5 border border-white/10 text-[#64748b] hover:bg-white/10"
              }
            `}
          >
            {t === "all" ? "All turfs" : t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_80px] px-5 py-3 bg-white/5 border-b border-white/10 text-[11px] font-semibold text-[#64748b] uppercase tracking-wide">
          {["Turf", "Date", "Time", "Price", "Status", ""].map(
            (h) => (
              <div key={h}>{h}</div>
            )
          )}
        </div>

        {/* Rows */}
        {filtered.map((slot, i) => (
          <div
            key={slot.id}
            className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_80px] px-5 py-3 items-center hover:bg-white/5 ${
              i < filtered.length - 1
                ? "border-b border-white/10"
                : ""
            }`}
          >
            <div className="text-sm font-medium text-[#f0f4f8]">
              {slot.turf}
            </div>

            <div className="text-sm text-[#94a3b8]">
              {slot.date}
            </div>

            <div className="text-sm font-mono text-[#f0f4f8]">
              {slot.start}–{slot.end}
            </div>

            <div className="text-sm font-semibold text-[#f0f4f8]">
              ₹{slot.price}
            </div>

            <div>
              {slot.booked ? (
                <span className="badge booked">
                  Booked · {slot.bookedBy}
                </span>
              ) : (
                <span className="badge available">
                  Available
                </span>
              )}
            </div>

            <div className="flex justify-end">
              {!slot.booked && (
                <button
                  onClick={() => deleteSlot(slot.id)}
                  className="text-red-500 text-base px-2 hover:text-red-400"
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#64748b]">
            <div className="text-3xl mb-2">🕐</div>
            <div className="text-sm text-[#94a3b8]">
              No slots found for this turf
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title="Add new slot"
          onClose={() => setShowModal(false)}
          width={440}
        >
          <Field label="Turf *">
            <Select value={form.turf} onChange={setF("turf")}>
              {staticTurfs.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Date *">
            <Input
              type="date"
              value={form.date}
              onChange={setF("date")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start time *">
              <Input
                type="time"
                value={form.start}
                onChange={setF("start")}
              />
            </Field>

            <Field label="End time *">
              <Input
                type="time"
                value={form.end}
                onChange={setF("end")}
              />
            </Field>
          </div>

          <Field label="Price (₹) *">
            <Input
              type="number"
              placeholder="800"
              value={form.price}
              onChange={setF("price")}
            />
          </Field>

          <div className="flex justify-end gap-2 mt-2">
            <Btn
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Btn>
            <Btn onClick={addSlot}>Add slot</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default SlotsPage;