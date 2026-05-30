const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const archiveTipo = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE tipo_medidas SET estado = 0 WHERE tipo_medida_id = ?',
      [id]
    )

    registrar({
      ...fromReq(req),
      accion: 'archivar',
      entidad: 'tipo_medida',
      entidadId: Number(id),
      descripcion: `Tipo de medida #${id} archivado`,
    })

    res.json({ message: 'Archivado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al archivar' })
  }
}

module.exports = archiveTipo
