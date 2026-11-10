import { apiRequest } from "./api.js";

// POST /api/auth/login  ->  { message, data: { idAkun, email, role } }
// Sesi disimpan backend lewat cookie, tidak ada token di respons.
export function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    abaikanUnauthorized: true
  });
}

// GET /api/auth/session  ->  { message, data: { idAkun, email, role } }
export function cekSesi() {
  return apiRequest("/auth/session");
}

// POST /api/auth/logout
export function logout() {
  return apiRequest("/auth/logout", { method: "POST", abaikanUnauthorized: true });
}