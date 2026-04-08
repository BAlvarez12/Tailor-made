const db = require('../../config/db')

const updateTipo = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_tipo_medida, descripcion_tipo_medida } = req.body

    await db.query(
      'CALL sp_tipo_medidas_update(?, ?, ?)',
      [id, nombre_tipo_medida, descripcion_tipo_medida]
    )

    res.json({ message: 'Actualizado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar' })
  }
}

module.exports = updateTipo