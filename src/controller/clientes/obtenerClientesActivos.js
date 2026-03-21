const db = require('../../config/db')

const obtenerClientesActivos = async (req, res) => {
  try {
    const sql = `
      SELECT
        cliente_id,
        nombre_cliente,
        apellido_cliente,
        telefono,
        estado,
        fecha_creado,
        usuario_creador
      FROM clientes
      WHERE estado = 1
      ORDER BY nombre_cliente ASC, apellido_cliente ASC
    `

    const [rows] = await db.query(sql)

    return res.status(200).json(rows)
  } catch (error) {
    console.error('Error en obtenerClientesActivos:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerClientesActivos