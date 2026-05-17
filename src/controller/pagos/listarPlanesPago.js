const db = require("../../config/db");

const listarPlanesPago = async (req, res) => {
  try {
    const { q, cliente_id } = req.query;
    const termino = q ? String(q).trim() : "";
    const clienteId = cliente_id ? Number(cliente_id) : null;

    let sql = `
      SELECT
        pp.plan_pago_id,
        pp.codigo_plan,
        pp.cotizacion_id,
        pp.cliente_id,
        pp.codigo_cotizacion,
        pp.cliente_nombre,
        pp.cliente_telefono,
        pp.valor_a_cobrar,
        pp.cantidad_pagos,
        pp.valor_anticipo,
        pp.total_abonado,
        pp.saldo_pendiente,
        pp.fecha_creado,
        (
          SELECT COUNT(*)
          FROM pagos_cliente pc
          WHERE pc.plan_pago_id = pp.plan_pago_id
        ) AS pagos_registrados
      FROM planes_pago pp
      WHERE pp.estado = 1
    `;

    const params = [];

    if (clienteId && !Number.isNaN(clienteId)) {
      sql += ` AND pp.cliente_id = ?`;
      params.push(clienteId);
    }

    if (termino) {
      const like = `%${termino}%`;
      sql += `
        AND (
          pp.codigo_plan LIKE ?
          OR pp.codigo_cotizacion LIKE ?
          OR pp.cliente_nombre LIKE ?
          OR pp.cliente_telefono LIKE ?
        )
      `;
      params.push(like, like, like, like);
    }

    sql += ` ORDER BY pp.fecha_creado DESC, pp.plan_pago_id DESC LIMIT 200`;

    const [rows] = await db.query(sql, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en listarPlanesPago:", error);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({
        message: "Ejecuta database/pagos.sql en la base de datos",
      });
    }

    return res.status(500).json({
      message: "Error al listar planes de pago",
      error: error.message,
    });
  }
};

module.exports = { listarPlanesPago };
