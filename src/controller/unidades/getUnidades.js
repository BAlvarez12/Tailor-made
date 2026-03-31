const db = require('../../config/db')

const getUnidades = async (req, res) => {
  try {
    const { archivados } = req.query

    const [rows] = await db.query(
      'CALL sp_unidades_get(?)',
      [archivados === 'true']
    )

    res.json(rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno' })
  }
}

module.exports = getUnidades