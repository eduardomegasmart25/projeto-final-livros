const Usuario = require("../models/Usuario");

async function criarUsuario(req, res) {
  try {
    const usuario = await Usuario.create(req.body);
    return res.status(201).json(usuario);
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({ erro: "Já existe um usuário cadastrado com esse e-mail" });
    }
    return res.status(400).json({ erro: erro.message });
  }
}

async function listarUsuarios(req, res) {
  try {
    const { nome, email } = req.query;
    const filtro = {};
    if (nome) filtro.nome = { $regex: nome, $options: "i" };
    if (email) filtro.email = { $regex: email, $options: "i" };

    const usuarios = await Usuario.find(filtro).sort({ nome: 1 });
    return res.status(200).json(usuarios);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

async function buscarUsuarioPorId(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);
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
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
