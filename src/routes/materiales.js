const express = require('express')
const multer = require('multer')
const { createMaterial } = require('../controller/materiales/CreateMaterial')
const { getCategorias } = require('../controller/materiales/getCategorias')
const { getMateriales } = require('../controller/materiales/getMateriales')
const { deleteMaterial } = require('../controller/materiales/DeleteMaterial')
const { updateMaterial } = require('../controller/materiales/UpdateMaterial')
const obtenerMaterialesActivos = require('../controller/materiales/obtenerMaterialesActivos')
const { createMovimientoExistencias } = require('../controller/materiales/createMovimientoExistencias')
const auth = require('../middleware/auth')

const router = express.Router()

// CONFIGURACIÓN DE MULTER
const storage = multer.diskStorage({
  destination: 'uploads/materiales/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

router.post('/', auth,upload.array('imagenes'), createMaterial)
router.get('/categorias', getCategorias)
router.get('/', getMateriales)
router.delete('/:id', deleteMaterial)
router.put('/:id', updateMaterial)
router.get('/activos', obtenerMaterialesActivos)
router.post('/movimientos-existencias', auth, createMovimientoExistencias)

module.exports = router