import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProcessDetails.css';

const ProcessDetails = () => {
  const { id } = useParams();  
  const [processo, setProcesso] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/login");  
      return;
    }

    const fetchData = async () => {
      try {
        // Obtém os dados do usuário logado
        const userResponse = await axios.get('http://localhost:3000/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (userResponse.data && userResponse.data.role) {
          setUserRole(userResponse.data.role);
        }

        // Obtém os detalhes do processo usando o id da URL
        const processResponse = await axios.get(`http://localhost:3000/processos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProcesso(processResponse.data);  // Atualiza o estado com os dados do processo
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();  // Chama a função para buscar dados
  }, [id, navigate]);  // Dependência do id e navigate

  if (!processo) return <p>Carregando...</p>;  // Mostra "Carregando..." enquanto os dados não chegam

  return (
    <div className="container">
      <aside className="sidebar">
        <nav>
          <button onClick={() => navigate("/meus-processos")}>Meus Processos</button>
          {userRole === "procurador" && <button onClick={() => navigate("/create-process")}>Criar Processo</button>}
        </nav>
      </aside>

      <main className="main-content">
        <h1>Detalhes do Processo</h1>
        <p><strong>Número:</strong> {processo.numero}</p>
        <p><strong>Nome:</strong> {processo.nome}</p>
        <p><strong>Assunto:</strong> {processo.assunto}</p>
        <p><strong>Descrição:</strong> {processo.descricao}</p>
        <p><strong>Data Início:</strong> {processo.data_inicio}</p>
        <p><strong>Data Fim:</strong> {processo.data_fim}</p>
      </main>
    </div>
  );
};

export default ProcessDetails;
