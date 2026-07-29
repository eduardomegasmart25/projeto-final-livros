try {
  require("dotenv").config();
} catch (erro) {
  console.warn("dotenv não está instalado, pulando carregamento de .env");
}

const app = require("./src/app");
const { conectarBanco, desconectarBanco } = require("./src/config/db");

const PORTA = process.env.PORT || 3000;

async function iniciar() {
  await conectarBanco();
  const server = app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
  });

  process.on("SIGINT", async () => {
    await desconectarBanco();
    server.close(() => process.exit(0));
  });
}

iniciar();
