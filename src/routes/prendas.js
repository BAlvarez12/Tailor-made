const express = require('express')
const router = express.Router()

const upload = require('../middleware/upload')
const guardarImagenPrenda = require('../utils/save_img')
const { obtenerPrendas }  = require('../controller/prendas/obtenerPrendas')
const { obtenerMedidasPorCliente }  = require('../controller/prendas/obtenerMedidaPorCliente')
const crearPrendas  = require('../controller/prendas/crearPrendas')
const { updatePrendas } = require('../controller/prendas/updatePrendas')
const obtenerPrendaPorId  = require('../controller/prendas/obtenerPrendaPorId')


router.post('/imagen', upload.array('imagenes', 3), guardarImagenPrenda)
router.get('/:cliente_id/obtener', obtenerMedidasPorCliente)
router.get('/obtener', obtenerPrendas)
router.post('/crear', crearPrendas)
router.put('/editar/:id', updatePrendas)
router.get('/obtener/:id', obtenerPrendaPorId)



module.exports = router