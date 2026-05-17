const db = require('../../config/db')

const updateUnidad = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_unidad, simbolo_unidad } = req.body

    await db.query(
      'CALL sp_unidades_update(?, ?, ?)',
      [id, nombre_unidad, simbolo_unidad]
    )

    res.json({ message: 'Actualizado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar' })
  }
}

module.exports = updateUnidad