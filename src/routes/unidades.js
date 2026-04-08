const express = require('express')
const router = express.Router()

const getUnidades = require('../controller/unidades/getUnidades')
const createUnidad = require('../controller/unidades/createUnidad')
const updateUnidad = require('../controller/unidades/updateUnidad')
const archiveUnidad = require('../controller/unidades/archiveUnidad')
const restoreUnidad = require('../controller/unidades/restoreUnidad')

router.get('/', getUnidades)
router.post('/', createUnidad)
router.put('/:id', updateUnidad)
router.put('/archivar/:id', archiveUnidad)
router.put('/restaurar/:id', restoreUnidad)

module.exports = router