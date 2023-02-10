import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Demanda from '../pages/Demanda';
import Eleitor from '../pages/Eleitor';
import Equipe from '../pages/Equipe';
import Home from '../pages/Home';
import Tarefa from '../pages/Tarefa';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/eleitor" element={<Eleitor />} />
      <Route path="/equipe" element={<Equipe />} />
      <Route path="/demanda" element={<Demanda />} />
      <Route path="/tarefa" element={<Tarefa />} />
    </Routes>
  );
}
