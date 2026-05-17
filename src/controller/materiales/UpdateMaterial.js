const db = require('../../config/db')

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params

    const {
      nombre_material,
      descripcion_material,
      categoria_id,
      precio_unitario,
      referencia_compra,
      stock
    } = req.body

    await db.query(
      `CALL sp_update_material(?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        nombre_material,
        descripcion_material,
        categoria_id,
        precio_unitario,
        referencia_compra,
        stock
      ]
    )

    res.json({ message: 'Material actualizado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar material' })
  }
}

module.exports = { updateMaterial }