const express = require('express')
const router = express.Router()

const {
  getTipos,
  createTipo,
  updateTipo,
  archiveTipo,
  restoreTipo
} = require('../controller/tipos_medidas/tipos_medidas')

const obtenerTiposMedidaPorPrenda = require('../controller/tipos_medidas/obtenerTiposMedidaPorPrenda')

router.get('/', getTipos)

router.post('/', createTipo)

router.put('/:id', updateTipo)

router.put('/archivar/:id', archiveTipo)

router.put('/restaurar/:id', restoreTipo)

router.get('/obtener/:prendaId/medidas', obtenerTiposMedidaPorPrenda)

module.exports = router