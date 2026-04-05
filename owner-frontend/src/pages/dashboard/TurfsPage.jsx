import { useState } from "react";
import { Field, Input, Select, Btn } from "../../components/dashboard/UI";
import Modal from "../../components/dashboard/Modal";
import { useTurf } from "../../context/TurfContext";

function TurfsPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    price_per_hour: "",
    description: "",
  });
  const [tab, setTab] = useState("all");

  const { turfs, addTurf, toggleStatus, deleteTurf } = useTurf();

  const setF = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const filtered =
    tab === "all" ? turfs : turfs.filter((t) => t.status === tab);

  return (
    <div className="fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#f0f4f8]">
            My Turfs
          </h2>
          <p className="text-sm text-[#64748b] mt-0.5">
            {turfs.length} turf{turfs.length !== 1 ? "s" : ""} registered
          </p>
        </div>

        <Btn onClick={() => setShowModal(true)}>
          + Add turf
        </Btn>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-5">
        {["all", "active", "inactive"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize border-b-2 transition ${
              tab === t
                ? "text-green-500 border-green-500"
                : "text-[#64748b] border-transparent hover:text-white"
            }`}
          >
            {t} {tab === t && `(${filtered.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {filtered.map((turf) => (
          <div
            key={turf.id}
            className="bg-[#0f1e32] border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.01] transition"
          >
            {/* Banner */}
            <div className="h-24 bg-gradient-to-br from-[#0d2d1a] to-[#0f3d20] flex items-center justify-center text-4xl relative">
              {turf.img}
              <span
                className={`badge ${
                  turf.status === "active" ? "active-t" : "inactive"
                } absolute top-2 right-2`}
              >
                {turf.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="font-bold text-sm text-[#f0f4f8] mb-1">
                {turf.name}
              </div>
              <div className="text-xs text-[#64748b] mb-3">
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
                    className="text-center bg-white/5 rounded-md py-2"
                  >
                    <div className="text-sm font-bold text-[#f0f4f8]">
                      {value}
                    </div>
                    <div className="text-[10px] text-[#64748b]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Btn
                  variant="ghost"
                  onClick={() => toggleStatus(turf.id)}
                  className="flex-1 text-xs py-2"
                >
                  {turf.status === "active"
                    ? "Deactivate"
                    : "Activate"}
                </Btn>

                <button
                  onClick={() => deleteTurf(turf.id)}
                  className="px-3 text-red-500 text-sm hover:text-red-400"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-14 text-[#64748b]">
            <div className="text-4xl mb-3">⚽</div>
            <div className="text-sm font-medium text-[#94a3b8] mb-1">
              No turfs found
            </div>
            <div className="text-xs">
              Click "+ Add turf" to create your first listing
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title="Add new turf"
          onClose={() => setShowModal(false)}
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

          <Field label="Description">
            <textarea
              rows={3}
              value={form.description}
              onChange={setF("description")}
              className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-[#f0f4f8] resize-y"
              placeholder="Describe your turf..."
            />
          </Field>

          <div className="flex justify-end gap-2 mt-2">
            <Btn
              variant="ghost"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Btn>

            {/* ✅ FIXED BUTTON */}
            <Btn
              onClick={async () => {
                const success = await addTurf(form);

                if (success) {
                  setForm({
                    name: "",
                    address: "",
                    price_per_hour: "",
                    description: "",
                  });
                  setShowModal(false);
                }
              }}
            >
              Create turf
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TurfsPage;