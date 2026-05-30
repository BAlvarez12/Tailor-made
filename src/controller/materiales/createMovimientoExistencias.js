const db = require('../../config/db')
const { registrar, fromReq } = require('../../services/logOperaciones')

const createMovimientoExistencias = async (req, res) => {
  try {
    const { material_id, cantidad } = req.body

    if (!material_id || cantidad === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' })
    }

    const usuario = req.user.usuario_id

    // Transacción con bloqueo de la fila del material (FOR UPDATE) para evitar
    // condiciones de carrera al ajustar el stock, igual que el SP original.
    const connection = await db.getConnection()
    try {
      await connection.beginTransaction()

      const [stockRows] = await connection.query(
        `SELECT stock FROM materiales WHERE material_id = ? FOR UPDATE`,
        [material_id]
      )

      if (stockRows.length === 0) {
        await connection.rollback()
        return res.status(400).json({ error: 'Material no existe' })
      }

      const stockActual = Number(stockRows[0].stock)
      const cantidadNum = Number(cantidad)
      const stockFinal = stockActual + cantidadNum
      const tipo = cantidadNum > 0 ? 'ENTRADA' : 'SALIDA'

      if (stockFinal < 0) {
        await connection.rollback()
        return res.status(400).json({ error: 'Stock insuficiente' })
      }

      await connection.query(
        `INSERT INTO detalle_existencias
           (material_id, cantidad, tipo, usuario_modif, exis_inicial, exis_final)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [material_id, cantidadNum, tipo, usuario, stockActual, stockFinal]
      )

      await connection.query(
        `UPDATE materiales SET stock = ? WHERE material_id = ?`,
        [stockFinal, material_id]
      )

      await connection.commit()
    } catch (txError) {
      await connection.rollback()
      throw txError
    } finally {
      connection.release()
    }

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