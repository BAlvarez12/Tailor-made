const db = require('../../config/db')

const obtenerUnidadesMedida = async (req, res) => {
  try {
    const sql = `
      SELECT
        unidad_id,
        nombre_unidad,
        simbolo_unidad
      FROM unidades_medida
      ORDER BY nombre_unidad ASC
    `

    const [rows] = await db.query(sql)

    return res.status(200).json(rows)
  } catch (error) {
    console.error('Error en obtenerUnidadesMedida:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerUnidadesMedida