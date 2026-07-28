const Emprestimo = require("../models/Emprestimo");
const Livro = require("../models/Livro");
const Usuario = require("../models/Usuario");

const DIAS_PADRAO_DEVOLUCAO = 7;

// Criar um empréstimo (retirar um livro)
async function criarEmprestimo(req, res) {
  try {
    const { livroId, usuarioId, diasParaDevolucao } = req.body;

    if (!livroId || !usuarioId) {
      return res.status(400).json({ erro: "livroId e usuarioId são obrigatórios" });
    }

    const livro = await Livro.findById(livroId);
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (livro.quantidadeDisponivel <= 0) {
      return res.status(400).json({ erro: "Não há exemplares disponíveis para empréstimo" });
    }

    const dias = diasParaDevolucao || DIAS_PADRAO_DEVOLUCAO;
    const dataDevolucaoPrevista = new Date();
    dataDevolucaoPrevista.setDate(dataDevolucaoPrevista.getDate() + dias);

    const emprestimo = await Emprestimo.create({
      livro: livro._id,
      usuario: usuario._id,
      dataDevolucaoPrevista,
    });

    livro.quantidadeDisponivel -= 1;
    await livro.save();

    const emprestimoPopulado = await emprestimo.populate(["livro", "usuario"]);

    return res.status(201).json(emprestimoPopulado);
  } catch (erro) {
    return res.status(400).json({ erro: erro.message });
  }
}

// Registrar a devolução de um livro
async function devolverEmprestimo(req, res) {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id);
    if (!emprestimo) {
      return res.status(404).json({ erro: "Empréstimo não encontrado" });
    }

    if (emprestimo.status === "devolvido") {
      return res.status(400).json({ erro: "Este empréstimo já foi devolvido" });
    }

    emprestimo.dataDevolucaoReal = new Date();
    emprestimo.status = "devolvido";
    await emprestimo.save();

    const livro = await Livro.findById(emprestimo.livro);
    if (livro) {
      livro.quantidadeDisponivel += 1;
      await livro.save();
    }

    const emprestimoPopulado = await emprestimo.populate(["livro", "usuario"]);
    return res.status(200).json(emprestimoPopulado);
  } catch (erro) {
    return res.status(400).json({ erro: "ID inválido" });
  }
}

// Listar todos os empréstimos (com filtro opcional por status)
async function listarEmprestimos(req, res) {
  try {
    const { status, usuarioId, livroId } = req.query;
    const filtro = {};
    if (status) filtro.status = status;
    if (usuarioId) filtro.usuario = usuarioId;
    if (livroId) filtro.livro = livroId;

    const emprestimos = await Emprestimo.find(filtro)
      .populate("livro")
      .populate("usuario")
      .sort({ createdAt: -1 });

    return res.status(200).json(emprestimos);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

// Buscar um empréstimo por ID
async function buscarEmprestimoPorId(req, res) {
  try {
    const emprestimo = await Emprestimo.findById(req.params.id)
      .populate("livro")
      .populate("usuario");

    if (!emprestimo) {
      return res.status(404).json({ erro: "Empréstimo não encontrado" });
    }
    return res.status(200).json(emprestimo);
  } catch (erro) {
    return res.status(400).json({ erro: "ID inválido" });
  }
}

// Listar empréstimos atrasados (data prevista já passou e ainda não foi devolvido)
async function listarEmprestimosAtrasados(req, res) {
  try {
    const hoje = new Date();

    // Atualiza o status de quem está atrasado
    await Emprestimo.updateMany(
      { status: "emprestado", dataDevolucaoPrevista: { $lt: hoje } },
      { $set: { status: "atrasado" } }
    );

    const atrasados = await Emprestimo.find({ status: "atrasado" })
      .populate("livro")
      .populate("usuario")
      .sort({ dataDevolucaoPrevista: 1 });

    return res.status(200).json(atrasados);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  criarEmprestimo,
  devolverEmprestimo,
  listarEmprestimos,
  buscarEmprestimoPorId,
  listarEmprestimosAtrasados,
};
