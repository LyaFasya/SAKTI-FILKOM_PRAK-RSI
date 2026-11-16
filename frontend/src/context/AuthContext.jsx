import { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as authService from "../services/authService.js";
import {
  ambilUserTersimpan,
  hapusSesi,
  simpanUser
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Dari localStorage biar refresh tidak balik ke login dulu
  const [user, setUser] = useState(() => ambilUserTersimpan());

  // Cek sesi ke backend saat app dibuka
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
      // Tetap logout di tampilan walau backend mati
    }
    hapusSesi();
    setUser(null);
  }, []);

  // Dipicu api.js saat 401
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