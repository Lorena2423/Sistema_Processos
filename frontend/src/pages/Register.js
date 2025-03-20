import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import "./Login.css"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente"); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log(name, email, password, role); 

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        alert("Cadastro realizado com sucesso!");
        navigate("/login"); 
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao fazer cadastro. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Cadastrar:</h2>
        <form onSubmit={handleRegister}>
          <label className="login-label">Nome:</label>
          <input
            type="text"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="login-label">Email:</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Senha:</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="login-label">Tipo de Usuário:</label>
          <select
            className="login-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="cliente">Cliente</option>
            <option value="procurador">Procurador</option>
          </select>

          <button type="submit" className="login-button">Cadastrar</button>
        </form>

        <Link to="/login" className="register-link">Já tem uma conta? Faça login</Link>
      </div>
    </div>
  );
};

export default Register;
