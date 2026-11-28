// One place for talking to the Express server.
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("unitrade_token");
export const setToken = (t) => (t ? localStorage.setItem("unitrade_token", t) : localStorage.removeItem("unitrade_token"));

export async function api(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is it running?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
