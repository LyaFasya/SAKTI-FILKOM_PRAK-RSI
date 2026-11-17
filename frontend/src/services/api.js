// Pembungkus fetch ke backend: kirim cookie sesi, ubah error jadi ApiError,
// dan kalau 401 hapus data user lalu kabari AuthContext (event "sakti:unauthorized")

const KEY_USER = "sakti_user";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Cuma data akun biar tidak berkedip saat refresh, validnya tetap dicek backend
export function ambilUserTersimpan() {
  try {
    return JSON.parse(localStorage.getItem(KEY_USER));
  } catch {
    return null;
  }
}

export function simpanUser(user) {
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}

export function hapusSesi() {
  localStorage.removeItem(KEY_USER);
}

export async function apiRequest(
  path,
  { method = "GET", body, abaikanUnauthorized = false } = {}
) {
  const headers = {};
  // FormData dikirim apa adanya, Content-Type diatur browser
  const adalahForm = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !adalahForm) headers["Content-Type"] = "application/json";

  let response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : adalahForm ? body : JSON.stringify(body)
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