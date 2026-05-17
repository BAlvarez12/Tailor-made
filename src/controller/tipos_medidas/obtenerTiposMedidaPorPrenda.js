const db = require('../../config/db')

const obtenerTiposMedidaPorPrenda = async (req, res) => {
  try {
    const { prendaId } = req.params

    if (!prendaId) {
      return res.status(400).json({ message: 'El id de la prenda es obligatorio' })
    }

    const [rows] = await db.query(
      'CALL sp_tipo_medidas_por_prenda(?)',
      [prendaId]
    )

    res.json(rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerTiposMedidaPorPrenda