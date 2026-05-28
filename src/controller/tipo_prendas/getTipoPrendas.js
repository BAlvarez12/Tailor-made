const db = require('../../config/db')

const getTipoPrendas = async (req, res) => {
  try {
    const { archivados } = req.query
    const estado = archivados === 'true' ? 0 : 1

    const [rows] = await db.query(
      `
        SELECT
          tipo_prendas_id,
          nombre,
          estado
        FROM tipo_prendas
        WHERE estado = ?
        ORDER BY nombre ASC
      `,
      [estado]
    )

    return res.status(200).json(rows)
  } catch (error) {
    console.error('Error en getTipoPrendas:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = getTipoPrendas
