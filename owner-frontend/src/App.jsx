import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Static dashboard placeholder — we'll build this next step
const Dashboard = () => (
  <div style={{ color: '#64748b', padding: '2rem' }}>Dashboard — coming next step</div>
)

function App() {
  return (
    <Routes>
      <Route path="/"          element={<Navigate to="/login" replace />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App