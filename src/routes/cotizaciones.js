const express = require("express");
const router = express.Router();

const { crearCotizacion } = require("../controller/cotizaciones/crearCotizacion");
const { listarCotizaciones } = require("../controller/cotizaciones/listarCotizaciones");
const { obtenerCotizacionPorId } = require("../controller/cotizaciones/obtenerCotizacionPorId");
const { descargarPdfCotizacion } = require("../controller/cotizaciones/generarPdfCotizacion");

router.get("/", listarCotizaciones);
router.post("/", crearCotizacion);
router.get("/:id/pdf", descargarPdfCotizacion);
router.get("/:id", obtenerCotizacionPorId);

module.exports = router;
