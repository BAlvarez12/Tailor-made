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

    await db.query(`
      UPDATE materiales SET
        nombre_material = ?,
        descripcion_material = ?,
        categoria_id = ?,
        precio_unitario = ?,
        referencia_compra = ?,
        stock = ?
      WHERE material_id = ?
    `, [
      nombre_material,
      descripcion_material,
      categoria_id,
      precio_unitario,
      referencia_compra,
      stock,
      id
    ])

    res.json({ message: 'Material actualizado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar material' })
  }
}

module.exports = { updateMaterial }