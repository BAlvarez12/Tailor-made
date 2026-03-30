const db = require('../../config/db')

const getMateriales = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.material_id,
        m.categoria_id,
        m.nombre_material,
        m.descripcion_material,
        m.precio_unitario,
        m.referencia_compra,
        m.stock,
        c.nombre_categoria,
        img.url_img
      FROM materiales m
      LEFT JOIN categorias_material c ON m.categoria_id = c.categoria_id
      LEFT JOIN materiales_img img ON m.material_id = img.material_id
      WHERE m.estado = 1
      ORDER BY m.fecha_creado DESC
    `)

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener materiales' })
  }
}

module.exports = { getMateriales }