const db = require("../../config/db");

const obtenerPagosPorPlan = async (planPagoId, connection = null) => {
  const exec = connection ? connection.query.bind(connection) : db.query.bind(db);

  const [rows] = await exec(
    `
      SELECT
        pago_cliente_id,
        plan_pago_id,
        codigo_recibo,
        monto,
        numero_transferencia,
        tipo_pago,
        notas,
        fecha_pago,
        fecha_registro
      FROM pagos_cliente
      WHERE plan_pago_id = ?
      ORDER BY fecha_pago ASC, pago_cliente_id ASC
    `,
    [planPagoId]
  );

  return rows;
};

const obtenerPlanCompleto = async (planPagoId, connection = null) => {
  const exec = connection ? connection.query.bind(connection) : db.query.bind(db);

  const [planes] = await exec(
    `
      SELECT
        pp.*,
        c.codigo_cotizacion AS cotizacion_codigo_ref,
        c.valor_total AS cotizacion_valor_ref,
        c.tipo_prenda_nombre,
        c.titulo_prenda
      FROM planes_pago pp
      INNER JOIN cotizaciones c ON c.cotizacion_id = pp.cotizacion_id
      WHERE pp.plan_pago_id = ?
      LIMIT 1
    `,
    [planPagoId]
  );

  if (!planes.length) return null;

  const plan = planes[0];
  plan.pagos = await obtenerPagosPorPlan(planPagoId, connection);
  return plan;
};

const recalcularTotalesPlan = async (planPagoId, connection) => {
  const [sumRows] = await connection.query(
    `SELECT COALESCE(SUM(monto), 0) AS total FROM pagos_cliente WHERE plan_pago_id = ?`,
    [planPagoId]
  );

  const totalAbonado = Number(sumRows[0]?.total || 0);

  const [planRows] = await connection.query(
    `SELECT valor_a_cobrar FROM planes_pago WHERE plan_pago_id = ?`,
    [planPagoId]
  );

  const valorACobrar = Number(planRows[0]?.valor_a_cobrar || 0);
  const saldoPendiente = Math.max(0, valorACobrar - totalAbonado);

  await connection.query(
    `UPDATE planes_pago SET total_abonado = ?, saldo_pendiente = ? WHERE plan_pago_id = ?`,
    [totalAbonado, saldoPendiente, planPagoId]
  );

  return { totalAbonado, saldoPendiente };
};

module.exports = {
  obtenerPagosPorPlan,
  obtenerPlanCompleto,
  recalcularTotalesPlan,
};
