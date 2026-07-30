const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
let mongoServer;

async function conectarBanco() {
  const envUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const localUri = "mongodb://127.0.0.1:27017/biblioteca";
  const connectOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  const urisToTry = envUri ? [envUri, localUri] : [localUri];

  for (const uri of urisToTry) {
    try {
      await mongoose.connect(uri, connectOptions);
      console.log(`MongoDB conectado com sucesso! URI: ${uri}`);
      return;
    } catch (erro) {
      console.warn(`Não foi possível conectar ao MongoDB (${uri}):`, erro.message);
    }
  }

  console.warn('Tentando fallback para MongoDB em memória...');

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
    await mongoose.connect(memoryUri, connectOptions);
    console.log("MongoDB em memória conectado com sucesso!");
  } catch (erro) {
    console.error("Falha ao iniciar MongoMemoryServer:", erro.message);
    if (envUri) {
      console.error("Verifique a conexão e a variável MONGO_URI/MONGODB_URI.");
    }
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
