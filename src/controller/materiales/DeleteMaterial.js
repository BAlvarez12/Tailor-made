const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params

    //  SOFT DELETE (desactivar)
    await db.query(`UPDATE materiales SET estado = 0 WHERE material_id = ?`, [id])

    registrar({
      ...fromReq(req),
      accion: 'eliminar',
      entidad: 'material',
      entidadId: Number(id),
      descripcion: `Material #${id} desactivado`,
    })

    res.json({ message: 'Material desactivado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar material' })
  }
}

module.exports = { deleteMaterial }
