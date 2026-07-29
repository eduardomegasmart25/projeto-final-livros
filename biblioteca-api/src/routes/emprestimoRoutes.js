const express = require("express");
const router = express.Router();
const {
  criarEmprestimo,
  devolverEmprestimo,
  listarEmprestimos,
  buscarEmprestimoPorId,
  listarEmprestimosAtrasados,
} = require("../controllers/emprestimoController");
const autenticarToken = require("../middlewares/authMiddleware");
const { autorizarRoles } = require("../middlewares/roleMiddleware");

// IMPORTANTE: a rota /atrasados precisa vir ANTES de /:id
router.get("/atrasados", autenticarToken, autorizarRoles("bibliotecario"), listarEmprestimosAtrasados);

router.post("/", autenticarToken, autorizarRoles("usuario", "bibliotecario"), criarEmprestimo);
router.get("/", autenticarToken, autorizarRoles("usuario", "bibliotecario"), listarEmprestimos);
router.get("/:id", autenticarToken, autorizarRoles("usuario", "bibliotecario"), buscarEmprestimoPorId);
router.put("/:id/devolver", autenticarToken, autorizarRoles("usuario", "bibliotecario"), devolverEmprestimo);

module.exports = router;
