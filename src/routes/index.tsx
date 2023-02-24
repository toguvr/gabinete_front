import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import VoterRegister from "../pages/VoterRegister";
import Permission from "../pages/Permission";
import PermissionRegister from "../pages/PermissionRegister";
import Home from "../pages/Home";
import Signin from "../pages/SignIn";
import Tarefa from "../pages/Tarefa";
import ForgetPassword from "../pages/ForgetPassword";
import RedefinePassword from "../pages/RedefinePassword";
import Voter from "../pages/Voter";
import VoterEdit from "../pages/VoterEdit";
import Demand from "../pages/Demand";
import PermissionEdit from "../pages/PermissionEdit";

import { useAuth } from "../contexts/AuthContext";
import Perfil from "../pages/Perfil";
import ChangePassword from "../pages/ChangePassword";
import DemandRegister from "../pages/DemandRegister";
import Roles from "../pages/Roles";
import RoleRegister from "../pages/RoleRegister";
import RoleEdit from "../pages/RoleEdit";
import DemandEdit from "../pages/DemandEdit";

interface PrivateRoutesProps {
  isPrivate: boolean;
}

export default function AppRoutes() {
  const AuthenticatedRoutes = ({ isPrivate }: PrivateRoutesProps) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated === isPrivate ? (
      <Outlet />
    ) : (
      <Navigate to={isPrivate ? "/signin" : "/"} replace />
    );
  };

  return (
    <Routes>
      <Route element={<AuthenticatedRoutes isPrivate />}>
        <Route path="/" element={<Home />} />

        <Route path="/equipe" element={<Permission />} />
        <Route path="/equipe/:id" element={<PermissionEdit />} />
        <Route
          path="/equipe/registrar-equipe"
          element={<PermissionRegister />}
        />

        <Route path="/eleitor" element={<Voter />} />
        <Route path="/eleitor/:id" element={<VoterEdit />} />
        <Route path="/eleitor/registrar-eleitor" element={<VoterRegister />} />

        <Route path="/demanda" element={<Demand />} />
        <Route path="/demanda/:id" element={<DemandEdit />} />
        <Route path="/demanda/registrar-demanda" element={<DemandRegister />} />

        <Route path="/cargo" element={<Roles />} />
        <Route path="/cargo/registrar-cargo" element={<RoleRegister />} />
        <Route path="/cargo/:id" element={<RoleEdit />} />

        <Route path="/tarefa" element={<Tarefa />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/trocar-senha" element={<ChangePassword />} />
      </Route>

      <Route element={<AuthenticatedRoutes isPrivate={false} />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/esqueci-senha" element={<ForgetPassword />} />
      </Route>
      <Route path="/redefinir-senha" element={<RedefinePassword />} />
    </Routes>
  );
}
