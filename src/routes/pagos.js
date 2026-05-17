const express = require("express");
const router = express.Router();

const { listarPlanesPago } = require("../controller/pagos/listarPlanesPago");
const { obtenerPlanPagoPorId } = require("../controller/pagos/obtenerPlanPagoPorId");
const { listarCotizacionesPorCliente } = require("../controller/pagos/listarCotizacionesPorCliente");
const { crearPlanPago } = require("../controller/pagos/crearPlanPago");
const { registrarPago } = require("../controller/pagos/registrarPago");
const { descargarPdfRecibo } = require("../controller/pagos/generarPdfRecibo");

router.get("/planes", listarPlanesPago);
router.get("/planes/:id", obtenerPlanPagoPorId);
router.get("/cotizaciones-cliente/:clienteId", listarCotizacionesPorCliente);
router.post("/planes", crearPlanPago);
router.post("/registrar", registrarPago);
router.get("/recibo/:pagoId/pdf", descargarPdfRecibo);

module.exports = router;
