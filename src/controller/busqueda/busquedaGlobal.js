const pool = require('../../config/db.js')

/**
 * Búsqueda global por nombre, DPI, código de cotización, código de plan
 * o ID de prenda.  Devuelve un máximo de 5 resultados por entidad para
 * evitar respuestas pesadas.
 */
const busquedaGlobal = async (req, res) => {
  try {
    const q = String(req.query.q || '').trim()
    if (q.length < 2) {
      return res.json({ clientes: [], cotizaciones: [], planes_pago: [], prendas: [] })
    }

    const like = `%${q}%`
    const exact = q

    const permisos = req.user?.permisos || []
    const puedeVer = (codigo) => permisos.includes(codigo)

    const resultados = {
      clientes: [],
      cotizaciones: [],
      planes_pago: [],
      prendas: [],
    }

    if (puedeVer('ver_clientes')) {
      const [rows] = await pool.query(
        `SELECT cliente_id, nombre_cliente, apellido_cliente, dpi, telefono
           FROM clientes
          WHERE nombre_cliente LIKE ?
             OR apellido_cliente LIKE ?
             OR dpi LIKE ?
             OR CONCAT(nombre_cliente, ' ', apellido_cliente) LIKE ?
          ORDER BY cliente_id DESC
          LIMIT 5`,
        [like, like, like, like]
      )
      resultados.clientes = rows
    }

    if (puedeVer('ver_cotizaciones')) {
      const [rows] = await pool.query(
        `SELECT cotizacion_id, codigo_cotizacion, cliente_nombre, valor_total, fecha_creado
           FROM cotizaciones
          WHERE codigo_cotizacion LIKE ?
             OR cliente_nombre LIKE ?
          ORDER BY cotizacion_id DESC
          LIMIT 5`,
        [like, like]
      )
      resultados.cotizaciones = rows
    }

    if (puedeVer('ver_plan_pagos')) {
      const [rows] = await pool.query(
        `SELECT pp.plan_pago_id, pp.codigo_plan, pp.cotizacion_id,
                c.cliente_nombre, pp.valor_a_cobrar, pp.saldo_pendiente
           FROM planes_pago pp
           LEFT JOIN cotizaciones c ON c.cotizacion_id = pp.cotizacion_id
          WHERE pp.codigo_plan LIKE ?
             OR c.cliente_nombre LIKE ?
          ORDER BY pp.plan_pago_id DESC
          LIMIT 5`,
        [like, like]
      )
      resultados.planes_pago = rows
    }

    if (puedeVer('ver_prendas')) {
      const [rows] = await pool.query(
        `SELECT cp.cliente_prenda_id, cp.titulo,
                CONCAT(c.nombre_cliente, ' ', c.apellido_cliente) AS cliente_nombre
           FROM cliente_prenda cp
           LEFT JOIN clientes c ON c.cliente_id = cp.cliente_id
          WHERE cp.titulo LIKE ?
             OR CONCAT(c.nombre_cliente, ' ', c.apellido_cliente) LIKE ?
          ORDER BY cp.cliente_prenda_id DESC
          LIMIT 5`,
        [like, like]
      )
      resultados.prendas = rows
    }

    res.json(resultados)
  } catch (error) {
    console.error('Error en búsqueda global:', error)
    res.status(500).json({ message: 'Error en la búsqueda' })
  }
}

module.exports = { busquedaGlobal }
