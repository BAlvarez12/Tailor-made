const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
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

// Carpeta SIEMPRE en minúscula y con ruta absoluta. El frontend (web y app)
// pide las imágenes en /uploads/materiales, así que el destino en disco debe
// coincidir exactamente. En Linux el sistema distingue mayúsculas, por lo que
// "Materiales" y "materiales" serían carpetas distintas y las imágenes darían 404.
const carpetaMateriales = path.join(__dirname, '../../uploads/materiales')

if (!fs.existsSync(carpetaMateriales)) {
  fs.mkdirSync(carpetaMateriales, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaMateriales)
  },
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
router.put('/:id', requierePermiso('editar_materiales'), subirImagenes, updateMaterial)
router.get('/activos', obtenerMaterialesActivos)
router.post('/movimientos-existencias', requierePermiso('existencias-materiales'), createMovimientoExistencias)

module.exports = router