import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Demand from '../pages/Demand';
import ForgetPassword from '../pages/ForgetPassword';
import NotFound from '../pages/NotFound';
import NotPermission from '../pages/NotPermission';
import Permission from '../pages/Permission';
import PermissionEdit from '../pages/PermissionEdit';
import PermissionRegister from '../pages/PermissionRegister';
import RedefinePassword from '../pages/RedefinePassword';
import Signin from '../pages/SignIn';
import Tarefa from '../pages/Tarefa';
import Voter from '../pages/Voter';
import VoterEdit from '../pages/VoterEdit';
import VoterRegister from '../pages/VoterRegister';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import ChangePassword from '../pages/ChangePassword';
import DemandEdit from '../pages/DemandEdit';
import DemandRegister from '../pages/DemandRegister';
import Home from '../pages/Home';
import NoBond from '../pages/NoBond';
import Perfil from '../pages/Perfil';
import RoleEdit from '../pages/RoleEdit';
import RoleRegister from '../pages/RoleRegister';
import Roles from '../pages/Roles';
import Gabinete from '../pages/Office';
import NotPay from '../pages/NotPay';
import SignUpOwner from '../pages/SignUpOwner';
import SignUpOffice from '../pages/SignUpOffice';
import NotOffice from '../pages/NotOffice';
import nossogabinete from '../assets/nossogabinete.png';
import Curriculum from '../pages/Curriculum';
import CurriculumRegister from '../pages/CurriculumRegister';
import PaymentMethodRegister from '../pages/PaymentMethodRegister';

interface PrivateRoutesProps {
  isPrivate: boolean;
}

export const publicRoute = {};

export const privateRoute = [
  { pathname: '/home', permissionName: 'home_page' },
  { pathname: '/cargo', permissionName: 'cargo_page' },
  { pathname: '/equipe', permissionName: 'equipe_page' },
  { pathname: '/eleitor', permissionName: 'eleitor_page' },
  { pathname: '/demanda', permissionName: 'demandas_page' },
  { pathname: '/tarefa', permissionName: 'tarefas_page' },
  // { pathname: "/solicitacoes", permissionName: "tarefas_page" },
];

const AuthenticatedRoutes = ({ isPrivate }: PrivateRoutesProps) => {
  const { isAuthenticated, role, office } = useAuth();
  const currentRole = role as any;

  const filteredRoutes = privateRoute.find((route) => {
    return currentRole[route?.permissionName] > 0;
  });

  const location = useLocation();

  // const isMyCurrentRouteInPrivateRoutes = privateRoute.find((privateRoute) =>
  //   privateRoute.pathname.includes(location.pathname)
  // );

  if (
    location.pathname !== '/sem-gabinete' &&
    location.pathname !== '/cadastrar-gabinete' &&
    isAuthenticated &&
    !office.id
  ) {
    return <Navigate to={'/sem-gabinete'} replace />;
  }

  if (
    location.pathname !== '/pagamento-nao-efetuado' &&
    Object.keys(office).length !== 0 &&
    isAuthenticated &&
    !office.active
  ) {
    return <Navigate to={'/pagamento-nao-efetuado'} replace />;
  }

  // if (
  //   location.pathname !== '/sem-permissao' &&
  //   isPrivate &&
  //   isMyCurrentRouteInPrivateRoutes &&
  //   currentRole[isMyCurrentRouteInPrivateRoutes?.permissionName] === 0
  // ) {
  //   return <Navigate to={'/sem-permissao'} replace />;
  // }

  const userMainRoute = () => {
    return filteredRoutes?.pathname || '/sem-permissao';
  };

  return isAuthenticated === isPrivate ? (
    <Outlet />
  ) : (
    <Navigate to={isPrivate ? '/' : userMainRoute()} replace />
  );
};

export default function AppRoutes() {
  const { isAuthenticated, office } = useAuth();

  const title = isAuthenticated ? ` Gabinete ${office.name}` : 'Nosso Gabinete';
  const favicon = isAuthenticated ? office.logo_url : nossogabinete;
  const faviconType = isAuthenticated ? 'image/png' : 'image/png';
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="icon" href={favicon} type={faviconType} />
      </Helmet>
      <Routes>
        <Route element={<AuthenticatedRoutes isPrivate />}>
          <Route path="/home" element={<Home />} />

          {/* <Route path="/solicitacoes" element={<Solicitations />} /> */}

          <Route path="/equipe" element={<Permission />} />
          <Route path="/curriculo" element={<Curriculum />} />
          <Route
            path="/curriculo/registrar-curriculo"
            element={<CurriculumRegister />}
          />
          <Route path="/equipe/:id" element={<PermissionEdit />} />
          <Route
            path="/equipe/registrar-equipe"
            element={<PermissionRegister />}
          />
          <Route path="/pagamento" element={<PaymentMethodRegister />} />

          <Route path="/eleitor" element={<Voter />} />
          <Route path="/eleitor/:id" element={<VoterEdit />} />
          <Route
            path="/eleitor/registrar-eleitor"
            element={<VoterRegister />}
          />
          <Route
            path="/eleitor/registrar-eleitor/:id"
            element={<VoterRegister />}
          />

          <Route path="/demanda" element={<Demand />} />
          <Route path="/demanda/:id" element={<DemandEdit />} />
          <Route
            path="/demanda/registrar-demanda/:id"
            element={<DemandRegister />}
          />
          <Route
            path="/demanda/registrar-demanda"
            element={<DemandRegister />}
          />

          <Route path="/cargo" element={<Roles />} />
          <Route path="/cargo/registrar-cargo" element={<RoleRegister />} />
          <Route path="/cargo/:id" element={<RoleEdit />} />

          <Route path="/tarefa" element={<Tarefa />} />

          <Route path="/perfil" element={<Perfil />} />
          <Route path="/gabinete" element={<Gabinete />} />
          <Route path="/trocar-senha" element={<ChangePassword />} />
          <Route path="/sem-permissao" element={<NotPermission />} />
          <Route path="/sem-vinculo" element={<NoBond />} />
          <Route path="/sem-gabinete" element={<NotOffice />} />
          <Route path="/cadastrar-gabinete" element={<SignUpOffice />} />
          <Route path="/pagamento-nao-efetuado" element={<NotPay />} />
        </Route>

        <Route element={<AuthenticatedRoutes isPrivate={false} />}>
          <Route path="/" element={<Signin />} />
          <Route path="/esqueci-senha" element={<ForgetPassword />} />
          <Route path="/cadastrar-proprietario" element={<SignUpOwner />} />
        </Route>
        <Route path="/redefinir-senha" element={<RedefinePassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
