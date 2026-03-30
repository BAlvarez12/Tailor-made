const db = require('../../config/db')

const createMovimientoExistencias = async (req, res) => {
  try {
    const { material_id, cantidad } = req.body

    if (!material_id || cantidad === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    const tipo = cantidad > 0 ? 'ENTRADA' : 'SALIDA'
    const usuario = req.user.usuario_id

    // 🔥 1. Obtener existencia actual
    const [rows] = await db.query(
      'SELECT stock FROM materiales WHERE material_id = ?',
      [material_id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Material no encontrado' })
    }

    const exisInicial = rows[0].stock
    const exisFinal = exisInicial + cantidad

    // 🔥 VALIDACIÓN: no permitir negativos
    if (exisFinal < 0) {
      return res.status(400).json({ error: 'Stock insuficiente' })
    }

    // 🔥 2. Guardar historial completo
    await db.query(`
      INSERT INTO detalle_existencias 
      (material_id, cantidad, tipo, usuario_modif, exis_inicial, exis_final)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [material_id, cantidad, tipo, usuario, exisInicial, exisFinal])

    // 🔥 3. Actualizar existencia real
    await db.query(`
      UPDATE materiales
      SET stock = ?
      WHERE material_id = ?
    `, [exisFinal, material_id])

    res.json({ message: 'Movimiento registrado correctamente' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al registrar movimiento' })
  }
}

module.exports = { createMovimientoExistencias }