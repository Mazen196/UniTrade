import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../utils/api";

/*
  Auth now talks to the Express + MongoDB server:
    POST /auth/register, POST /auth/login, GET /auth/me, PUT /auth/me
  The login token is kept in localStorage so the user stays logged in after refresh.
*/
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  // On first load: if a token exists, ask the server who the user is.
  useEffect(() => {
    if (!getToken()) return;
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, password }) => {
    try {
      const data = await api("/auth/register", { method: "POST", body: { name, email, password } });
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const updateProfile = async (changes) => {
    try {
      const data = await api("/auth/me", { method: "PUT", body: changes });
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
