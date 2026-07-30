const express = require("express");
const router = express.Router();
const { listarMovimentacoes } = require("../controllers/historicoController");
const autenticarToken = require("../middlewares/authMiddleware");
const { autorizarRoles } = require("../middlewares/roleMiddleware");

router.get("/movimentacoes", autenticarToken, autorizarRoles("bibliotecario"), listarMovimentacoes);

module.exports = router;
