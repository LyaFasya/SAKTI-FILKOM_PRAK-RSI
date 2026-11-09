import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { halamanAwal, routeGroups } from "./routes/index.jsx";

function Beranda() {
  const { user } = useAuth();
  return <Navigate to={halamanAwal[user.role] ?? "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<Beranda />} />
      </Route>

      {/* Tiap kelompok rute boleh punya layout sendiri (grup.layout).
          Kalau tidak diisi, dipakai AppLayout bawaan. */}
      {routeGroups.map((grup, i) => {
        const Layout = grup.layout ?? AppLayout;
        return (
          <Route key={i} element={<ProtectedRoute roles={grup.roles} />}>
            <Route element={<Layout />}>
              {grup.routes.map((rute) => (
                <Route key={rute.path} path={rute.path} element={rute.element} />
              ))}
            </Route>
          </Route>
        );
      })}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
