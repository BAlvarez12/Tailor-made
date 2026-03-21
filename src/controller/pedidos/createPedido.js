const db = require('../../config/db')

const crearPedido = async (req, res) => {
  try {
    const { cliente_id, prenda_id, notas, medidas } = req.body

    console.log('MEDIDAS RECIBIDAS:', medidas)

    // 1. CREAR PEDIDO
    const [pedidoResult] = await db.query(
      `INSERT INTO pedidos (cliente_id, prenda_id, notas)
       VALUES (?, ?, ?)`,
      [cliente_id, prenda_id, notas]
    )

    const pedido_id = pedidoResult.insertId

    // 2. VALIDAR MEDIDAS
    if (!medidas || medidas.length === 0) {
      return res.json({
        mensaje: 'Pedido creado sin medidas',
        pedido_id
      })
    }

    // 3. GUARDAR MEDIDAS
    for (const medida of medidas) {

      if (!medida.valor) continue

      await db.query(
        `INSERT INTO cliente_prenda_medidas 
        (cliente_prenda_id, tipo_medida_id, unidad_id, valor, usuario_creado)
        VALUES (?, ?, ?, ?, ?)`,
        [pedido_id, medida.tipo_medida_id, 1, medida.valor, 1]
      )
    }

    res.json({
      mensaje: 'Pedido guardado correctamente',
      pedido_id
    })

  } catch (error) {
    console.error('ERROR CREATE PEDIDO:', error)
    res.status(500).json({ error: 'Error al guardar pedido' })
  }
}

module.exports = crearPedido