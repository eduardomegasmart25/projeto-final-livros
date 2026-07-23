# 📚 Biblioteca API — Sistema de Cadastro e Empréstimo de Livros

Projeto final de curso: API REST em **Node.js + Express + MongoDB (Mongoose)** para cadastro de livros, usuários e controle de empréstimos.

## 🧱 Estrutura do projeto

```
biblioteca-api/
├── server.js                 # ponto de entrada
├── package.json
├── .env.example
├── postman_collection.json   # collection pronta para importar no Postman
└── src/
    ├── app.js                # configuração do Express
    ├── config/
    │   └── db.js              # conexão com o MongoDB
    ├── models/
    │   ├── Livro.js
    │   ├── Usuario.js
    │   └── Emprestimo.js
    ├── controllers/
    │   ├── livroController.js
    │   ├── usuarioController.js
    │   └── emprestimoController.js
    └── routes/
        ├── livroRoutes.js
        ├── usuarioRoutes.js
        └── emprestimoRoutes.js
```

## ⚙️ Pré-requisitos

- Node.js instalado (v18+)
- MongoDB instalado localmente **ou** uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Postman instalado

## 🚀 Como rodar o projeto

1. Extraia os arquivos e abra a pasta no terminal.

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Renomeie `.env.example` para `.env`
   - Ajuste `MONGO_URI` para o seu MongoDB local ou Atlas

4. Inicie o MongoDB local (se não estiver usando Atlas):
   ```bash
   mongod
   ```

5. Rode o servidor:
   ```bash
   npm start
   ```
   ou, para reiniciar automaticamente a cada alteração:
   ```bash
   npm run dev
   ```

6. Você verá no terminal:
   ```
   MongoDB conectado com sucesso!
   Servidor rodando em http://localhost:3000
   ```

## 🧪 Como testar no Postman

1. Abra o Postman.
2. Clique em **Import** → selecione o arquivo `postman_collection.json`.
3. A collection **"Biblioteca API - Cadastro e Empréstimos"** vai aparecer com 3 pastas: Livros, Usuários e Empréstimos.
4. Ela já usa uma variável `{{baseUrl}}` apontando para `http://localhost:3000` — não precisa reescrever a URL em cada requisição.

### Fluxo sugerido de teste

1. **Criar livro** (`POST /api/livros`) → copie o `_id` retornado.
2. **Criar usuário** (`POST /api/usuarios`) → copie o `_id` retornado.
3. Nas variáveis da collection (ou direto na URL), cole os IDs em `livroId` e `usuarioId`.
4. **Criar empréstimo** (`POST /api/emprestimos`) enviando `livroId` e `usuarioId` → copie o `_id` do empréstimo.
5. **Listar empréstimos** (`GET /api/emprestimos`) para conferir que o livro ficou com `quantidadeDisponivel` reduzida.
6. **Devolver livro** (`PUT /api/emprestimos/:id/devolver`) → confira que `quantidadeDisponivel` do livro voltou a subir e o status virou `devolvido`.

## 📌 Rotas disponíveis

### Livros — `/api/livros`
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/livros` | Cadastra um novo livro |
| GET | `/api/livros` | Lista livros (filtros opcionais: `?titulo=`, `?autor=`, `?categoria=`, `?disponivel=true`) |
| GET | `/api/livros/:id` | Busca um livro pelo ID |
| PUT | `/api/livros/:id` | Atualiza dados de um livro |
| DELETE | `/api/livros/:id` | Remove um livro |

### Usuários — `/api/usuarios`
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/usuarios` | Cadastra um novo usuário |
| GET | `/api/usuarios` | Lista usuários (filtros: `?nome=`, `?email=`) |
| GET | `/api/usuarios/:id` | Busca um usuário pelo ID |
| PUT | `/api/usuarios/:id` | Atualiza dados de um usuário |
| DELETE | `/api/usuarios/:id` | Remove um usuário |

### Empréstimos — `/api/emprestimos`
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/emprestimos` | Registra um empréstimo (body: `livroId`, `usuarioId`, `diasParaDevolucao` opcional) |
| GET | `/api/emprestimos` | Lista empréstimos (filtros: `?status=`, `?usuarioId=`, `?livroId=`) |
| GET | `/api/emprestimos/atrasados` | Lista empréstimos com devolução atrasada |
| GET | `/api/emprestimos/:id` | Busca um empréstimo pelo ID |
| PUT | `/api/emprestimos/:id/devolver` | Registra a devolução do livro |

## 🧠 Regras de negócio implementadas

- Um livro só pode ser emprestado se `quantidadeDisponivel > 0`.
- Ao emprestar, `quantidadeDisponivel` do livro é decrementada em 1.
- Ao devolver, `quantidadeDisponivel` é incrementada em 1 e o status do empréstimo vira `devolvido`.
- Prazo padrão de devolução: 7 dias (pode ser customizado enviando `diasParaDevolucao` no corpo da requisição).
- A rota `/api/emprestimos/atrasados` atualiza automaticamente o status para `atrasado` quando a data prevista já passou e o livro não foi devolvido.
- ISBN de livro e e-mail de usuário são únicos no banco (retornam erro 409 se duplicados).

## 🛠️ Tecnologias usadas

- Node.js
- Express
- Mongoose (MongoDB)
- dotenv
- cors
- morgan (logs das requisições)

## ✅ Próximos passos sugeridos (melhorias futuras)

- Autenticação com JWT (login de bibliotecário/usuário)
- Paginação nas listagens
- Validação de dados com uma lib como `joi` ou `zod`
- Testes automatizados com `jest` + `supertest`
- Deploy (Render, Railway) + MongoDB Atlas
