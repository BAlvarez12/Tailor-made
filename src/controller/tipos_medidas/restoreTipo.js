const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const restoreTipo = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'CALL sp_tipo_medidas_restore(?)',
      [id]
    )

    registrar({
      ...fromReq(req),
      accion: 'restaurar',
      entidad: 'tipo_medida',
      entidadId: Number(id),
      descripcion: `Tipo de medida #${id} restaurado`,
    })

    res.json({ message: 'Restaurado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al restaurar' })
  }
}

module.exports = restoreTipo
