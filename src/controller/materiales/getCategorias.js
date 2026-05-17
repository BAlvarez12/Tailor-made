const db = require('../../config/db')

const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query(`CALL sp_get_categorias()`)

    return res.json(rows[0]) // 👈 SOLO ESTA
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener categorías' })
  }
}

module.exports = { getCategorias }