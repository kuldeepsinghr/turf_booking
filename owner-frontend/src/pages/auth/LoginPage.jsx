import { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [form, setForm]             = useState({ email: '', password: '' })
  const [showPass, setShowPass]     = useState(false)
  const [errors, setErrors]         = useState({})
  const [loading, setLoading]       = useState(false)

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(v => ({ ...v, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.email)
      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email'
    if (!form.password)
      e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    // Static: just simulate loading for now
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('Login pressed — API integration coming soon!')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* ── Left branding panel (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-5/12 p-12"
        style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: 'var(--green)', color: '#0b1120' }}
          >
            T
          </div>
          <span className="font-semibold text-base" style={{ color: 'var(--text)' }}>
            TurfBook
          </span>
        </div>

        {/* Tagline */}
        <div>
          <h2
            className="text-3xl font-semibold leading-snug mb-4"
            style={{ color: 'var(--text)' }}
          >
            Manage your turf,<br />grow your business.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
            Create listings, set time slots, and track every booking — all from one clean owner dashboard.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mt-10">
            {[
              { label: 'Active turfs',   value: '1,200+' },
              { label: 'Daily bookings', value: '8,000+' },
              { label: 'Cities',         value: '40+'    },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-semibold" style={{ color: 'var(--green)' }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          © {new Date().getFullYear()} TurfBook · Owner Portal
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm fade-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: 'var(--green)', color: '#0b1120' }}
            >T</div>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>TurfBook</span>
          </div>

          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>Sign in</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
            Enter your owner credentials to continue
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
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
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`field pr-10 ${errors.password ? 'field-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs select-none"
                  style={{ color: 'var(--muted)' }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="err">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="btn" disabled={loading}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Signing in...</>
                : 'Sign in'
              }
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--muted)' }}>
            No account?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--green)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
