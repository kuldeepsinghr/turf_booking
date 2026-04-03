export const Input = (props) => (
  <input className="input-field" {...props} />
);

export const Select = ({ children, ...props }) => (
  <select className="input-field" {...props}>{children}</select>
);

export const Btn = ({ children, onClick, variant='primary', className="" }) => (
  <button
    onClick={onClick}
    className={`${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} ${className}`}
  >
    {children}
  </button>
);

export const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
      {label}
    </label>
    {children}
  </div>
);