import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

const fetchOwnerProfile = async () => {
  try {
    const res = await axios.get(`${API}/api/owners/profile`, {
      withCredentials: true
    });

    setProfile(res.data);
  } catch (err) {
    console.error("Profile fetch failed");
  }
};

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/me`, {
        withCredentials: true
      });

      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    fetchOwnerProfile(); // ✅ auto load profile
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, fetchOwnerProfile, profile}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);