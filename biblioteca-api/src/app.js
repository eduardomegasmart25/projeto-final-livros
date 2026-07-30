const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const livroRoutes = require("./routes/livroRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const emprestimoRoutes = require("./routes/emprestimoRoutes");
const authRoutes = require("./routes/authRoutes");
const historicoRoutes = require("./routes/historicoRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "estrtura.html"));
});

app.get("/api", (req, res) => {
  res.status(200).json({
    mensagem: "API da Biblioteca está funcionando!",
    rotas: {
      livros: "/api/livros",
      usuarios: "/api/usuarios",
      emprestimos: "/api/emprestimos",
      historico: "/api/historico/movimentacoes",
      relatorios: "/api/relatorios/estatisticas",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/livros", livroRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/emprestimos", emprestimoRoutes);
app.use("/api/historico", historicoRoutes);
app.use("/api/relatorios", relatorioRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ erro: "Erro interno no servidor" });
});

module.exports = app;
