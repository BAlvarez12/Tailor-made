const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const archiveUnidad = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'CALL sp_unidades_archive(?)',
      [id]
    )

    registrar({
      ...fromReq(req),
      accion: 'archivar',
      entidad: 'unidad_medida',
      entidadId: Number(id),
      descripcion: `Unidad de medida #${id} archivada`,
    })

    res.json({ message: 'Archivado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al archivar' })
  }
}

module.exports = archiveUnidad
