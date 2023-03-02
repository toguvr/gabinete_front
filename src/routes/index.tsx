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
import DemandaRegisterVoter from "../pages/DemandRegisterVoter";

interface PrivateRoutesProps {
  isPrivate: boolean;
}

export const publicRoute = {};

export const privateRoute = [
  { pathname: "/home", permissionName: "home_page" },
  { pathname: "/cargo", permissionName: "cargo_page" },
  { pathname: "/equipe", permissionName: "equipe_page" },
  { pathname: "/eleitor", permissionName: "eleitor_page" },
  { pathname: "/demanda", permissionName: "demandas_page" },
  { pathname: "/tarefa", permissionName: "tarefas_page" },
];

export default function AppRoutes() {
  const AuthenticatedRoutes = ({ isPrivate }: PrivateRoutesProps) => {
    const { isAuthenticated, role } = useAuth();
    const userMainRoute = () => {
      const currentRole = role as any;
      const filteredRoutes = privateRoute.find((route) => {
        return currentRole[route?.permissionName] > 0;
      });

      return filteredRoutes?.pathname || "/404";
    };

    return isAuthenticated === isPrivate ? (
      <Outlet />
    ) : (
      <Navigate to={isPrivate ? "/" : userMainRoute()} replace />
    );
  };

  return (
    <Routes>
      <Route element={<AuthenticatedRoutes isPrivate />}>
        <Route path="/home" element={<Home />} />

        <Route path="/equipe" element={<Permission />} />
        <Route path="/equipe/:id" element={<PermissionEdit />} />
        <Route path="/registrar-equipe" element={<PermissionRegister />} />

        <Route path="/eleitor" element={<Voter />} />
        <Route path="/eleitor/:id" element={<VoterEdit />} />
        <Route path="/registrar-eleitor" element={<VoterRegister />} />

        <Route path="/demanda" element={<Demand />} />
        <Route path="/demanda/:id" element={<DemandEdit />} />
        <Route path="/registrar-demanda" element={<DemandRegister />} />
        <Route
          path="/demanda/registrar-eleitor"
          element={<DemandaRegisterVoter />}
        />

        <Route path="/cargo" element={<Roles />} />
        <Route path="/registrar-cargo" element={<RoleRegister />} />
        <Route path="/cargo/:id" element={<RoleEdit />} />

        <Route path="/tarefa" element={<Tarefa />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/trocar-senha" element={<ChangePassword />} />
      </Route>

      <Route element={<AuthenticatedRoutes isPrivate={false} />}>
        <Route path="/" element={<Signin />} />
        <Route path="/esqueci-senha" element={<ForgetPassword />} />
      </Route>
      <Route path="/redefinir-senha" element={<RedefinePassword />} />
    </Routes>
  );
}
