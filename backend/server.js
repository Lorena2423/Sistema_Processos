const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const processRoutes = require('./routes/processRoutes');
const loginRoutes = require('./routes/loginRoutes'); 
const registerRoutes = require('./routes/registerRoutes');

// criar aplicativo Express
const app = express();

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.json()); 

// Rotas
app.use('/auth', authRoutes);
app.use('/processos', processRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

// Configuração da porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
