const db = require('../../config/db')

const obtenerMaterialesActivos = async (req, res) => {
  try {
    const [rows] = await db.query(`CALL sp_obtener_materiales_activos()`)

    return res.status(200).json(rows[0])
  } catch (error) {
    console.error('Error en obtenerMaterialesActivos:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerMaterialesActivos