require("dotenv").config();
const app = require("./src/app");
const conectarBanco = require("./src/config/db");

const PORTA = process.env.PORT || 3000;

async function iniciar() {
  await conectarBanco();
  app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
  });
}

iniciar();
