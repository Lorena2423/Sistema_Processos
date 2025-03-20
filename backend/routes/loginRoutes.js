const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();
require("dotenv").config();

// Endpoint de login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email e senha são obrigatórios" });
  }

  // Verifica se o usuário existe no banco
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Erro no servidor" });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }

    const user = results[0];

    // Comparar a senha diretamente 
    if (password !== user.password) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ success: true, token, role: user.role, userId: user.id, name: user.nome });
  });
});

module.exports = router;
