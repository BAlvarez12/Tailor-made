const db = require('../../config/db')

const obtenerTiposPrendaActivos = async (req, res) => {
  try {
    const sql = `
      SELECT
        tipo_prendas_id,
        nombre,
        estado
      FROM tipo_prendas
      WHERE estado = 1
      ORDER BY nombre ASC
    `

    const [rows] = await db.query(sql)

    return res.status(200).json(rows)
  } catch (error) {
    console.error('Error en obtenerTiposPrendaActivos:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerTiposPrendaActivos