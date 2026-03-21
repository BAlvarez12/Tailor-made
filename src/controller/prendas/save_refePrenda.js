const db = require('../../config/db')
const multer = require('multer')
const path = require('path')

// CONFIGURAR MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pedidos')
  },
  filename: (req, file, cb) => {
    const nombre = Date.now() + path.extname(file.originalname)
    cb(null, nombre)
  }
})

const upload = multer({ storage })

// CONTROLADOR
const guardarImagenPrenda = [
  upload.single('imagen'),

  async (req, res) => {
    try {
      const { prenda_id } = req.body

      if (!req.file) {
        return res.status(400).json({ error: 'No se subió imagen' })
      }

      const ruta = `uploads/${req.file.filename}`

      await db.query(
        'INSERT INTO prendas_img (prenda_id, url_img) VALUES (?, ?)',
        [prenda_id, ruta]
      )

      res.json({
        mensaje: 'Imagen guardada',
        ruta
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Error al guardar imagen' })
    }
  }
]

module.exports = guardarImagenPrenda