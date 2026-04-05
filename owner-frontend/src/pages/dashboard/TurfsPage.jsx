import { useState } from "react";
import { Field, Input, Select, Btn } from "../../components/dashboard/UI";
import Modal from "../../components/dashboard/Modal";
import { useTurf } from "../../context/TurfContext";

/* ─── tiny helpers ─────────────────────────────────────── */
const TABS = ["all", "active", "inactive"];

const emptyForm = {
  name: "",
  address: "",
  price_per_hour: "",
  description: "",
  status: "active",
};

/* ─── StatusToggle pill ─────────────────────────────────── */
function StatusToggle({ turf, onToggle }) {
  const isActive = turf.status === "active";
  return (
    <button
      onClick={() => onToggle(turf.id, turf.status)}
      title={`Click to mark as ${isActive ? "inactive" : "active"}`}
      className={`
        relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
        border transition-all duration-200 select-none cursor-pointer
        ${
          isActive
            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25"
            : "bg-slate-500/15 border-slate-500/30 text-slate-400 hover:bg-slate-500/25"
        }
      `}
    >
      {/* dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
        }`}
      />
      {turf.status}
      {/* swap icon */}
      <span className="ml-0.5 opacity-60 text-[10px]">⇄</span>
    </button>
  );
}

/* ─── TurfCard ──────────────────────────────────────────── */
function TurfCard({ turf, onEdit, onDelete, onToggle }) {
  return (
    <div className="group bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-lg hover:shadow-black/30 transition-all duration-200">

      {/* Banner */}
      <div className="h-20 bg-gradient-to-br from-[#0d2d1a] to-[#0f3d20] flex items-center justify-center text-3xl relative">
        {turf.img}

        {/* Status toggle pill — always visible */}
        <div className="absolute top-2 right-2">
          <StatusToggle turf={turf} onToggle={onToggle} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="font-bold text-sm text-[#f0f4f8] mb-0.5 truncate">
          {turf.name}
        </div>
        <div className="text-xs text-[#64748b] mb-3 truncate">
          📍 {turf.address}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Price", value: `₹${turf.price}/hr` },
            { label: "Slots", value: turf.slots },
            { label: "Bookings", value: turf.bookings },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center bg-white/5 rounded-lg py-2"
            >
              <div className="text-sm font-bold text-[#f0f4f8]">{value}</div>
              <div className="text-[10px] text-[#64748b] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => onEdit(turf)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 transition font-medium"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(turf.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-400/10 hover:bg-red-400/20 transition font-medium"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────── */
function TurfsPage() {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState("all");
  const [saving, setSaving] = useState(false);

  const { turfs, loading, addTurf, updateTurf, deleteTurf, toggleStatus } = useTurf();

  const setF = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ✅ BUG FIX: each tab gets its own real count
  const countFor = (t) =>
    t === "all" ? turfs.length : turfs.filter((x) => x.status === t).length;

  const filtered =
    tab === "all" ? turfs : turfs.filter((t) => t.status === tab);

  const openAdd = () => {
    setIsEdit(false);
    setSelectedTurf(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // ✅ BUG FIX: description now populated because TurfContext maps it
  const openEdit = (turf) => {
    setIsEdit(true);
    setSelectedTurf(turf);
    setForm({
      name: turf.name,
      address: turf.address,
      price_per_hour: turf.price,
      description: turf.description || "",
      status: turf.status,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setSelectedTurf(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.address.trim() || !form.price_per_hour) {
      return;
    }
    setSaving(true);
    let success;
    if (isEdit) {
      success = await updateTurf(selectedTurf.id, {
        name: form.name,
        address: form.address,
        price_per_hour: Number(form.price_per_hour),
        description: form.description,
        is_active: form.status === "active" ? 1 : 0,  // ✅ status sent on edit
      });
    } else {
      success = await addTurf(form);
    }
    setSaving(false);
    if (success) closeModal();
  };

  return (
    <div className="fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#f0f4f8]">My Turfs</h2>
          <p className="text-sm text-[#64748b] mt-0.5">
            {turfs.length} turf{turfs.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Btn onClick={openAdd}>+ Add turf</Btn>
      </div>

      {/* ── Tabs with correct per-tab counts ── */}
      <div className="flex border-b border-white/10 mb-5 gap-1">
        {TABS.map((t) => {
          const count = countFor(t);
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                flex items-center gap-1.5 px-4 py-2 text-sm capitalize border-b-2 transition
                ${tab === t
                  ? "text-green-400 border-green-500"
                  : "text-[#64748b] border-transparent hover:text-white"}
              `}
            >
              {t}
              <span
                className={`
                  text-[11px] px-1.5 py-0.5 rounded-full font-semibold
                  ${tab === t ? "bg-green-500/20 text-green-400" : "bg-white/5 text-[#64748b]"}
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-20 bg-white/5" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-white/10 rounded w-2/3" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-10 bg-white/5 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filtered.map((turf) => (
            <TurfCard
              key={turf.id}
              turf={turf}
              onEdit={openEdit}
              onDelete={deleteTurf}
              onToggle={toggleStatus}   // ✅ quick toggle without opening modal
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#64748b]">
              <div className="text-4xl mb-3">⚽</div>
              <div className="text-sm font-medium text-[#94a3b8] mb-1">
                No {tab !== "all" ? tab : ""} turfs found
              </div>
              <div className="text-xs">
                {tab === "all"
                  ? 'Click "+ Add turf" to create your first listing'
                  : `Switch to "All" tab or add a new turf`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <Modal
          title={isEdit ? "Edit turf" : "Add new turf"}
          onClose={closeModal}
        >
          <Field label="Turf name *">
            <Input
              placeholder="e.g. Green Arena"
              value={form.name}
              onChange={setF("name")}
            />
          </Field>

          <Field label="Address *">
            <Input
              placeholder="e.g. Andheri West, Mumbai"
              value={form.address}
              onChange={setF("address")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price per hour (₹) *">
              <Input
                type="number"
                placeholder="800"
                value={form.price_per_hour}
                onChange={setF("price_per_hour")}
              />
            </Field>

            <Field label="Sport type">
              <Select>
                <option>Football</option>
                <option>Cricket</option>
                <option>Badminton</option>
              </Select>
            </Field>
          </div>

          {/* ✅ Status field — visible in both add & edit */}
          <Field label="Status">
            <Select value={form.status} onChange={setF("status")}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Field>

          {/* ✅ Live preview of status change */}
          <div
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all
              ${form.status === "active"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-slate-500/10 border-slate-500/20 text-slate-400"}
            `}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                form.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            This turf will be{" "}
            <strong>{form.status === "active" ? "visible to players" : "hidden from players"}</strong>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={setF("description")}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-[#f0f4f8] resize-y placeholder:text-[#475569] focus:outline-none focus:border-white/20"
              placeholder="Describe your turf — surface type, amenities, parking..."
            />
          </Field>

          <div className="flex justify-end gap-2 mt-2">
            <Btn variant="ghost" onClick={closeModal} disabled={saving}>
              Cancel
            </Btn>
            <Btn onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Update turf" : "Create turf"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TurfsPage;