import { apiRequest } from "./api.js";

// Sesi lewat cookie dari backend, tidak ada token
export function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    abaikanUnauthorized: true
  });
}

export function cekSesi() {
  return apiRequest("/auth/session");
}

export function logout() {
  return apiRequest("/auth/logout", { method: "POST", abaikanUnauthorized: true });
}