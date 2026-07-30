const express = require("express");
const router = express.Router();
const {
  criarLivro,
  listarLivros,
  buscarLivroPorId,
  atualizarLivro,
  excluirLivro,
  atualizarCapaLivro,
} = require("../controllers/livroController");
const autenticarToken = require("../middlewares/authMiddleware");
const { autorizarRoles } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", listarLivros);
router.get("/:id", buscarLivroPorId);
router.post("/", autenticarToken, autorizarRoles("bibliotecario"), criarLivro);
router.put("/:id/capa", autenticarToken, autorizarRoles("bibliotecario"), upload.single("capa"), atualizarCapaLivro);
router.put("/:id", autenticarToken, autorizarRoles("bibliotecario"), atualizarLivro);
router.delete("/:id", autenticarToken, autorizarRoles("bibliotecario"), excluirLivro);

module.exports = router;
