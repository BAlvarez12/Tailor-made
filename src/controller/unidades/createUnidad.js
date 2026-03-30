const db = require('../../config/db')

const createUnidad = async (req, res) => {
  try {
    const { nombre_unidad, simbolo_unidad } = req.body

    if (!nombre_unidad) {
      return res.status(400).json({ error: 'Nombre requerido' })
    }

    await db.query(
      'CALL sp_unidades_create(?, ?)',
      [nombre_unidad, simbolo_unidad]
    )

    res.json({ message: 'Unidad creada' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear' })
  }
}

module.exports = createUnidad