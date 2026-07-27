const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET || "segredo-dev",
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

module.exports = { login };
