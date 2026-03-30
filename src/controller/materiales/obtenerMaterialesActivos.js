const db = require('../../config/db')

const obtenerMaterialesActivos = async (req, res) => {
  try {
    const sql = `
      SELECT
        material_id,
        categoria_id,
        nombre_material,
        descripcion_material,
        precio_unitario,
        referencia_compra,
        estado,
        fecha_creado,
        usuario_creador,
        stock
      FROM materiales
      WHERE estado = 1
      ORDER BY nombre_material DESC
    `

    const [rows] = await db.query(sql)

    return res.status(200).json(rows)
  } catch (error) {
    console.error('Error en obtenerMaterialesActivos:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = obtenerMaterialesActivos