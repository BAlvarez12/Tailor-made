const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params

    const {
      nombre_material,
      descripcion_material,
      categoria_id,
      precio_unitario,
      referencia_compra,
      stock
    } = req.body

    const nombreLimpio = (nombre_material || '').trim()

    if (!nombreLimpio || !categoria_id) {
      return res.status(400).json({
        message: 'Nombre y categoría son obligatorios.'
      })
    }

    await db.query(
      `CALL sp_update_material(?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        nombre_material,
        descripcion_material,
        categoria_id,
        precio_unitario,
        referencia_compra,
        stock
      ]
    )

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'material',
      entidadId: Number(id),
      descripcion: `Material "${nombreLimpio}" editado`,
      datosDespues: {
        nombre_material: nombreLimpio,
        categoria_id,
        precio_unitario,
      },
    })

    res.json({ message: 'Material actualizado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar material' })
  }
}

module.exports = { updateMaterial }
