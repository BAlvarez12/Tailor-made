const express = require('express')
const router = express.Router()

const upload = require('../middleware/upload')
const guardarImagenPrenda = require('../utils/save_img')
const { obtenerPrendas }  = require('../controller/prendas/obtenerPrendas')
const crearPrendas  = require('../controller/prendas/crearPrendas')
const { updatePrendas } = require('../controller/prendas/updatePrendas')
const obtenerPrendaPorId  = require('../controller/prendas/obtenerPrendaPorId')


router.post('/imagen', upload.array('imagenes', 3), guardarImagenPrenda)
const obtenerMedidas = require('../controller/prendas/obtener_medida_xp')

router.get('/:id/medidas', obtenerMedidas)


router.get('/obtener', obtenerPrendas)
router.post('/crear', crearPrendas)
router.put('/editar/:id', updatePrendas)
router.get('/obtener/:id', obtenerPrendaPorId)



module.exports = router