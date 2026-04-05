import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import  DashboardPage  from './pages/dashboard/DashboardPage'
import { Toaster } from "react-hot-toast";



function App() {
  return (
    <>
    <Routes>
      <Route path="/"          element={<Navigate to="/login" replace />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/dashboard/*" element={<DashboardPage />} />
    </Routes>
    <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App