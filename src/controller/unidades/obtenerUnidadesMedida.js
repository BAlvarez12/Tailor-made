const db = require('../../config/db')

const obtenerUnidadesMedida = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT unidad_id, nombre_unidad, simbolo_unidad FROM unidades_medida WHERE estado = 1 ORDER BY nombre_unidad ASC'
    )

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener unidades de medida' })
  }
}

module.exports = obtenerUnidadesMedida
