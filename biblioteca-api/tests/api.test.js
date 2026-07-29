const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../src/app");
const { conectarBanco } = require("../src/config/db");
const Usuario = require("../src/models/Usuario");
const Livro = require("../src/models/Livro");

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
  } catch (erro) {
    console.warn("MongoMemoryServer falhou, tentando MongoDB local:", erro.message);
  }

  await conectarBanco();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer && typeof mongoServer.stop === "function") {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Usuario.deleteMany({});
  await Livro.deleteMany({});
});

describe("Autenticação JWT", () => {
  it("deve criar usuário com senha e realizar login com JWT", async () => {
    const createResponse = await request(app).post("/api/usuarios").send({
      nome: "Ana",
      email: "ana@email.com",
      senha: "123456",
      role: "bibliotecario",
    });

    expect(createResponse.status).toBe(201);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "ana@email.com",
      senha: "123456",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.usuario.role).toBe("bibliotecario");
  });
});

describe("Paginação e validação", () => {
  it("deve paginar a listagem de livros e rejeitar dados inválidos", async () => {
    await Livro.create([
      { titulo: "Dom Casmurro", autor: "Machado", isbn: "111", quantidadeTotal: 2, quantidadeDisponivel: 2 },
      { titulo: "O Cortiço", autor: "Aluísio", isbn: "222", quantidadeTotal: 1, quantidadeDisponivel: 1 },
      { titulo: "Memórias Póstumas", autor: "Machado", isbn: "333", quantidadeTotal: 1, quantidadeDisponivel: 1 },
    ]);

    const listResponse = await request(app).get("/api/livros?page=1&limit=2");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items).toHaveLength(2);
    expect(listResponse.body.totalItens).toBe(3);
    expect(listResponse.body.totalPaginas).toBe(2);

    const invalidResponse = await request(app).post("/api/usuarios").send({
      nome: "",
      email: "email-invalido",
      senha: "12",
    });

    expect(invalidResponse.status).toBe(400);
    expect(invalidResponse.body.erro).toBeDefined();
  });
});
