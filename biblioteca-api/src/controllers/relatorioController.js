const Livro = require("../models/Livro");
const Usuario = require("../models/Usuario");
const Emprestimo = require("../models/Emprestimo");

async function obterEstatisticas(req, res) {
  try {
    const totalUsuarios = await Usuario.countDocuments();
    const totalLivros = await Livro.countDocuments();
    const totalEmprestimos = await Emprestimo.countDocuments();
    const emprestimosAtivos = await Emprestimo.countDocuments({ status: "emprestado" });
    const emprestimosAtrasados = await Emprestimo.countDocuments({ status: "atrasado" });
    const totalDevolvidos = await Emprestimo.countDocuments({ status: "devolvido" });

    const receita = await Emprestimo.aggregate([
      { $match: { preco: { $exists: true, $ne: null } } },
      { $group: { _id: null, total: { $sum: "$preco" } } },
    ]);

    const livrosMaisEmprestados = await Emprestimo.aggregate([
      { $group: { _id: "$livro", quantidade: { $sum: 1 } } },
      { $sort: { quantidade: -1 } },
      { $limit: 5 },
      { $lookup: { from: "livros", localField: "_id", foreignField: "_id", as: "livro" } },
      { $unwind: { path: "$livro", preserveNullAndEmptyArrays: true } },
      { $project: { quantidade: 1, titulo: "$livro.titulo", autor: "$livro.autor" } },
    ]);

    return res.status(200).json({
      totalUsuarios,
      totalLivros,
      totalEmprestimos,
      emprestimosAtivos,
      emprestimosAtrasados,
      totalDevolvidos,
      totalReceita: receita[0]?.total || 0,
      livrosMaisEmprestados,
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  obterEstatisticas,
};
