const db = require('../../config/db')

const updatePedido = async (req, res) => {
  try {
    const { id } = req.params
    const { cliente_id, prenda_id, notas, medidas } = req.body

    // Actualizar pedido
    await db.query(
      `UPDATE pedidos 
       SET cliente_id = ?, prenda_id = ?, notas = ?
       WHERE pedido_id = ?`,
      [cliente_id, prenda_id, notas, id]
    )

    // Eliminar medidas anteriores
    await db.query(
      `DELETE FROM cliente_prenda_medidas 
       WHERE cliente_prenda_id = ?`,
      [id]
    )

    // Insertar nuevas medidas
    for (const m of medidas) {
      await db.query(
        `INSERT INTO cliente_prenda_medidas 
        (cliente_prenda_id, tipo_medida_id, unidad_id, valor, usuario_creado)
        VALUES (?, ?, ?, ?, ?)`,
        [id, m.tipo_medida_id, 1, m.valor, 1]
      )
    }

    res.json({
      mensaje: 'Pedido actualizado correctamente'
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error al actualizar pedido'
    })
  }
}

module.exports = updatePedido