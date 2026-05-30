const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const updateTipo = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_tipo_medida, descripcion_tipo_medida } = req.body

    const nombre = String(nombre_tipo_medida || '').trim()
    const descripcion = descripcion_tipo_medida
      ? String(descripcion_tipo_medida).trim()
      : null

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del tipo de medida es obligatorio.' })
    }

    if (nombre.length > 50) {
      return res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres.' })
    }

    if (descripcion && descripcion.length > 255) {
      return res.status(400).json({ error: 'La descripción no puede exceder 255 caracteres.' })
    }

    await db.query(
      `UPDATE tipo_medidas
          SET nombre_tipo_medida = ?, descripcion_tipo_medida = ?
        WHERE tipo_medida_id = ?`,
      [nombre, descripcion, id]
    )

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'tipo_medida',
      entidadId: Number(id),
      descripcion: `Tipo de medida "${nombre}" editado`,
      datosDespues: { nombre_tipo_medida: nombre, descripcion_tipo_medida: descripcion },
    })

    res.json({ message: 'Actualizado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar' })
  }
}

module.exports = updateTipo
