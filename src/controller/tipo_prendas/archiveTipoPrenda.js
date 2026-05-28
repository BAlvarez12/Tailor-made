const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const archiveTipoPrenda = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.query(
      'UPDATE tipo_prendas SET estado = 0 WHERE tipo_prendas_id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de prenda no encontrado.' })
    }

    registrar({
      ...fromReq(req),
      accion: 'archivar',
      entidad: 'tipo_prenda',
      entidadId: Number(id),
      descripcion: `Tipo de prenda #${id} archivado`,
    })

    return res.json({ message: 'Tipo de prenda archivado' })
  } catch (error) {
    console.error('Error en archiveTipoPrenda:', error)
    return res.status(500).json({ message: 'Error al archivar el tipo de prenda' })
  }
}

module.exports = archiveTipoPrenda
