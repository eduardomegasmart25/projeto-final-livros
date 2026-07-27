const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token de acesso ausente" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "segredo-dev", (erro, usuario) => {
    if (erro) {
      return res.status(403).json({ erro: "Token inválido ou expirado" });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = autenticarToken;
