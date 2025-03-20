const jwt = require('jsonwebtoken');
const secretKey = 'sua_chave_secreta'; // Substitua por algo mais seguro em produção

// Middleware para verificar se o usuário está autenticado
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação ausente' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user; // Adiciona o usuário no objeto da requisição
    next();
  });
};

// Middleware para verificar se o usuário tem a função necessária (ex: procurador)
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
