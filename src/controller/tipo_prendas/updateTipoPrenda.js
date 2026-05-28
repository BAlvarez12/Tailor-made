const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const updateTipoPrenda = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre } = req.body
    const nombreLimpio = String(nombre || '').trim()

    if (!nombreLimpio) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' })
    }

    if (nombreLimpio.length > 50) {
      return res.status(400).json({ message: 'El nombre no puede exceder 50 caracteres.' })
    }

    const [existentes] = await db.query(
      'SELECT tipo_prendas_id FROM tipo_prendas WHERE LOWER(nombre) = LOWER(?) AND tipo_prendas_id <> ? LIMIT 1',
      [nombreLimpio, id]
    )

    if (existentes.length > 0) {
      return res.status(409).json({ message: 'Ya existe otro tipo de prenda con ese nombre.' })
    }

    const [result] = await db.query(
      'UPDATE tipo_prendas SET nombre = ? WHERE tipo_prendas_id = ?',
      [nombreLimpio, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de prenda no encontrado.' })
    }

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'tipo_prenda',
      entidadId: Number(id),
      descripcion: `Tipo de prenda "${nombreLimpio}" editado`,
      datosDespues: { nombre: nombreLimpio },
    })

    return res.json({ message: 'Tipo de prenda actualizado' })
  } catch (error) {
    console.error('Error en updateTipoPrenda:', error)
    return res.status(500).json({ message: 'Error al actualizar el tipo de prenda' })
  }
}

module.exports = updateTipoPrenda
