const db = require('../../config/db')

const getPedidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
  SELECT 
    p.pedido_id,
    p.cliente_id,
    p.prenda_id,
    CONCAT(c.nombre_cliente, ' ', c.apellido_cliente) AS cliente,
    pr.nombre_prenda,
    p.fecha,
    p.notas,
    (
      SELECT pi.url_img 
      FROM prendas_img pi 
      WHERE pi.prenda_id = p.prenda_id 
      LIMIT 1
    ) AS imagen
  FROM pedidos p
  JOIN clientes c ON p.cliente_id = c.cliente_id
  JOIN prendas pr ON p.prenda_id = pr.prenda_id
  ORDER BY p.fecha DESC
`)

    res.json(rows)

  } catch (error) {
    console.error('Error en getPedidos:', error)
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
}

module.exports = getPedidos