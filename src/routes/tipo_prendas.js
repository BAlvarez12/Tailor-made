const express = require('express')
const router = express.Router()

const obtenerTiposPrendaActivos = require('../controller/tipo_prendas/obtenerTiposPrendaActivos')

router.get('/tipos/activos', obtenerTiposPrendaActivos)

module.exports = router