const db = require('../../config/db')

const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT categoria_id, nombre_categoria 
      FROM categorias_material
    `)

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
}

module.exports = { getCategorias }