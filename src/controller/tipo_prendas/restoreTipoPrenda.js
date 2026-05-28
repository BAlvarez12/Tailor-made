const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const restoreTipoPrenda = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.query(
      'UPDATE tipo_prendas SET estado = 1 WHERE tipo_prendas_id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de prenda no encontrado.' })
    }

    registrar({
      ...fromReq(req),
      accion: 'restaurar',
      entidad: 'tipo_prenda',
      entidadId: Number(id),
      descripcion: `Tipo de prenda #${id} restaurado`,
    })

    return res.json({ message: 'Tipo de prenda restaurado' })
  } catch (error) {
    console.error('Error en restoreTipoPrenda:', error)
    return res.status(500).json({ message: 'Error al restaurar el tipo de prenda' })
  }
}

module.exports = restoreTipoPrenda
