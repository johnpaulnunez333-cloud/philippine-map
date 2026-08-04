import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("philmap_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("philmap_token");
      })
      .finally(() => setLoading(false));
  }, []);

  function login(token, userData) {
    localStorage.setItem("philmap_token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("philmap_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
