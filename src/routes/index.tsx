import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import VoterRegister from '../pages/VoterRegister';
import Permission from '../pages/Permission';
import PermissionRegister from '../pages/PermissionRegister';
import Signin from '../pages/SignIn';
import Tarefa from '../pages/Tarefa';
import ForgetPassword from '../pages/ForgetPassword';
import RedefinePassword from '../pages/RedefinePassword';
import Voter from '../pages/Voter';
import VoterEdit from '../pages/VoterEdit';
import Demand from '../pages/Demand';
import PermissionEdit from '../pages/PermissionEdit';
import NotFound from '../pages/NotFound';
import NotPermission from '../pages/NotPermission';

import { useAuth } from '../contexts/AuthContext';
import Perfil from '../pages/Perfil';
import ChangePassword from '../pages/ChangePassword';
import DemandRegister from '../pages/DemandRegister';
import Roles from '../pages/Roles';
import RoleRegister from '../pages/RoleRegister';
import DemandEdit from '../pages/DemandEdit';
import DemandaRegisterVoter from '../pages/DemandRegisterVoter';
import NoBond from '../pages/NoBond';
import RoleEdit from '../pages/RoleEdit';

interface PrivateRoutesProps {
  isPrivate: boolean;
}

export const publicRoute = {};

export const privateRoute = [
  // { pathname: "/home", permissionName: "home_page" },
  { pathname: '/cargo', permissionName: 'cargo_page' },
  { pathname: '/equipe', permissionName: 'equipe_page' },
  { pathname: '/eleitor', permissionName: 'eleitor_page' },
  { pathname: '/demanda', permissionName: 'demandas_page' },
  { pathname: '/tarefa', permissionName: 'tarefas_page' },
  // { pathname: "/solicitacoes", permissionName: "tarefas_page" },
];

const AuthenticatedRoutes = ({ isPrivate }: PrivateRoutesProps) => {
  const { isAuthenticated, role, office, updateRole } = useAuth();
  const currentRole = role as any;

  const filteredRoutes = privateRoute.find((route) => {
    return currentRole[route?.permissionName] > 0;
  });

  const location = useLocation();

  const isMyCurrentRouteInPrivateRoutes = privateRoute.find((privateRoute) =>
    privateRoute.pathname.includes(location.pathname)
  );

  if (location.pathname !== '/sem-vinculo' && isPrivate && !office.id) {
    return <Navigate to={'/sem-vinculo'} replace />;
  }

  if (
    location.pathname !== '/sem-permissao' &&
    isPrivate &&
    isMyCurrentRouteInPrivateRoutes &&
    currentRole[isMyCurrentRouteInPrivateRoutes?.permissionName] === 0
  ) {
    return <Navigate to={'/sem-permissao'} replace />;
  }

  const userMainRoute = () => {
    return filteredRoutes?.pathname || '/sem-vinculo';
  };

  return isAuthenticated === isPrivate ? (
    <Outlet />
  ) : (
    <Navigate to={isPrivate ? '/' : userMainRoute()} replace />
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthenticatedRoutes isPrivate />}>
        {/* <Route path="/home" element={<Home />} /> */}

        {/* <Route path="/solicitacoes" element={<Solicitations />} /> */}

        <Route path="/equipe" element={<Permission />} />
        <Route path="/equipe/:id" element={<PermissionEdit />} />
        <Route path="/equipe/registrar-equipe" element={<PermissionRegister />} />

        <Route path="/eleitor" element={<Voter />} />
        <Route path="/eleitor/:id" element={<VoterEdit />} />

        <Route path="/eleitor/registrar-eleitor/:id" element={<VoterRegister />} />

        <Route path="/demanda" element={<Demand />} />
        <Route path="/demanda/:id" element={<DemandEdit />} />
        <Route path="/demanda/registrar-demanda/:id" element={<DemandRegister />} />
        <Route path="/demanda/registrar-demanda" element={<DemandRegister />} />

        <Route path="/cargo" element={<Roles />} />
        <Route path="/cargo/registrar-cargo" element={<RoleRegister />} />
        <Route path="/cargo/:id" element={<RoleEdit />} />

        <Route path="/tarefa" element={<Tarefa />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/trocar-senha" element={<ChangePassword />} />
        <Route path="/sem-permissao" element={<NotPermission />} />
        <Route path="/sem-vinculo" element={<NoBond />} />
      </Route>

      <Route element={<AuthenticatedRoutes isPrivate={false} />}>
        <Route path="/" element={<Signin />} />
        <Route path="/esqueci-senha" element={<ForgetPassword />} />
      </Route>
      <Route path="/redefinir-senha" element={<RedefinePassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
