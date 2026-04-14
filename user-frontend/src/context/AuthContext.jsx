import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ✅ Load user on refresh
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile`, { withCredentials: true });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Login / Register
  const login = async ({ name, mobile }) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth`, { name, mobile }, { withCredentials: true });

      setUser(res.data.user);

      return {
        success: true,
        user: res.data.user,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await API.post("/logout");
      setUser(null);
    } catch (err) {
      console.log("Logout error", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}