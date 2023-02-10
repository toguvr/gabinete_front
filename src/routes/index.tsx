import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Demanda from "../pages/Demanda";
import Eleitor from "../pages/Eleitor";
import Equipe from "../pages/Equipe";
import Home from "../pages/Home";
import Signin from "../pages/SignIn";
import Tarefa from "../pages/Tarefa";

export default function AppRoutes() {
  // const AuthenticatedRoutes = () => {
  //   let authenticated = localStorage.getItem("loginGabinete");
  //   return authenticated ? <Outlet /> : <Navigate to="/signin" />;
  // };
  const AuthenticatedRoutes = ({ isAuthenticated }: any) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
  };

  return (
    <Routes>
      <Route element={<AuthenticatedRoutes isAuthenticated={true} />}>
        <Route path="/" element={<Home />} />
        <Route path="/eleitor" element={<Eleitor />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/demanda" element={<Demanda />} />
        <Route path="/tarefa" element={<Tarefa />} />
      </Route>
      <Route path="/signin" element={<Signin />} />
    </Routes>
  );
}
