# 📚 Biblioteca API — Sistema de Cadastro e Empréstimo de Livros

## 🎯 Objetivo do projeto

Este projeto implementa uma API REST para uma biblioteca completa, com gerenciamento de livros, usuários, empréstimos e relatórios.

A aplicação foi construída com Node.js, Express e MongoDB, com foco em autenticação, segurança, validação e experiência de uso via frontend estático.

## ✨ Funcionalidades implementadas

- Cadastro, listagem, busca, atualização e remoção de livros
- Upload de capa de livro por URL ou por arquivo local
- Exibição da capa diretamente no catálogo de livros
- Cadastro, listagem, busca, atualização e remoção de usuários
- Upload de avatar de usuário
- Autenticação JWT com login de usuário e bibliotecário
- Proteção de rotas sensíveis por perfil (bibliotecário)
- Registro de empréstimos, devoluções e controle de disponibilidade
- Agrupamento de empréstimos por cliente na visão de bibliotecário
- Histórico de movimentações da biblioteca
- Relatórios administrativos com métricas e receita
- Paginação em listagens de livros e usuários
- Validação de dados com Joi
- Fallback para MongoDB em memória caso o MongoDB local não esteja disponível
- Testes automatizados com Jest + Supertest
- Deploy preparado para Render

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
├── estrtura.html
├── style.css
├── app.js
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── emprestimoController.js
    │   ├── livroController.js
    │   ├── relatorioController.js
    │   ├── historicoController.js
    │   └── usuarioController.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── uploadMiddleware.js
    │   └── validateMiddleware.js
    ├── models/
    │   ├── Emprestimo.js
    │   ├── Livro.js
    │   ├── Movimentacao.js
    │   └── Usuario.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── emprestimoRoutes.js
    │   ├── livroRoutes.js
    │   ├── usuarioRoutes.js
    │   ├── relatorioRoutes.js
    │   └── historicoRoutes.js
    ├── utils/
    │   └── historico.js
    └── validators/
        └── usuarioValidator.js
```

## ⚙️ Requisitos técnicos

- Node.js 18 ou superior
- MongoDB local ou conta no MongoDB Atlas
- Postman ou Insomnia para testes de API
- Git para versionamento

## 🚀 Como iniciar o projeto

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
   JWT_SECRET=sua-chave-secreta
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

5. Abra no navegador:
   ```text
   http://localhost:3000
   ```

> Se o MongoDB local não estiver disponível, a aplicação tenta um banco em memória automaticamente.

## 🧪 Como testar

### Teste local rápido

1. Instale dependências:
   ```bash
   npm install
   ```

2. Execute o servidor:
   ```bash
   npm start
   ```

3. Abra `http://localhost:3000` no navegador para acessar a interface.

4. Use o frontend embutido ou ferramentas como Postman para testar as APIs.

### Rodar testes automatizados

```bash
npm test
```

## 🔐 Fluxo básico de uso

### 1. Criar um usuário (bibliotecário)
```http
POST /api/usuarios
Content-Type: application/json
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

### 2. Fazer login
```http
POST /api/auth/login
Content-Type: application/json
```

Body:
```json
{
  "email": "ana@email.com",
  "senha": "123456"
}
```

### 3. Usar o token

Adicione este header nas requisições protegidas:
```http
Authorization: Bearer <token>
```

### 4. Cadastrar livro com URL de capa
```http
POST /api/livros
Content-Type: application/json
Authorization: Bearer <token>
```

Body:
```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "isbn": "1234567890",
  "categoria": "Clássico",
  "capaUrl": "https://exemplo.com/capa.jpg",
  "anoPublicacao": 1899,
  "quantidadeTotal": 5
}
```

### 5. Enviar capa por arquivo
```http
PUT /api/livros/:id/capa
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Campo: `capa`

### 6. Atualizar avatar de usuário
```http
PUT /api/usuarios/:id/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Campo: `avatar`

## 📌 Rotas principais

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/login` | Login e retorno de JWT |

### Usuários
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/usuarios` | Cadastra usuário |
| GET | `/api/usuarios` | Lista usuários (bibliotecário) |
| GET | `/api/usuarios/:id` | Busca usuário |
| PUT | `/api/usuarios/:id` | Atualiza usuário |
| PUT | `/api/usuarios/:id/avatar` | Atualiza avatar de usuário |
| DELETE | `/api/usuarios/:id` | Remove usuário |

### Livros
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/livros` | Cadastra livro (aceita `capaUrl`) |
| GET | `/api/livros` | Lista livros com filtros |
| GET | `/api/livros/:id` | Busca livro |
| PUT | `/api/livros/:id` | Atualiza livro |
| PUT | `/api/livros/:id/capa` | Envia capa por arquivo |
| DELETE | `/api/livros/:id` | Remove livro |

### Empréstimos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/emprestimos` | Registra empréstimo |
| GET | `/api/emprestimos` | Lista empréstimos |
| GET | `/api/emprestimos/atrasados` | Lista atrasados |
| GET | `/api/emprestimos/:id` | Busca empréstimo |
| PUT | `/api/emprestimos/:id/devolver` | Registra devolução |

### Administração
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/historico/movimentacoes` | Lista movimentações |
| GET | `/api/relatorios/estatisticas` | Retorna métricas e receita |

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

Projeto com API funcional para biblioteca, incluindo frontend estático, upload de imagens, autenticação segura, histórico e relatórios.

