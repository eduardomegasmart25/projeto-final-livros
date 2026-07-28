const express = require("express");
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
} = require("../controllers/usuarioController");
const validarSchema = require("../middlewares/validateMiddleware");
const { usuarioSchema } = require("../validators/usuarioValidator");
const autenticarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/roleMiddleware");

router.post("/", validarSchema(usuarioSchema), criarUsuario);
router.get("/", autenticarToken, autorizarRoles("bibliotecario"), listarUsuarios);
router.get("/:id", autenticarToken, autorizarRoles("bibliotecario"), buscarUsuarioPorId);
router.put("/:id", autenticarToken, autorizarRoles("bibliotecario"), validarSchema(usuarioSchema), atualizarUsuario);
router.delete("/:id", autenticarToken, autorizarRoles("bibliotecario"), excluirUsuario);

module.exports = router;
