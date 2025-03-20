import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import "./Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userTipo", response.data.role); 
        localStorage.setItem("userId", response.data.userId); 
        localStorage.setItem("userName", response.data.name); 
        navigate("/home"); 
      } else {
        alert("Credenciais inválidas!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login:</h2>
        <form onSubmit={handleLogin}>
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
          
          <button type="submit" className="login-button">Entrar</button>
        </form>
        
        <Link to="/register" className="register-link">Cadastrar-se</Link> 
      </div>
    </div>
  );
};

export default Login;
