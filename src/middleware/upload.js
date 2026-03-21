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
    const ext = path.extname(file.originalname)
    const nombreBase = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '')

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

module.exports = uploadPrendas