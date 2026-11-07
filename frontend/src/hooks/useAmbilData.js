import { useEffect, useState } from "react";

// Mengambil data async dan mengelola status loading/error.
// Contoh: const { data, memuat, error } = useAmbilData(() => ambilDaftarLayanan(), []);
// `deps` bekerja seperti dependency array useEffect: data diambil ulang saat nilainya berubah.
export default function useAmbilData(ambil, deps = []) {
  const [state, setState] = useState({ data: null, memuat: true, error: "" });

  useEffect(() => {
    let dibatalkan = false;
    setState((lama) => ({ ...lama, memuat: true, error: "" }));

    ambil()
      .then((data) => {
        if (!dibatalkan) setState({ data, memuat: false, error: "" });
      })
      .catch((error) => {
        if (!dibatalkan) setState({ data: null, memuat: false, error: error.message });
      });

    return () => {
      dibatalkan = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
