const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const createMovimientoExistencias = async (req, res) => {
  try {
    const { material_id, cantidad } = req.body

    if (!material_id || cantidad === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    const usuario = req.user.usuario_id

    await db.query(
      `CALL sp_create_movimiento_existencias(?, ?, ?)`,
      [
        material_id,
        cantidad,
        usuario
      ]
    )

    const cant = Number(cantidad)
    const verbo = cant >= 0 ? 'ingreso' : 'salida'
    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'existencia_material',
      entidadId: Number(material_id),
      descripcion: `Movimiento de existencias (${verbo} de ${Math.abs(cant)}) en material #${material_id}`,
      datosDespues: { material_id, cantidad: cant },
    })

    res.json({ message: 'Movimiento registrado correctamente' })

  } catch (error) {
    console.error(error)

    // 🔥 Captura errores del SP (SIGNAL desde MySQL)
    if (error.sqlMessage) {
      return res.status(400).json({ error: error.sqlMessage })
    }

    res.status(500).json({ error: 'Error al registrar movimiento' })
  }
}

module.exports = { createMovimientoExistencias }