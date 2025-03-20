import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateProcessPage from './pages/CreateProcess';
import ProcessDetailPage from './pages/ProcessDetails';
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/create-process" element={<CreateProcessPage />} />
          <Route path="/process-details/:id" element={<ProcessDetailPage />} />
        </Route>

        {/* Qualquer rota desconhecida redireciona para login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
