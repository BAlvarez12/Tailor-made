const pool = require('../../config/db.js')

/**
 * Detalle completo del cliente para la ficha 360°:
 *   - datos básicos
 *   - medidas históricas
 *   - prendas
 *   - cotizaciones (con sus totales)
 *   - planes de pago (con saldo)
 *   - resumen: total facturado, total cobrado, saldo pendiente, #prendas, #cotizaciones
 */
const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params

    const [clienteRows] = await pool.query(
      `SELECT cliente_id, nombre_cliente, apellido_cliente, telefono, dpi, estado, fecha_creado
         FROM clientes
        WHERE cliente_id = ?
        LIMIT 1`,
      [id]
    )

    if (clienteRows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }

    const cliente = clienteRows[0]

    // Misma consulta que usa el modal de medidas, para mantener
    // consistencia en el formato de los datos.
    const [medidasRows] = await pool.query(
      `SELECT m.cliente_medida_id, m.tipo_medida_id, t.nombre_tipo_medida, m.valor
         FROM cliente_medidas m
         INNER JOIN tipo_medidas t ON m.tipo_medida_id = t.tipo_medida_id
        WHERE m.cliente_id = ?`,
      [id]
    )
    const medidas = Array.isArray(medidasRows) ? medidasRows : []

    const [prendas] = await pool.query(
      `SELECT
         cp.cliente_prenda_id,
         cp.titulo,
         cp.tipo_prenda_id,
         cp.estado,
         cp.fecha_creado
       FROM cliente_prenda cp
       WHERE cp.cliente_id = ?
       ORDER BY cp.cliente_prenda_id DESC`,
      [id]
    )

    const [cotizaciones] = await pool.query(
      `SELECT cotizacion_id, codigo_cotizacion, titulo_prenda, valor_total, fecha_creado
         FROM cotizaciones
        WHERE cliente_id = ?
        ORDER BY cotizacion_id DESC`,
      [id]
    )

    const [planesPago] = await pool.query(
      `SELECT
         pp.plan_pago_id,
         pp.codigo_plan,
         pp.cotizacion_id,
         pp.valor_a_cobrar,
         pp.total_abonado,
         pp.saldo_pendiente,
         pp.fecha_creado
       FROM planes_pago pp
       JOIN cotizaciones c ON c.cotizacion_id = pp.cotizacion_id
       WHERE c.cliente_id = ?
       ORDER BY pp.plan_pago_id DESC`,
      [id]
    )

    const totalFacturado = cotizaciones.reduce(
      (acc, c) => acc + Number(c.valor_total || 0),
      0
    )
    const totalCobrado = planesPago.reduce(
      (acc, p) => acc + Number(p.total_abonado || 0),
      0
    )
    const saldoPendiente = planesPago.reduce(
      (acc, p) => acc + Number(p.saldo_pendiente || 0),
      0
    )

    res.json({
      cliente,
      resumen: {
        totalFacturado,
        totalCobrado,
        saldoPendiente,
        totalPrendas: prendas.length,
        totalCotizaciones: cotizaciones.length,
      },
      medidas,
      prendas,
      cotizaciones,
      planesPago,
    })
  } catch (error) {
    console.error('Error al obtener detalle del cliente:', error)
    res.status(500).json({ message: 'Error al obtener detalle del cliente' })
  }
}

module.exports = { obtenerClientePorId }
