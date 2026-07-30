const express = require("express");
const router = express.Router();
const { obterEstatisticas } = require("../controllers/relatorioController");
const autenticarToken = require("../middlewares/authMiddleware");
const { autorizarRoles } = require("../middlewares/roleMiddleware");

router.get("/estatisticas", autenticarToken, autorizarRoles("bibliotecario"), obterEstatisticas);

module.exports = router;
