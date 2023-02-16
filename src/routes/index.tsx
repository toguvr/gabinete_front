import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import RegisterVoter from "../pages/RegisterVoter";
import Team from "../pages/Team";
import RegisterTeam from "../pages/RegisterTeam";
import Home from "../pages/Home";
import Signin from "../pages/SignIn";
import Tarefa from "../pages/Tarefa";
import ForgetPassword from "../pages/ForgetPassword";
import RedefinePassword from "../pages/RedefinePassword";
import Voter from "../pages/Voter";

import { useAuth } from "../contexts/AuthContext";
import Demand from "../pages/Demand";

interface PrivateRoutesProps {
  isPrivate: boolean;
}

export default function AppRoutes() {
  const AuthenticatedRoutes = ({ isPrivate }: PrivateRoutesProps) => {
    const { isAuthenticated } = useAuth();
    const { pathname } = useLocation();

    console.log("isAuthenticated", isAuthenticated);
    console.log("ISPRIVATE", isPrivate);
    console.log("===", isAuthenticated === isPrivate);
    console.log("goto", isPrivate ? "/signin" : "/");
    console.log("pathname", pathname);
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
        <Route path="/equipe" element={<Team />} />
        <Route path="/eleitor" element={<Voter />} />
        <Route path="/equipe/registrar-equipe" element={<RegisterTeam />} />
        <Route path="/eleitor/registrar-eleitor" element={<RegisterVoter />} />
        <Route path="/demanda" element={<Demand />} />
        <Route path="/tarefa" element={<Tarefa />} />
      </Route>

      <Route element={<AuthenticatedRoutes isPrivate={false} />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/esqueci-senha" element={<ForgetPassword />} />
      </Route>
      <Route path="/redefinir-senha" element={<RedefinePassword />} />
    </Routes>
  );
}
