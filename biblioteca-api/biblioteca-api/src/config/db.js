const mongoose = require("mongoose");

async function conectarBanco() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/biblioteca";
    await mongoose.connect(uri);
    console.log("MongoDB conectado com sucesso!");
  } catch (erro) {
    console.error("Erro ao conectar no MongoDB:", erro.message);
    process.exit(1);
  }
}

module.exports = conectarBanco;
