const express = require('express')
const router = express.Router()

const { requierePermiso } = require('../middleware/permiso')
const getTipos = require('../controller/tipos_medidas/getTipos')
const createTipo = require('../controller/tipos_medidas/createTipo')
const updateTipo = require('../controller/tipos_medidas/updateTipo')
const archiveTipo = require('../controller/tipos_medidas/archiveTipo.js')
const restoreTipo = require('../controller/tipos_medidas/restoreTipo')
const obtenerTiposMedidaPorPrenda = require('../controller/tipos_medidas/obtenerTiposMedidaPorPrenda')

router.get('/', getTipos)
router.post('/', requierePermiso('crear_tipo_medidas'), createTipo)
router.put('/:id', requierePermiso('editar_tipo_medidas'), updateTipo)
router.put('/archivar/:id', requierePermiso('editar_tipo_medidas'), archiveTipo)
router.put('/restaurar/:id', requierePermiso('editar_tipo_medidas'), restoreTipo)
router.get('/obtener/:prendaId/medidas', obtenerTiposMedidaPorPrenda)

module.exports = router
