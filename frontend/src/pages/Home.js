import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import "boxicons/css/boxicons.min.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [processos, setProcessos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    axios
      .get("http://localhost:3000/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        fetchProcessos(response.data.id, response.data.role);
      })
      .catch((error) => {
        console.error("Erro ao obter informações do usuário:", error);
        navigate("/login");
      });
  }, [navigate]);

  const fetchProcessos = (userId, role) => {
    axios
      .get("http://localhost:3000/processos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (role === "cliente") {
          setProcessos(response.data.filter(p => p.cliente_id === userId));
        } else if (role === "procurador") {
          setProcessos(response.data.filter(p => p.procurador_id === userId));
        }
      })
      .catch((error) => console.error("Erro ao carregar processos:", error));
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <i className="bx bx-user-circle user-icon"></i>
          <div className="user-details">
            <p>{user.name}</p>
            <p>ID: {user.id}</p>
          </div>
        </div>
        <nav>
          <button className="nav-button" onClick={() => navigate("/meus-processos")}> 
            <i className="bx bx-book-open"></i> Meus Processos
          </button>
          {user.role === "procurador" && (
            <button className="nav-button" onClick={() => navigate("/criar-processo")}>
              <i className="bx bxs-paste"></i> Criar Processos
            </button>
          )}
          <button className="nav-button" onClick={() => navigate("/detalhes-processo")}> 
            <i className="bx bx-spreadsheet"></i> Detalhes Processos
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header>
          
        </header>
        <section className="process-section">
          <div className="process-header">Meus Processos:</div>
          <div className="process-list">
            {processos.length > 0 ? (
              processos.map((process) => (
                <div key={process.id} className="process-card">
                  <p><strong>Número:</strong> {process.numero}</p>
                  <p><strong>Status:</strong> {process.status}</p>
                  <p><strong>Assunto:</strong> {process.assunto}</p>
                </div>
              ))
            ) : (
              <p>Nenhum processo encontrado.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
