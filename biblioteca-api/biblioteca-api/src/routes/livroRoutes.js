const express = require("express");
const router = express.Router();
const {
  criarLivro,
  listarLivros,
  buscarLivroPorId,
  atualizarLivro,
  excluirLivro,
} = require("../controllers/livroController");

router.post("/", criarLivro);
router.get("/", listarLivros);
router.get("/:id", buscarLivroPorId);
router.put("/:id", atualizarLivro);
router.delete("/:id", excluirLivro);

module.exports = router;
