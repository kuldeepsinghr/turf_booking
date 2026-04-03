const Modal = ({ title, onClose, children, width = 520 }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
    >
      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0f1e32] border border-white/10 rounded-2xl w-full max-h-[90vh] overflow-auto"
        style={{ maxWidth: width }} // ✅ dynamic width
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span className="font-semibold text-base text-[#f0f4f8]">
            {title}
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-[#64748b] hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;