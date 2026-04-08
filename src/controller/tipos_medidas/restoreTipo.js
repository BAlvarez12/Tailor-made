const db = require('../../config/db')

const restoreTipo = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'CALL sp_tipo_medidas_restore(?)',
      [id]
    )

    res.json({ message: 'Restaurado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al restaurar' })
  }
}

module.exports = restoreTipo