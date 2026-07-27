# 📚 Biblioteca API — Sistema de Cadastro e Empréstimo de Livros

## 🎯 Objetivo do projeto

Este projeto tem como finalidade desenvolver uma API REST para o gerenciamento de uma biblioteca, permitindo o cadastro de livros, usuários e empréstimos, com foco em organização, segurança e facilidade de uso.

A aplicação foi construída com Node.js, Express e MongoDB, seguindo boas práticas de estruturação, autenticação e validação de dados.

## ✨ Funcionalidades implementadas

- Cadastro, listagem, busca, atualização e remoção de livros
- Cadastro, listagem, busca, atualização e remoção de usuários
- Registro de empréstimos e devoluções
- Controle de disponibilidade de exemplares
- Autenticação com JWT para login de bibliotecário/usuário
- Proteção de rotas sensíveis por perfil
- Paginação nas listagens de livros e usuários
- Validação de dados com Joi
- Testes automatizados com Jest + Supertest
- Configuração para deploy no Render

## 🧱 Estrutura do projeto

```text
biblioteca-api/
├── package.json
├── server.js
├── render.yaml
├── .env.example
├── postman_collection.json
├── tests/
│   └── api.test.js
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── emprestimoController.js
    │   ├── livroController.js
    │   └── usuarioController.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   └── validateMiddleware.js
    ├── models/
    │   ├── Emprestimo.js
    │   ├── Livro.js
    │   └── Usuario.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── emprestimoRoutes.js
    │   ├── livroRoutes.js
    │   └── usuarioRoutes.js
    └── validators/
        └── usuarioValidator.js
```

## ⚙️ Requisitos técnicos

- Node.js 18 ou superior
- MongoDB local ou conta no MongoDB Atlas
- Postman ou Insomnia para testes das rotas
- Git para versionamento

## 🚀 Passo a passo para execução local

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd biblioteca-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` com base no `.env.example`:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/biblioteca
   JWT_SECRET=sua-chave-segura
   NODE_ENV=development
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

   Ou em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

5. A API ficará disponível em:
   ```text
   http://localhost:3000
   ```

## 🧪 Como podem testar

### Opção 1: teste local
Cada integrante pode seguir estes passos:

1. Clonar o projeto:
   ```bash
   git clone <url-do-repositorio>
   cd biblioteca-api
   ```

2. Instalar dependências:
   ```bash
   npm install
   ```

3. Criar o arquivo `.env` com os valores acima.

4. Rodar a API:
   ```bash
   npm start
   ```

5. Usar o Postman/Insomnia para testar as rotas.

### Opção 2: testar via deploy
Se a API já estiver publicada no Render, o grupo pode testar diretamente pela URL gerada, por exemplo:
```text
https://seu-app.onrender.com
```

### Fluxo recomendado para testar o projeto
1. Criar um usuário:
   ```http
   POST /api/usuarios
   ```
   Body:
   ```json
   {
     "nome": "Ana",
     "email": "ana@email.com",
     "senha": "123456",
     "role": "bibliotecario"
   }
   ```

2. Fazer login:
   ```http
   POST /api/auth/login
   ```
   Body:
   ```json
   {
     "email": "ana@email.com",
     "senha": "123456"
   }
   ```

3. Copiar o token retornado e usar no header:
   ```http
   Authorization: Bearer <token>
   ```

4. Criar um livro:
   ```http
   POST /api/livros
   ```

5. Criar um empréstimo:
   ```http
   POST /api/emprestimos
   ```

### Testes automáticos
Execute:

```bash
npm test
```

Os testes cobrem cenários de login JWT e validação/paginação de listagens.

## 🔐 Autenticação

### Login

Rota:
```http
POST /api/auth/login
```

Body:
```json
{
  "email": "bibliotecario@email.com",
  "senha": "123456"
}
```

Resposta:
```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "...",
  "usuario": {
    "id": "...",
    "nome": "...",
    "email": "...",
    "role": "bibliotecario"
  }
}
```

Use o token no header:
```http
Authorization: Bearer <token>
```

## 📌 Rotas principais

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Faz login e retorna JWT |

### Livros
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/livros` | Cadastra um livro (apenas bibliotecário) |
| GET | `/api/livros` | Lista livros com paginação e filtros |
| GET | `/api/livros/:id` | Busca um livro |
| PUT | `/api/livros/:id` | Atualiza um livro (apenas bibliotecário) |
| DELETE | `/api/livros/:id` | Remove um livro (apenas bibliotecário) |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/usuarios` | Cadastra um usuário |
| GET | `/api/usuarios` | Lista usuários com paginação |
| GET | `/api/usuarios/:id` | Busca um usuário |
| PUT | `/api/usuarios/:id` | Atualiza um usuário |
| DELETE | `/api/usuarios/:id` | Remove um usuário |

### Empréstimos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/emprestimos` | Registra um empréstimo |
| GET | `/api/emprestimos` | Lista empréstimos |
| GET | `/api/emprestimos/atrasados` | Lista empréstimos atrasados |
| GET | `/api/emprestimos/:id` | Busca um empréstimo |
| PUT | `/api/emprestimos/:id/devolver` | Registra a devolução |

## 🔎 Exemplos de consulta

### Listar livros com paginação
```http
GET /api/livros?page=1&limit=5
```

### Filtrar livros disponíveis
```http
GET /api/livros?disponivel=true
```

### Buscar usuários por nome
```http
GET /api/usuarios?nome=ana
```

## 🧠 Regras de negócio

- Um livro só pode ser emprestado se houver exemplares disponíveis
- Ao emprestar, a quantidade disponível é reduzida
- Ao devolver, a quantidade disponível volta a subir
- O prazo padrão de devolução é de 7 dias
- O status do empréstimo pode ser `emprestado`, `devolvido` ou `atrasado`
- ISBN do livro e e-mail do usuário são únicos

## ☁️ Deploy no Render

A aplicação já conta com o arquivo `render.yaml` para deploy no Render.

Variáveis de ambiente recomendadas:
```env
PORT=3000
NODE_ENV=production
MONGO_URI=sua_uri_do_mongodb_atlas
JWT_SECRET=sua_chave_secreta
```

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Joi
- Jest + Supertest
- CORS + Morgan

## ✅ Conclusão

Este projeto demonstra a implementação de uma API REST funcional, com foco em organização de dados, controle de empréstimos, autenticação segura e testes automatizados, sendo adequado para uso acadêmico e para apresentação em trabalho de curso.

