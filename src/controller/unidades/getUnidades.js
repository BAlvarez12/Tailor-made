const db = require('../../config/db')

const getUnidades = async (req, res) => {
  try {
    const { archivados } = req.query
    const estado = archivados === 'true' ? 0 : 1

    const [rows] = await db.query(
      `SELECT unidad_id, nombre_unidad, simbolo_unidad, estado
         FROM unidades_medida
        WHERE estado = ?
        ORDER BY nombre_unidad ASC`,
      [estado]
    )

    res.json(rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno' })
  }
}

module.exports = getUnidades