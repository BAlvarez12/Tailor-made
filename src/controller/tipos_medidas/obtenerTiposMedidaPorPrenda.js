const db = require('../../config/db')

const obtenerTiposMedidaPorPrenda = async (req, res) => {
  try {
    const { prendaId } = req.params

    if (!prendaId) {
      return res.status(400).json({ message: 'El id de la prenda es obligatorio' })
    }

    const sql = `
      SELECT DISTINCT
        tm.tipo_medida_id,
        tm.nombre_tipo_medida,
        tm.descripcion_tipo_medida,
        tm.fecha_creado,
        tm.usuario_creador
      FROM medidas_prenda mp
      INNER JOIN tipo_medidas tm
        ON tm.tipo_medida_id = mp.tipo_medida_id
      INNER JOIN tipo_prendas tp
        ON tp.tipo_prendas_id = mp.prenda_id
      WHERE mp.prenda_id = ?
        AND tp.estado = 1
      ORDER BY tm.nombre_tipo_medida ASC
    `

    const [rows] = await db.query(sql, [prendaId])

    return res.status(200).json(rows)
  } catch (error) {
    console.error('Error en obtenerTiposMedidaPorPrenda:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerTiposMedidaPorPrenda