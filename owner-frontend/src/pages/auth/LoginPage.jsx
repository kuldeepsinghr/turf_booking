import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const { checkAuth } = useAuth();
  const API = import.meta.env.VITE_API_URL;
const navigate = useNavigate();

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(v => ({ ...v, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setLoading(true);

  try {
    const res = await axios.post(
      `${API}/api/owners/login`,
      {
        email: form.email,
        password: form.password,
      },
      {
        withCredentials: true, // 🔥 cookie support
      }
    );

    const data = res.data;

    
    // ✅ success toast (from backend)
    toast.success(data?.message || "Login successful 🎉");
    
    await checkAuth(); // ✅ update auth state
    // 🔁 redirect
    navigate("/dashboard");

  } catch (err) {
    console.error(err);

    const message =
      err.response?.data?.message || "Invalid credentials";

    // ❌ error toast
    toast.error(message);

    setErrors({ api: message });

  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="min-h-screen flex px-6 lg:px-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(34,197,94,0.15), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(34,197,94,0.1), transparent 40%),
          #020617
        `
      }} 
    >

      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex overflow-hidden flex-shrink-0 flex-col justify-between w-5/12 px-16 py-14 relative"
        style={{
          borderRight: '1px solid var(--border)',
          background: 'linear-gradient(180deg, rgba(2,6,23,0.9), rgba(2,6,23,1))'
        }}
      >
        {/* Glow */}
        <div className="absolute w-72 h-72 bg-green-500/10 blur-3xl rounded-full top-20 left-10"></div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: 'var(--green)', color: '#022c22' }}>
            T
          </div>
          <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
            TurfBook
          </span>
        </div>

        {/* Content */}
        <div className="max-w-md space-y-6 relative z-10 ml-0">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight"
            style={{ color: 'var(--text)' }}>
            Manage your turf,<br />grow your business.
          </h2>

          <p className="text-base leading-relaxed"
            style={{ color: 'var(--muted)' }}>
            Create listings, set time slots, and track every booking — all from one clean dashboard.
          </p>

          {/* Stats */}
          <div className="flex gap-12 pt-4">
            {[
              { label: 'Active turfs', value: '1,200+' },
              { label: 'Daily bookings', value: '8,000+' },
              { label: 'Cities', value: '40+' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-3xl font-bold" style={{ color: 'var(--green)' }}>
                  {value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm relative z-10" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} TurfBook · Owner Portal
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-6 animate-fade-in-up">

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold"
              style={{ background: 'var(--green)', color: '#022c22' }}>
              T
            </div>
            <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
              TurfBook
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold" style={{ color: 'var(--text)' }}>
              Sign in
            </h1>
            <p className="text-base" style={{ color: 'var(--muted)' }}>
              Enter your owner credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Email */}
            <div className="space-y-1">
              <label className="label">Email address</label>
              <input
                type="email"
                className={`field ${errors.email ? 'field-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
              />
              {errors.email && <p className="err">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`field pr-12 ${errors.password ? 'field-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="err">{errors.password}</p>}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn w-full py-3 mt-2"
              disabled={loading}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                : 'Sign in'
              }
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center pt-2" style={{ color: 'var(--muted)' }}>
            No account?{' '}
            <Link to="/register" className="font-medium"
              style={{ color: 'var(--green)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage