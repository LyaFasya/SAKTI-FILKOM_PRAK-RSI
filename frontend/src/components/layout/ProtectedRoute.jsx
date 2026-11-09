import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

// Membungkus halaman yang wajib login.
// `roles` (opsional): daftar role yang boleh masuk, misal ["staf"].
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const lokasi = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ dari: lokasi }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
