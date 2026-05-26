const db = require('../../config/db')

const ESTADOS_PRENDA_VALIDOS = ['pendiente', 'en_proceso', 'finalizada', 'todas']

const obtenerPrendas = async (req, res) => {
  try {
    const estadoFiltro = ESTADOS_PRENDA_VALIDOS.includes(req.query.estado)
      ? req.query.estado
      : 'todas'

    const sql = `
      SELECT
        cp.cliente_prenda_id,
        cp.titulo,
        cp.estado,
        cp.fecha_creado,

        c.cliente_id,
        c.nombre_cliente,
        c.apellido_cliente,
        c.telefono,

        tp.tipo_prendas_id,
        tp.nombre AS tipo_prenda_nombre,

        cpi.url_img,

        cot_ult.cotizacion_id,
        cot_ult.codigo_cotizacion,
        pp.plan_pago_id,
        pp.saldo_pendiente,
        pp.total_abonado,
        pp.valor_a_cobrar,

        CASE
          WHEN cot_ult.cotizacion_id IS NULL THEN 'pendiente'
          WHEN pp.plan_pago_id IS NOT NULL AND pp.saldo_pendiente <= 0 THEN 'finalizada'
          ELSE 'en_proceso'
        END AS estado_prenda

      FROM cliente_prenda cp
      INNER JOIN clientes c
        ON cp.cliente_id = c.cliente_id
      LEFT JOIN tipo_prendas tp
        ON cp.tipo_prenda_id = tp.tipo_prendas_id
      LEFT JOIN cliente_prenda_img cpi
        ON cp.cliente_prenda_id = cpi.cliente_prenda_id

      LEFT JOIN (
        SELECT cot1.cliente_prenda_id, cot1.cotizacion_id, cot1.codigo_cotizacion
        FROM cotizaciones cot1
        WHERE cot1.estado = 1
          AND cot1.cotizacion_id = (
            SELECT cot2.cotizacion_id
            FROM cotizaciones cot2
            WHERE cot2.cliente_prenda_id = cot1.cliente_prenda_id
              AND cot2.estado = 1
            ORDER BY cot2.fecha_creado DESC, cot2.cotizacion_id DESC
            LIMIT 1
          )
      ) cot_ult ON cot_ult.cliente_prenda_id = cp.cliente_prenda_id

      LEFT JOIN planes_pago pp
        ON pp.cotizacion_id = cot_ult.cotizacion_id AND pp.estado = 1

      WHERE cp.estado = 1
        AND c.estado = 1
        ${estadoFiltro === 'todas' ? '' : `
        AND (
          CASE
            WHEN cot_ult.cotizacion_id IS NULL THEN 'pendiente'
            WHEN pp.plan_pago_id IS NOT NULL AND pp.saldo_pendiente <= 0 THEN 'finalizada'
            ELSE 'en_proceso'
          END
        ) = ?`}

      ORDER BY cp.cliente_prenda_id DESC
    `

    const params = estadoFiltro === 'todas' ? [] : [estadoFiltro]
    const [rows] = await db.query(sql, params)

    const prendasMap = new Map()

    for (const row of rows) {
      if (!prendasMap.has(row.cliente_prenda_id)) {
        prendasMap.set(row.cliente_prenda_id, {
          cliente_prenda_id: row.cliente_prenda_id,
          titulo: row.titulo,
          estado: row.estado,
          estado_prenda: row.estado_prenda,
          fecha_creado: row.fecha_creado,

          cliente: {
            cliente_id: row.cliente_id,
            nombre_cliente: row.nombre_cliente,
            apellido_cliente: row.apellido_cliente,
            nombre_completo: `${row.nombre_cliente || ''} ${row.apellido_cliente || ''}`.trim(),
            telefono: row.telefono
          },

          tipo_prenda: {
            tipo_prendas_id: row.tipo_prendas_id,
            nombre: row.tipo_prenda_nombre
          },

          cotizacion: row.cotizacion_id
            ? {
                cotizacion_id: row.cotizacion_id,
                codigo_cotizacion: row.codigo_cotizacion
              }
            : null,

          plan_pago: row.plan_pago_id
            ? {
                plan_pago_id: row.plan_pago_id,
                saldo_pendiente: row.saldo_pendiente,
                total_abonado: row.total_abonado,
                valor_a_cobrar: row.valor_a_cobrar
              }
            : null,

          imagen_principal: null,
          imagenes: []
        })
      }

      const prenda = prendasMap.get(row.cliente_prenda_id)

      if (row.url_img && !prenda.imagenes.includes(row.url_img)) {
        prenda.imagenes.push(row.url_img)

        if (!prenda.imagen_principal) {
          prenda.imagen_principal = row.url_img
        }
      }
    }

    const prendas = Array.from(prendasMap.values())

    return res.status(200).json(prendas)
  } catch (error) {
    console.error('Error en obtenerPrendas:', error)
    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

module.exports = { obtenerPrendas }