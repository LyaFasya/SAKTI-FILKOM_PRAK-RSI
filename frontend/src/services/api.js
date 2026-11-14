// Pembungkus fetch untuk semua panggilan ke backend.
// - Login memakai session cookie (sakti.sid) yang diatur backend,
//   jadi frontend cukup mengirim cookie lewat credentials: "include".
// - Mengubah respons error menjadi ApiError dengan pesan dari backend
// - Jika backend menjawab 401 (sesi habis/belum login), data user dihapus
//   dan AuthContext diberi tahu lewat event "sakti:unauthorized"

const KEY_USER = "sakti_user";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Hanya data akun (idAkun, email, role) agar halaman tidak berkedip saat refresh.
// Keabsahan sesi tetap ditentukan backend lewat cookie.
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
  // FormData (unggah berkas) dikirim apa adanya; browser mengatur Content-Type multipart sendiri.
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