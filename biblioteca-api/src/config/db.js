const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
let mongoServer;

async function conectarBanco() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/biblioteca";
  const connectOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  try {
    await mongoose.connect(uri, connectOptions);
    console.log("MongoDB conectado com sucesso!");
    return;
  } catch (erro) {
    console.warn("Não foi possível conectar ao MongoDB local:", erro.message);
  }

  if (process.env.NODE_ENV === "production") {
    console.error("MongoDB de produção indisponível. Abortando.");
    process.exit(1);
  }

  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create({
      instance: {
        args: ["--nounixsocket"],
      },
      binary: {
        version: "8.2.6",
      },
    });
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log("MongoDB em memória conectado com sucesso!");
  } catch (erro) {
    console.error("Falha ao iniciar MongoMemoryServer:", erro.message);
    process.exit(1);
  }
}

async function desconectarBanco() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

module.exports = {
  conectarBanco,
  desconectarBanco,
};
