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

function autorizarUsuarioOuRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    const usuarioId = req.usuario.id || req.usuario._id;
    if (req.params.id && usuarioId === req.params.id) {
      return next();
    }

    if (rolesPermitidos.includes(req.usuario.role)) {
      return next();
    }

    return res.status(403).json({ erro: "Acesso negado para este perfil" });
  };
}

module.exports = {
  autorizarRoles,
  autorizarUsuarioOuRole,
};
