const pool = require('../../config/db.js')

const DIAS_LOG_PERMITIDOS = [7, 15, 30]
const DIAS_LOG_DEFAULT = 30
const LIMITE_LOG = 200

const obtenerDashboard = async (req, res) => {
  try {
    const diasRaw = Number.parseInt(req.query.diasLog, 10)
    const diasLog = DIAS_LOG_PERMITIDOS.includes(diasRaw)
      ? diasRaw
      : DIAS_LOG_DEFAULT
    const [[cotizMes]] = await pool.query(`
      SELECT
        COUNT(*) AS cantidad,
        COALESCE(SUM(valor_total), 0) AS valor_total
      FROM cotizaciones
      WHERE YEAR(fecha_creado) = YEAR(CURDATE())
        AND MONTH(fecha_creado) = MONTH(CURDATE())
    `)

    const [[pagosHoy]] = await pool.query(`
      SELECT
        COUNT(*) AS cantidad,
        COALESCE(SUM(monto), 0) AS valor_total
      FROM pagos_cliente
      WHERE DATE(fecha_pago) = CURDATE()
    `)

    const [[pagosMes]] = await pool.query(`
      SELECT
        COUNT(*) AS cantidad,
        COALESCE(SUM(monto), 0) AS valor_total
      FROM pagos_cliente
      WHERE YEAR(fecha_pago) = YEAR(CURDATE())
        AND MONTH(fecha_pago) = MONTH(CURDATE())
    `)

    const [[prendasActivas]] = await pool.query(`
      SELECT COUNT(*) AS cantidad
      FROM cliente_prenda
      WHERE estado = 1
    `)

    const [[clientesTotal]] = await pool.query(`
      SELECT COUNT(*) AS cantidad
      FROM clientes
      WHERE estado = 1
    `)

    const [stockBajo] = await pool.query(`
      SELECT material_id, nombre_material, stock
      FROM materiales
      WHERE stock <= 5 AND estado = 1
      ORDER BY stock ASC
      LIMIT 10
    `)

    const [ultimasOperaciones] = await pool.query(
      `
      SELECT
        lo.log_id, lo.fecha, lo.accion, lo.entidad, lo.descripcion,
        u.usuario AS usuario_nombre
      FROM log_operaciones lo
      LEFT JOIN usuarios u ON u.usuario_id = lo.usuario_id
      WHERE lo.fecha >= NOW() - INTERVAL ? DAY
      ORDER BY lo.log_id DESC
      LIMIT ?
      `,
      [diasLog, LIMITE_LOG]
    )

    const [topClientes] = await pool.query(`
      SELECT
        c.cliente_id,
        CONCAT(c.nombre_cliente, ' ', c.apellido_cliente) AS nombre,
        COUNT(co.cotizacion_id) AS cotizaciones,
        COALESCE(SUM(co.valor_total), 0) AS total_facturado
      FROM clientes c
      JOIN cotizaciones co ON co.cliente_id = c.cliente_id
      GROUP BY c.cliente_id, nombre
      ORDER BY total_facturado DESC
      LIMIT 5
    `)

    res.json({
      cotizacionesMes: cotizMes,
      pagosHoy,
      pagosMes,
      prendasActivas: prendasActivas.cantidad,
      clientesActivos: clientesTotal.cantidad,
      stockBajo,
      ultimasOperaciones,
      topClientes,
      diasLog,
    })
  } catch (error) {
    console.error('Error al obtener dashboard:', error)
    res.status(500).json({ message: 'Error al cargar el dashboard' })
  }
}

module.exports = { obtenerDashboard }
