const db = require('../../config/db')

const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params

    // 1. PEDIDO
    const [pedido] = await db.query(`
      SELECT 
        p.*,
        pi.url_img AS imagen
      FROM pedidos p
      LEFT JOIN prendas_img pi ON p.prenda_id = pi.prenda_id
      WHERE p.pedido_id = ?
      LIMIT 1
    `, [id])

    if (pedido.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    // 2. MEDIDAS
    const [medidas] = await db.query(`
      SELECT 
        tipo_medida_id,
        valor
      FROM cliente_prenda_medidas
      WHERE cliente_prenda_id = ?
    `, [id])

    res.json({
      ...pedido[0],
      medidas
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener pedido' })
  }
}

module.exports = getPedidoById