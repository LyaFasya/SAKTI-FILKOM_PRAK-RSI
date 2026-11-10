import { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as authService from "../services/authService.js";
import {
  ambilUserTersimpan,
  hapusSesi,
  simpanUser
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Data akun diambil dari localStorage supaya refresh tidak berkedip ke halaman login.
  const [user, setUser] = useState(() => ambilUserTersimpan());

  // Saat aplikasi dibuka, pastikan sesi di backend masih berlaku.
  // Kalau sudah habis (2 jam) backend menjawab 401 dan api.js memicu event di bawah.
  useEffect(() => {
    if (!ambilUserTersimpan()) return;

    authService
      .cekSesi()
      .then((hasil) => {
        simpanUser(hasil.data);
        setUser(hasil.data);
      })
      .catch(() => {});
  }, []);

  const login = useCallback(async (email, password) => {
    const hasil = await authService.login(email, password);
    simpanUser(hasil.data);
    setUser(hasil.data);
    return hasil.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Tetap keluar di sisi tampilan meskipun backend tidak terjangkau.
    }
    hapusSesi();
    setUser(null);
  }, []);

  // Dipicu api.js ketika backend menjawab 401 (belum login atau sesi habis).
  useEffect(() => {
    const saatTidakSah = () => setUser(null);
    window.addEventListener("sakti:unauthorized", saatTidakSah);
    return () => window.removeEventListener("sakti:unauthorized", saatTidakSah);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const konteks = useContext(AuthContext);
  if (!konteks) throw new Error("useAuth harus dipakai di dalam AuthProvider.");
  return konteks;
}