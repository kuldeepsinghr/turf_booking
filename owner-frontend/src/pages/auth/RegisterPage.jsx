import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from "react-hot-toast";


const RegisterPage = () => {
  const API = import.meta.env.VITE_API_URL
  const [step, setStep]         = useState(0)   // 0 = step1, 1 = step2, 2 = success
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({
    name: '', email: '', mobile: '', password: ''
  })
  const navigate = useNavigate()

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(v => ({ ...v, [field]: '' }))
  }

  // Validate step 0 fields
  const validateStep0 = () => {
    const e = {}
    if (!form.name.trim())          e.name  = 'Full name is required'
    if (!form.email)                e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Validate step 1 fields
  const validateStep1 = () => {
    const e = {}
    if (!form.mobile)                     e.mobile   = 'Mobile number is required'
    else if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile'
    if (!form.password)                   e.password = 'Password is required'
    else if (form.password.length < 6)    e.password = 'Minimum 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep0()) setStep(1)
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateStep1()) return;

  setLoading(true);

  try {
    const res = await axios.post(
      `${API}/api/owners/register`,
      {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      },
      {
        withCredentials: true,
      }
    );

    const data = res.data;

    // ✅ ONLY ONE SUCCESS TOAST
    toast.success(data?.message || "Registration successful 🎉");

    // ✅ navigate AFTER success
    navigate("/dashboard");

  } catch (err) {
    console.error(err);

    const message =
      err.response?.data?.message || "Something went wrong";

    // ❌ ERROR TOAST
    toast.error(message);

    setErrors({ api: message });

  } finally {
    setLoading(false);
  }
};

  // Password strength: 0 = weak, 1 = medium, 2 = strong
  const strength = form.password.length === 0 ? -1
    : form.password.length < 6  ? 0
    : form.password.length < 10 ? 1
    : 2

  const strengthColors = ['#ef4444', '#f59e0b', '#22c55e']
  const strengthLabels = ['Weak', 'Medium', 'Strong']

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: `
        radial-gradient(circle at 20% 30%, rgba(34,197,94,0.15), transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(34,197,94,0.1), transparent 40%),
          #020617` }}
    >
      <div className="w-full max-w-md fade-up">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: 'var(--green)', color: '#0b1120' }}
          >T</div>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>TurfBook</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Your info', 'Contact', 'Done'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* Circle */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={{
                  background: i < step
                    ? 'var(--green)'
                    : i === step
                      ? 'rgba(34,197,94,0.15)'
                      : 'rgba(255,255,255,0.05)',
                  color: i < step
                    ? '#0b1120'
                    : i === step
                      ? 'var(--green)'
                      : 'var(--muted)',
                  border: i === step ? '1px solid rgba(34,197,94,0.4)' : 'none'
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {/* Label */}
              <span
                className="text-xs hidden sm:block"
                style={{ color: i === step ? 'var(--text)' : 'var(--muted)' }}
              >
                {label}
              </span>
              {/* Connector line */}
              {i < 2 && (
                <div
                  className="w-8 h-px ml-1 transition-all duration-500"
                  style={{ background: i < step ? 'var(--green)' : 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card p-8">

          {/* ── STEP 0: Name + Email ─────────────────────────────── */}
          {step === 0 && (
            <div>
              <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                Create your account
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                Start with your basic information
              </p>

              <div className="space-y-4">
                <div>
                  <label className="label">Full name</label>
                  <input
                    className={`field ${errors.name ? 'field-error' : ''}`}
                    placeholder="Vikram Patel"
                    value={form.name}
                    onChange={set('name')}
                  />
                  {errors.name && <p className="err">{errors.name}</p>}
                </div>

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

                <button type="button" className="btn mt-2" onClick={handleNext}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Mobile + Password ─────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleSubmit} noValidate>
              <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                Almost there
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                Add your mobile number and set a password
              </p>

              <div className="space-y-4">
                {/* Mobile */}
                <div>
                  <label className="label">Mobile number</label>
                  <div className="flex gap-2">
                    <div
                      className="field w-16 flex items-center justify-center text-sm flex-shrink-0 cursor-default"
                      style={{ color: 'var(--muted)' }}
                    >
                      +91
                    </div>
                    <input
                      type="tel"
                      className={`field flex-1 ${errors.mobile ? 'field-error' : ''}`}
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.mobile}
                      onChange={set('mobile')}
                    />
                  </div>
                  {errors.mobile && <p className="err">{errors.mobile}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      className={`field pr-12 ${errors.password ? 'field-error' : ''}`}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={set('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: 'var(--muted)' }}
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && <p className="err">{errors.password}</p>}

                  {/* Strength bar */}
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? strengthColors[strength] : 'var(--border)' }}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1" style={{ color: strengthColors[strength] }}>
                        {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    className="btn-outline flex-1"
                    onClick={() => setStep(0)}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn flex-1"
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Creating...</>
                      : 'Create account'
                    }
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 2: Success ───────────────────────────────────── */}
          {step === 2 && (
            <div className="text-center py-4">
              {/* Green check circle */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
                style={{
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: 'var(--green)'
                }}
              >
                ✓
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                Account created!
              </h2>
              <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
                Your owner account is ready.<br />Sign in to set up your turf.
              </p>
              <Link to="/login" className="btn block">
                Go to sign in
              </Link>
            </div>
          )}
        </div>

        {/* Bottom link */}
        {step < 2 && (
          <p className="text-sm text-center mt-5" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--green)' }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default RegisterPage
