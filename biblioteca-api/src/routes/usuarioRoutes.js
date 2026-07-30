const express = require("express");
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  atualizarAvatarUsuario,
} = require("../controllers/usuarioController");
const validarSchema = require("../middlewares/validateMiddleware");
const { usuarioSchema, usuarioUpdateSchema } = require("../validators/usuarioValidator");
const autenticarToken = require("../middlewares/authMiddleware");
const { autorizarRoles, autorizarUsuarioOuRole } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", validarSchema(usuarioSchema), criarUsuario);
router.get("/", autenticarToken, autorizarRoles("bibliotecario"), listarUsuarios);
router.get("/:id", autenticarToken, autorizarUsuarioOuRole("bibliotecario"), buscarUsuarioPorId);
router.put("/:id/avatar", autenticarToken, autorizarUsuarioOuRole("bibliotecario"), upload.single("avatar"), atualizarAvatarUsuario);
router.put("/:id", autenticarToken, autorizarRoles("bibliotecario"), validarSchema(usuarioUpdateSchema), atualizarUsuario);
router.delete("/:id", autenticarToken, autorizarRoles("bibliotecario"), excluirUsuario);

module.exports = router;
