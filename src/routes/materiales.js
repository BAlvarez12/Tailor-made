const express = require('express')
const multer = require('multer')
const { createMaterial } = require('../controller/materiales/CreateMaterial')
const { getCategorias } = require('../controller/materiales/getCategorias')
const { createCategoriaMaterial } = require('../controller/materiales/createCategoriaMaterial')
const { updateCategoriaMaterial } = require('../controller/materiales/updateCategoriaMaterial')
const { getMateriales } = require('../controller/materiales/getMateriales')
const { deleteMaterial } = require('../controller/materiales/DeleteMaterial')
const { updateMaterial } = require('../controller/materiales/UpdateMaterial')
const obtenerMaterialesActivos = require('../controller/materiales/obtenerMaterialesActivos')
const { createMovimientoExistencias } = require('../controller/materiales/createMovimientoExistencias')
const { requierePermiso } = require('../middleware/permiso')

const router = express.Router()

// CONFIGURACIÓN DE MULTER (solo imágenes, máx 5MB, hasta 3 archivos)
const TIPOS_PERMITIDOS = /jpeg|jpg|png|webp/

const storage = multer.diskStorage({
  destination: 'uploads/materiales/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  const extOk = TIPOS_PERMITIDOS.test(file.originalname.toLowerCase().split('.').pop())
  const mimeOk = TIPOS_PERMITIDOS.test(file.mimetype)

  if (extOk && mimeOk) {
    return cb(null, true)
  }
  cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Wrapper que traduce errores de multer a respuestas 400 claras
const subirImagenes = (req, res, next) => {
  upload.array('imagenes')(req, res, (err) => {
    if (!err) return next()

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Cada imagen debe pesar máximo 5MB.' })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Máximo 3 imágenes por material.' })
    }
    return res.status(400).json({ message: err.message || 'Error al cargar imágenes.' })
  })
}

router.post('/', requierePermiso('crear_materiales'), subirImagenes, createMaterial)
router.get('/categorias', getCategorias)
router.post('/categorias', requierePermiso('crear_categoria_materiales'), createCategoriaMaterial)
router.put('/categorias/:id', requierePermiso('editar_categoria_materiales'), updateCategoriaMaterial)
router.get('/', getMateriales)
router.delete('/:id', requierePermiso('editar_materiales'), deleteMaterial)
router.put('/:id', requierePermiso('editar_materiales'), updateMaterial)
router.get('/activos', obtenerMaterialesActivos)
router.post('/movimientos-existencias', requierePermiso('existencias-materiales'), createMovimientoExistencias)

module.exports = router