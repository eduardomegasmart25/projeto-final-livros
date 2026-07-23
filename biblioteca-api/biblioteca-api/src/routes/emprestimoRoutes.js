const express = require("express");
const router = express.Router();
const {
  criarEmprestimo,
  devolverEmprestimo,
  listarEmprestimos,
  buscarEmprestimoPorId,
  listarEmprestimosAtrasados,
} = require("../controllers/emprestimoController");

// IMPORTANTE: a rota /atrasados precisa vir ANTES de /:id
router.get("/atrasados", listarEmprestimosAtrasados);

router.post("/", criarEmprestimo);
router.get("/", listarEmprestimos);
router.get("/:id", buscarEmprestimoPorId);
router.put("/:id/devolver", devolverEmprestimo);

module.exports = router;
