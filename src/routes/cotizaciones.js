const express = require("express");
const router = express.Router();

const { requierePermiso } = require("../middleware/permiso");
const { crearCotizacion } = require("../controller/cotizaciones/crearCotizacion");
const { listarCotizaciones } = require("../controller/cotizaciones/listarCotizaciones");
const { obtenerCotizacionPorId } = require("../controller/cotizaciones/obtenerCotizacionPorId");
const { descargarPdfCotizacion } = require("../controller/cotizaciones/generarPdfCotizacion");
const { editarCotizacion } = require("../controller/cotizaciones/editarCotizacion");
const { anularCotizacion } = require("../controller/cotizaciones/anularCotizacion");

router.get("/", listarCotizaciones);
router.post("/", requierePermiso("crear_cotizaciones"), crearCotizacion);
router.get("/:id/pdf", requierePermiso("generar_pdf_cotizacion"), descargarPdfCotizacion);
router.get("/:id", obtenerCotizacionPorId);
router.put("/:id", requierePermiso("editar_cotizaciones"), editarCotizacion);
router.put("/:id/anular", requierePermiso("anular_cotizaciones"), anularCotizacion);

module.exports = router;
