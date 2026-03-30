const db = require('../../config/db')

const createTipo = async (req, res) => {
  try {
    const { nombre_tipo_medida, descripcion_tipo_medida, usuario_creador } = req.body

    if (!nombre_tipo_medida) {
      return res.status(400).json({ error: 'Nombre requerido' })
    }

    if (!usuario_creador) {
      return res.status(400).json({ error: 'Usuario requerido' })
    }

    await db.query(
      'CALL sp_tipo_medidas_create(?, ?, ?)',
      [nombre_tipo_medida, descripcion_tipo_medida, usuario_creador]
    )

    res.json({ message: 'Tipo creado' })

  } catch (error) {
    console.error(error)

    if (error.sqlMessage) {
      return res.status(400).json({ error: error.sqlMessage })
    }

    res.status(500).json({ error: 'Error al crear tipo' })
  }
}

module.exports = createTipo