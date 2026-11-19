import { useEffect, useState } from "react";

// Ambil data async + status loading/error. `deps` seperti dependency array useEffect
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
