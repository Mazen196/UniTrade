import { createContext, useContext, useState } from "react";

/*
  WEEK 1: users are stored in the browser (localStorage) so the forms work.
  WEEK 3: replace the functions below with real calls to the Express API
  (POST /api/auth/register, POST /api/auth/login, PUT /api/users/me).
*/
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read("unitrade_current", null));

  const persistCurrent = (u) => {
    setUser(u);
    if (u) localStorage.setItem("unitrade_current", JSON.stringify(u));
    else localStorage.removeItem("unitrade_current");
  };

  const register = ({ name, email, password }) => {
    const users = read("unitrade_users", []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "This email is already registered" };
    }
    const newUser = { id: Date.now().toString(), name, email, password, phone: "", faculty: "", bio: "" };
    localStorage.setItem("unitrade_users", JSON.stringify([...users, newUser]));
    const { password: _pw, ...safe } = newUser;
    persistCurrent(safe);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const users = read("unitrade_users", []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Incorrect email or password" };
    const { password: _pw, ...safe } = found;
    persistCurrent(safe);
    return { ok: true };
  };

  const updateProfile = (changes) => {
    const users = read("unitrade_users", []);
    const updated = users.map((u) => (u.id === user.id ? { ...u, ...changes } : u));
    localStorage.setItem("unitrade_users", JSON.stringify(updated));
    persistCurrent({ ...user, ...changes });
  };

  const logout = () => persistCurrent(null);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
