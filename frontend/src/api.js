const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("philmap_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me")
};

export const favoritesApi = {
  list: () => request("/favorites"),
  create: (payload) => request("/favorites", { method: "POST", body: JSON.stringify(payload) }),
  remove: (id) => request(`/favorites/${id}`, { method: "DELETE" }),
  update: (id, payload) => request(`/favorites/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
};

export { getToken };
