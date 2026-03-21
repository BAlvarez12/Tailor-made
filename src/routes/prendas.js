const express = require('express')
const router = express.Router()

const guardarImagenPrenda = require('../controller/prendas/save_refePrenda')

router.post('/imagen', guardarImagenPrenda)
const obtenerMedidas = require('../controller/prendas/obtener_medida_xp')

router.get('/:id/medidas', obtenerMedidas)

module.exports = router