const Movimentacao = require("../models/Movimentacao");

async function registrarMovimentacao({ usuarioId, action, resourceType, resourceId, descricao, detalhes }) {
  return Movimentacao.create({
    usuario: usuarioId,
    action,
    resourceType,
    resourceId,
    descricao,
    detalhes,
  });
}

module.exports = {
  registrarMovimentacao,
};
