const multer = require('multer')
const path = require('path')
const fs = require('fs')

const carpetaDestino = path.join(__dirname, '../../uploads/prendas')

if (!fs.existsSync(carpetaDestino)) {
  fs.mkdirSync(carpetaDestino, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaDestino)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 6)
    const nombreBase = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 40)

    const nombreFinal = `${Date.now()}_${nombreBase}${ext}`
    cb(null, nombreFinal)
  }
})

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/
  const ext = tiposPermitidos.test(path.extname(file.originalname).toLowerCase())
  const mime = tiposPermitidos.test(file.mimetype)

  if (ext && mime) {
    return cb(null, true)
  }

  cb(new Error('Solo se permiten imágenes JPG, JPEG, PNG o WEBP'))
}

const uploadPrendas = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024
  }
})

// Envuelve upload.array() para devolver respuestas JSON limpias en vez de un 500
// genérico cuando hay errores de tipo de archivo, tamaño o cantidad.
uploadPrendas.arrayConErrores = (campo, maxCount) => (req, res, next) => {
  uploadPrendas.array(campo, maxCount)(req, res, (err) => {
    if (!err) return next()

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'Una de las imágenes supera el tamaño máximo permitido (5 MB).'
        })
      }
      if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          message: 'Solo se permiten subir hasta 3 imágenes.'
        })
      }
      return res.status(400).json({
        message: err.message || 'Error al subir el archivo.'
      })
    }

    return res.status(400).json({
      message: err.message || 'Tipo de archivo no permitido.'
    })
  })
}

module.exports = uploadPrendas