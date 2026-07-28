const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const livroRoutes = require("./routes/livroRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const emprestimoRoutes = require("./routes/emprestimoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rota inicial só para checar se a API está no ar
app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "API da Biblioteca está funcionando!",
    rotas: {
      livros: "/api/livros",
      usuarios: "/api/usuarios",
      emprestimos: "/api/emprestimos",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/livros", livroRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/emprestimos", emprestimoRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Tratador de erros genérico
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ erro: "Erro interno no servidor" });
});

module.exports = app;
