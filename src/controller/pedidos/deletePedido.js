const db = require('../../config/db')

const deletePedido = async (req, res) => {
  try {
    const { id } = req.params

    //  primero eliminamos medidas relacionadas
    await db.query(
      `DELETE FROM cliente_prenda_medidas WHERE cliente_prenda_id = ?`,
      [id]
    )

    //  luego eliminamos el pedido
    await db.query(
      `DELETE FROM pedidos WHERE pedido_id = ?`,
      [id]
    )

    res.json({ mensaje: 'Pedido eliminado correctamente' })

  } catch (error) {
    console.error('Error eliminando pedido:', error)
    res.status(500).json({ error: 'Error al eliminar pedido' })
  }
  console.log('DELETE FUNCIONANDO')
}

module.exports = deletePedido