const express = require("express");
const router = express.Router();

const { obtenerTiposMedidaActivos } = require("../controller/tipos_medidas/obtenerTiposMedidaActivos");

router.get("/", obtenerTiposMedidaActivos);

module.exports = router;