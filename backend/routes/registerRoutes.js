const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
  
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }
  
    // Verifica se o email já existe
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error(err);  // Adiciona para você ver o erro no console do servidor
        return res.status(500).json({ success: false, message: "Erro no servidor" });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: "Email já cadastrado" });
      }
  
      // Insere usuário no banco
      db.query(
        "INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, password, role],
        (err, result) => {
          if (err) {
            console.error(err);  // Adiciona para você ver o erro no console do servidor
            return res.status(500).json({ success: false, message: "Erro ao cadastrar usuário" });
          }
  
          res.status(201).json({ success: true, message: "Usuário cadastrado com sucesso!" });
        }
      );
    });
  });

module.exports = router;
