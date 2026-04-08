const db = require('../../config/db')

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