const Livro = require("../models/Livro");

// Criar um novo livro
async function criarLivro(req, res) {
  try {
    const { titulo, autor, isbn, categoria, anoPublicacao, quantidadeTotal } = req.body;

    const quantidade = quantidadeTotal !== undefined ? quantidadeTotal : 1;

    const livro = await Livro.create({
      titulo,
      autor,
      isbn,
      categoria,
      anoPublicacao,
      quantidadeTotal: quantidade,
      quantidadeDisponivel: quantidade,
    });

    return res.status(201).json(livro);
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({ erro: "Já existe um livro cadastrado com esse ISBN" });
    }
    return res.status(400).json({ erro: erro.message });
  }
}

// Listar todos os livros (com filtro opcional por título/autor/categoria)
async function listarLivros(req, res) {
  try {
    const { titulo, autor, categoria, disponivel, page = 1, limit = 10 } = req.query;
    const filtro = {};

    if (titulo) filtro.titulo = { $regex: titulo, $options: "i" };
    if (autor) filtro.autor = { $regex: autor, $options: "i" };
    if (categoria) filtro.categoria = { $regex: categoria, $options: "i" };
    if (disponivel === "true") filtro.quantidadeDisponivel = { $gt: 0 };

    const pagina = Math.max(parseInt(page, 10) || 1, 1);
    const limite = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const totalItens = await Livro.countDocuments(filtro);
    const livros = await Livro.find(filtro)
      .sort({ titulo: 1 })
      .skip((pagina - 1) * limite)
      .limit(limite);

    return res.status(200).json({
      items: livros,
      totalItens,
      totalPaginas: Math.ceil(totalItens / limite),
      pagina,
      limite,
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

// Buscar um livro por ID
async function buscarLivroPorId(req, res) {
  try {
    const livro = await Livro.findById(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    return res.status(200).json(livro);
  } catch (erro) {
    return res.status(400).json({ erro: "ID inválido" });
  }
}

// Atualizar um livro
async function atualizarLivro(req, res) {
  try {
    const dadosAtualizados = { ...req.body };
    // Evita que o cliente sobrescreva a disponibilidade de forma inconsistente
    delete dadosAtualizados.quantidadeDisponivel;

    const livro = await Livro.findByIdAndUpdate(req.params.id, dadosAtualizados, {
      new: true,
      runValidators: true,
    });

    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    return res.status(200).json(livro);
  } catch (erro) {
    return res.status(400).json({ erro: erro.message });
  }
}

// Excluir um livro
async function excluirLivro(req, res) {
  try {
    const livro = await Livro.findByIdAndDelete(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    return res.status(200).json({ mensagem: "Livro excluído com sucesso" });
  } catch (erro) {
    return res.status(400).json({ erro: "ID inválido" });
  }
}

module.exports = {
  criarLivro,
  listarLivros,
  buscarLivroPorId,
  atualizarLivro,
  excluirLivro,
};
