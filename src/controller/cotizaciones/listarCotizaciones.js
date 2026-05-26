const db = require("../../config/db");

const ESTADOS_VALIDOS = ["activas", "anuladas", "todas"];

const listarCotizaciones = async (req, res) => {
  try {
    const { q } = req.query;
    const termino = q ? String(q).trim() : "";
    const estadoFiltro = ESTADOS_VALIDOS.includes(req.query.estado)
      ? req.query.estado
      : "activas";

    let sql = `
      SELECT
        c.cotizacion_id,
        c.codigo_cotizacion,
        c.cliente_id,
        c.cliente_prenda_id,
        c.titulo_prenda,
        c.tipo_prenda_nombre,
        c.cliente_nombre,
        c.cliente_telefono,
        c.valor_total,
        c.notas,
        c.fecha_creado,
        c.estado AS estado_registro,
        CASE WHEN pp.plan_pago_id IS NOT NULL THEN 1 ELSE 0 END AS tiene_plan_pago,
        pp.plan_pago_id,
        pp.codigo_plan,
        pp.saldo_pendiente,
        pp.total_abonado,
        pp.valor_a_cobrar,
        CASE
          WHEN c.estado = 0 THEN 'anulada'
          WHEN pp.plan_pago_id IS NOT NULL AND pp.saldo_pendiente <= 0 THEN 'finalizada'
          WHEN pp.plan_pago_id IS NOT NULL THEN 'en_proceso'
          ELSE 'activa'
        END AS estado_cotizacion
      FROM cotizaciones c
      LEFT JOIN planes_pago pp
        ON pp.cotizacion_id = c.cotizacion_id AND pp.estado = 1
      WHERE 1 = 1
    `;

    const params = [];

    if (estadoFiltro === "activas") {
      sql += ` AND c.estado = 1`;
    } else if (estadoFiltro === "anuladas") {
      sql += ` AND c.estado = 0`;
    }
    // "todas" no agrega filtro

    if (termino) {
      const like = `%${termino}%`;
      sql += `
        AND (
          c.codigo_cotizacion LIKE ?
          OR c.cliente_nombre LIKE ?
          OR c.cliente_telefono LIKE ?
          OR REPLACE(c.cliente_telefono, ' ', '') LIKE REPLACE(?, ' ', '')
        )
      `;
      params.push(like, like, like, like);
    }

    sql += ` ORDER BY c.fecha_creado DESC, c.cotizacion_id DESC LIMIT 200`;

    const [rows] = await db.query(sql, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en listarCotizaciones:", error);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({
        message:
          "Las tablas de cotizaciones no existen. Ejecuta database/cotizaciones.sql",
      });
    }

    return res.status(500).json({
      message: "Error al listar cotizaciones",
      error: error.message,
    });
  }
};

module.exports = { listarCotizaciones };
