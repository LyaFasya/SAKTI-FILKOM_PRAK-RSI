import { apiRequest } from "./api.js";

// POST /api/auth/login  ->  { message, token, data: { idAkun, email, role } }
export function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    abaikanUnauthorized: true
  });
}
