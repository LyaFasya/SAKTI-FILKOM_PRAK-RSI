// Pembungkus fetch untuk semua panggilan ke backend.
// - Otomatis menambahkan header Authorization: Bearer <token>
// - Mengubah respons error menjadi ApiError dengan pesan dari backend
// - Jika backend menjawab 401 (token salah/kedaluwarsa), sesi dihapus
//   dan AuthContext diberi tahu lewat event "sakti:unauthorized"

const KEY_TOKEN = "sakti_token";
const KEY_USER = "sakti_user";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function ambilToken() {
  return localStorage.getItem(KEY_TOKEN);
}

export function ambilUserTersimpan() {
  try {
    return JSON.parse(localStorage.getItem(KEY_USER));
  } catch {
    return null;
  }
}

export function simpanSesi(token, user) {
  localStorage.setItem(KEY_TOKEN, token);
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}

export function hapusSesi() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_USER);
}

export async function apiRequest(
  path,
  { method = "GET", body, abaikanUnauthorized = false } = {}
) {
  const headers = {};
  const token = ambilToken();

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError(
      "Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.",
      0,
      null
    );
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401 && !abaikanUnauthorized) {
    hapusSesi();
    window.dispatchEvent(new Event("sakti:unauthorized"));
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Terjadi kesalahan pada server.",
      response.status,
      data
    );
  }

  return data;
}
