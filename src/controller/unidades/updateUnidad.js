const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const updateUnidad = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_unidad, simbolo_unidad } = req.body

    const nombre = String(nombre_unidad || '').trim()
    const simbolo = String(simbolo_unidad || '').trim()

    if (!nombre || !simbolo) {
      return res.status(400).json({ error: 'Nombre y símbolo son obligatorios.' })
    }

    if (nombre.length > 20) {
      return res.status(400).json({ error: 'El nombre no puede exceder 20 caracteres.' })
    }

    if (simbolo.length > 10) {
      return res.status(400).json({ error: 'El símbolo no puede exceder 10 caracteres.' })
    }

    const [existe] = await db.query(
      'SELECT COUNT(*) AS total FROM unidades_medida WHERE nombre_unidad = ? AND unidad_id <> ?',
      [nombre, id]
    )

    if (existe[0].total > 0) {
      return res.status(409).json({ error: 'La unidad ya existe' })
    }

    await db.query(
      'UPDATE unidades_medida SET nombre_unidad = ?, simbolo_unidad = ? WHERE unidad_id = ?',
      [nombre, simbolo, id]
    )

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'unidad_medida',
      entidadId: Number(id),
      descripcion: `Unidad de medida "${nombre}" editada`,
      datosDespues: { nombre_unidad: nombre, simbolo_unidad: simbolo },
    })

    res.json({ message: 'Actualizado' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar' })
  }
}

module.exports = updateUnidad
