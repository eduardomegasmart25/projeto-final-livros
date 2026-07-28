const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

async function criarUsuario(req, res) {
  try {
    const { senha, ...dados } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({ ...dados, senhaHash });
    return res.status(201).json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    });
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({ erro: "Já existe um usuário cadastrado com esse e-mail" });
    }
    return res.status(400).json({ erro: erro.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const { nome, email, page = 1, limit = 10 } = req.query;
    const filtro = {};
    if (nome) filtro.nome = { $regex: nome, $options: "i" };
    if (email) filtro.email = { $regex: email, $options: "i" };

    const pagina = Math.max(parseInt(page, 10) || 1, 1);
    const limite = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const totalItens = await Usuario.countDocuments(filtro);
    const usuarios = await Usuario.find(filtro)
      .select("-senhaHash")
      .sort({ nome: 1 })
      .skip((pagina - 1) * limite)
      .limit(limite);

    return res.status(200).json({
      items: usuarios,
      totalItens,
      totalPaginas: Math.ceil(totalItens / limite),
      pagina,
      limite,
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

async function buscarUsuarioPorId(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-senhaHash");
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return res.status(400).json({ erro: "ID inválido" });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const dadosAtualizados = { ...req.body };
    if (dadosAtualizados.senha) {
      dadosAtualizados.senhaHash = await bcrypt.hash(dadosAtualizados.senha, 10);
      delete dadosAtualizados.senha;
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, dadosAtualizados, {
      new: true,
      runValidators: true,
    }).select("-senhaHash");

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return res.status(400).json({ erro: erro.message });
  }
}

async function excluirUsuario(req, res) {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    return res.status(200).json({ mensagem: "Usuário excluído com sucesso" });
  } catch (erro) {
    return res.status(400).json({ erro: "ID inválido" });
  }
}

module.exports = {
  criarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
};
