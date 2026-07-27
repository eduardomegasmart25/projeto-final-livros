function autorizarRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ erro: "Acesso negado para este perfil" });
    }

    next();
  };
}

module.exports = autorizarRoles;
