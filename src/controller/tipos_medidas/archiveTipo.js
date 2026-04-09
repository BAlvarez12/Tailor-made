const db = require('../../config/db')

const archiveTipo = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'CALL sp_tipo_medidas_archive(?)',
      [id]
    )

    res.json({ message: 'Archivado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al archivar' })
  }
}

module.exports = archiveTipo