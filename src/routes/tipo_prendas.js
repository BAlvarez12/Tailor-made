const express = require('express')
const router = express.Router()

const { requierePermiso } = require('../middleware/permiso')
const obtenerTiposPrendaActivos = require('../controller/tipo_prendas/obtenerTiposPrendaActivos')
const getTipoPrendas = require('../controller/tipo_prendas/getTipoPrendas')
const createTipoPrenda = require('../controller/tipo_prendas/createTipoPrenda')
const updateTipoPrenda = require('../controller/tipo_prendas/updateTipoPrenda')
const archiveTipoPrenda = require('../controller/tipo_prendas/archiveTipoPrenda')
const restoreTipoPrenda = require('../controller/tipo_prendas/restoreTipoPrenda')

// Endpoint legacy usado al crear prendas (devuelve solo activos)
router.get('/tipos/activos', obtenerTiposPrendaActivos)

// CRUD para el mantenimiento de tipos de prenda
router.get('/', getTipoPrendas)
router.post('/', requierePermiso('crear_tipo_prendas'), createTipoPrenda)
router.put('/:id', requierePermiso('editar_tipo_prendas'), updateTipoPrenda)
router.put('/archivar/:id', requierePermiso('editar_tipo_prendas'), archiveTipoPrenda)
router.put('/restaurar/:id', requierePermiso('editar_tipo_prendas'), restoreTipoPrenda)

module.exports = router
