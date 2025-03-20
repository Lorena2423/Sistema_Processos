const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Conexão com o banco
const { authenticateToken } = require('../middleware/auth'); // Importação do middleware
const router = express.Router();

const secretKey = 'sua_chave_secreta'; // Substitua por algo mais seguro em produção

// Rota de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    console.log("Email recebido:", email); // Log do email recebido
  
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err || results.length === 0) {
        console.log("Erro na consulta ou usuário não encontrado:", err);
        return res.status(400).json({ error: 'Credenciais inválidas', details: err.message });
      }
  
      const user = results[0];
  
      console.log("Senha do banco: ", user.password); // Senha armazenada em texto simples
      console.log("Senha fornecida: ", password);    // Senha que veio do Postman
  
      // Comparando diretamente as senhas em texto simples (idealmente, deve-se usar bcrypt para segurança)
      if (password !== user.password) {
        console.log("Senha inválida");
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }
  
      // Cria um token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
      console.log("Token gerado:", token); // Log do token gerado
  
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    });
});

// Rota de registro
router.post('/register', async (req, res) => {
  const { nome, email, senha, role } = req.body;

  const query = 'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, email, senha, role], (err, result) => {
    if (err) {
      console.error("Erro ao registrar usuário:", err);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
    res.status(201).json({ id: result.insertId, nome, email, role });
  });
});

// Editar Dados de Perfil (Todos os usuários)
router.put('/perfil', authenticateToken, (req, res) => {
    const { nome, email, senha } = req.body;
    const user_id = req.user.id;

    const query = 'UPDATE users SET nome = ?, email = ?, password = ? WHERE id = ?';
    db.query(query, [nome, email, senha, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar perfil' });
        }
        res.json({ message: 'Perfil atualizado com sucesso' });
    });
});

// Rota para obter os dados do usuário autenticado (com autenticação)
router.get('/user', authenticateToken, async (req, res) => {
  const query = 'SELECT id, nome, email, role FROM users WHERE id = ?';
  db.query(query, [req.user.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(results[0]); // Retorna apenas os dados do usuário autenticado
  });
});

module.exports = router;
