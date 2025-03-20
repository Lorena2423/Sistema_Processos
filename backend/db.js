const mysql = require("mysql2"); // Usando mysql2 para a conexão com o banco de dados MySQL

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",          // Servidor MySQL
  user: "root",               // Usuário
  password: "Mey242006@",     // Senha
  database: "processos_db"    // Nome do banco de dados
});

// Verificando a conexão
db.connect((err) => {
  if (err) {
    console.error("Erro na conexão com o banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL! ID da thread:", db.threadId); // Logando o ID da thread de conexão
});

// Encerrar a conexão corretamente quando o app for fechado
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error("Erro ao fechar a conexão com o banco:", err);
    }
    console.log("Conexão com o banco fechada");
    process.exit();
  });
});

module.exports = db;
