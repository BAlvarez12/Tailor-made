const db = require('../../config/db')

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params

    // 🔥 borrar imágenes primero (opcional pero recomendado)
    await db.query('DELETE FROM materiales_img WHERE material_id = ?', [id])

    // 🔥 borrar material
    await db.query('DELETE FROM materiales WHERE material_id = ?', [id])

    res.json({ message: 'Material eliminado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar material' })
  }
}

module.exports = { deleteMaterial }