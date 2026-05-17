const express = require('express')
const router = express.Router()

// 🔥 IMPORTS CORRECTOS (ARCHIVOS SEPARADOS)
const getTipos = require('../controller/tipos_medidas/getTipos')
const createTipo = require('../controller/tipos_medidas/createTipo')
const updateTipo = require('../controller/tipos_medidas/updateTipo')
const archiveTipo = require('../controller/tipos_medidas/archiveTipo.js')
const restoreTipo = require('../controller/tipos_medidas/restoreTipo')
const obtenerTiposMedidaPorPrenda = require('../controller/tipos_medidas/obtenerTiposMedidaPorPrenda')

// RUTAS


router.get('/', getTipos)

router.post('/', createTipo)

router.put('/:id', updateTipo)

router.put('/archivar/:id', archiveTipo)

router.put('/restaurar/:id', restoreTipo)

router.get('/obtener/:prendaId/medidas', obtenerTiposMedidaPorPrenda)

module.exports = router