const guardarImagenPrenda = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No se recibieron imágenes'
      })
    }

    const imagenes = req.files.map((file) => ({
      nombre: file.filename,
      url: `/uploads/prendas/${file.filename}`
    }))

    return res.status(200).json({
      message: 'Imágenes subidas correctamente',
      imagenes
    })
  } catch (error) {
    console.error('Error en guardarImagenPrenda:', error)
    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

module.exports = guardarImagenPrenda