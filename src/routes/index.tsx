import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Demanda from "../pages/Demanda";
import Eleitor from "../pages/Eleitor";
import Equipe from "../pages/Equipe";
import Home from "../pages/Home";
import Signin from "../pages/SignIn";
import Tarefa from "../pages/Tarefa";

export default function AppRoutes() {
  // const ProtectedRoute = ({ user, redirectPath = "/landing", children }) => {
  //   if (!user) {
  //     return <Navigate to={redirectPath} replace />;
  //   }

  //   return children;
  // };

  return (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/" element={<Home />} />
      <Route path="/eleitor" element={<Eleitor />} />
      <Route path="/equipe" element={<Equipe />} />
      <Route path="/demanda" element={<Demanda />} />
      <Route path="/tarefa" element={<Tarefa />} />
    </Routes>
  );
}
