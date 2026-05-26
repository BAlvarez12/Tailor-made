const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const restoreUnidad = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'CALL sp_unidades_restore(?)',
      [id]
    )

    registrar({
      ...fromReq(req),
      accion: 'restaurar',
      entidad: 'unidad_medida',
      entidadId: Number(id),
      descripcion: `Unidad de medida #${id} restaurada`,
    })

    res.json({ message: 'Restaurado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al restaurar' })
  }
}

module.exports = restoreUnidad
