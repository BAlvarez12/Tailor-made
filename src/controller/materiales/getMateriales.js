const db = require('../../config/db')

const getMateriales = async (req, res) => {
  try {
    const [rows] = await db.query(`CALL sp_get_materiales()`)

    const materiales = rows[0].map(m => ({
      ...m,
      imagenes: m.imagenes
        ? m.imagenes.split(',')
        : []
    }))

    res.json(materiales)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener materiales' })
  }
}

module.exports = { getMateriales }