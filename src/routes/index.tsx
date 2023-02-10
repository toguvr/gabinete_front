import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Demanda from '../pages/Demanda';
import Eleitor from '../pages/Eleitor';
import Equipe from '../pages/Equipe';
import Home from '../pages/Home';
import Signin from '../pages/SignIn';
import Signup from '../pages/SignUp';
import Tarefa from '../pages/Tarefa';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/eleitor" element={<Eleitor />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/equipe" element={<Equipe />} />
      <Route path="/demanda" element={<Demanda />} />
      <Route path="/tarefa" element={<Tarefa />} />
    </Routes>
  );
}
