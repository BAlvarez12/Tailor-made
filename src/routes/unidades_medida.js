const express = require('express')
const router = express.Router()

const obtenerUnidadesMedida = require('../controller/unidades/obtenerUnidadesMedida')

router.get('/activas', obtenerUnidadesMedida)

module.exports = router