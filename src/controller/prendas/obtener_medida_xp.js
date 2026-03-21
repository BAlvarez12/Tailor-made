const db = require('../../config/db')

const obtenerMedidas = async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.query(`
      SELECT tm.tipo_medida_id, tm.nombre_tipo_medida
      FROM prenda_tipo_medida ptm
      JOIN tipo_medidas tm 
        ON ptm.tipo_medida_id = tm.tipo_medida_id
      WHERE ptm.prenda_id = ?
    `, [id])

    res.json(rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener medidas' })
  }
}

module.exports = obtenerMedidas