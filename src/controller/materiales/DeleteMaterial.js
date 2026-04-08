const db = require('../../config/db')

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params

    //  SOFT DELETE (desactivar)
    await db.query(`CALL sp_delete_material(?)`, [id])

    res.json({ message: 'Material desactivado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar material' })
  }
}

module.exports = { deleteMaterial }