const Movimentacao = require("../models/Movimentacao");

async function listarMovimentacoes(req, res) {
  try {
    const { page = 1, limit = 20, usuarioId, action, resourceType } = req.query;
    const filtro = {};
    if (usuarioId) filtro.usuario = usuarioId;
    if (action) filtro.action = action;
    if (resourceType) filtro.resourceType = resourceType;

    const pagina = Math.max(parseInt(page, 10) || 1, 1);
    const limite = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const totalItens = await Movimentacao.countDocuments(filtro);
    const items = await Movimentacao.find(filtro)
      .populate("usuario", "nome email")
      .sort({ createdAt: -1 })
      .skip((pagina - 1) * limite)
      .limit(limite);

    return res.status(200).json({ items, totalItens, totalPaginas: Math.ceil(totalItens / limite), pagina, limite });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

module.exports = {
  listarMovimentacoes,
};
