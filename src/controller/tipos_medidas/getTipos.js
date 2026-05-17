const db = require('../../config/db')

const getTipos = async (req, res) => {
  try {
    const { archivados } = req.query

    let query = 'SELECT * FROM tipo_medidas'

    if (archivados === 'true') {
      query += ' WHERE estado = 0'
    } else {
      query += ' WHERE estado = 1'
    }

    const [rows] = await db.query(query)

    res.json(rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener tipos' })
  }
}

module.exports = getTipos