const express = require('express')
const router = express.Router()

const { requierePermiso } = require('../middleware/permiso')
const getUnidades = require('../controller/unidades/getUnidades')
const createUnidad = require('../controller/unidades/createUnidad')
const updateUnidad = require('../controller/unidades/updateUnidad')
const archiveUnidad = require('../controller/unidades/archiveUnidad.js')
const restoreUnidad = require('../controller/unidades/restoreUnidad')

router.get('/', getUnidades)
router.post('/', requierePermiso('crear_unidades_medidas'), createUnidad)
router.put('/:id', requierePermiso('editar_unidades_medidas'), updateUnidad)
router.put('/archivar/:id', requierePermiso('editar_unidades_medidas'), archiveUnidad)
router.put('/restaurar/:id', requierePermiso('editar_unidades_medidas'), restoreUnidad)

module.exports = router
