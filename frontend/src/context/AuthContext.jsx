import { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as authService from "../services/authService.js";
import {
  ambilToken,
  ambilUserTersimpan,
  hapusSesi,
  simpanSesi
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // User dipulihkan dari localStorage supaya refresh halaman tidak logout.
  const [user, setUser] = useState(() =>
    ambilToken() ? ambilUserTersimpan() : null
  );

  const login = useCallback(async (email, password) => {
    const hasil = await authService.login(email, password);
    simpanSesi(hasil.token, hasil.data);
    setUser(hasil.data);
    return hasil.data;
  }, []);

  const logout = useCallback(() => {
    hapusSesi();
    setUser(null);
  }, []);

  // Dipicu api.js ketika backend menjawab 401 (token salah atau habis 2 jam).
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
