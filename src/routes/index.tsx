import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import CaixaPage from "../pages/caixa";
import DashboardPage from "../pages/dashboard";
import EstoquePage from "../pages/estoque";
import LoginPage from "../pages/login";
import UsuariosPage from "../pages/usuarios";

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/caixa" element={<CaixaPage />} />
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
      </Routes>
    </HashRouter>
  );
}