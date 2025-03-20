import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateProcess from "./pages/CreateProcess";
import ProcessDetailPage from "./pages/ProcessDetails";
import PrivateRoute from "./components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/criar-processo" element={<CreateProcess />} />
          <Route path="/detalhes-processo" element={<ProcessDetailPage />} />
        </Route>

        <Route path="*" element={<Login />} /> {/* Redireciona para Login caso a rota não exista */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
