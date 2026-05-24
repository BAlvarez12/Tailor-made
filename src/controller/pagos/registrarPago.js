const db = require("../../config/db");
const { generarCodigoRecibo } = require("../../utils/generarCodigoRecibo");
const { normalizarFechaPago } = require("../../utils/normalizarFechaPago");
const { recalcularTotalesPlan } = require("./pagosQueries");

const registrarPago = async (req, res) => {
  let connection;

  try {
    const {
      plan_pago_id,
      monto,
      numero_transferencia,
      tipo_pago,
      notas,
      fecha_pago,
      usuario_creador,
    } = req.body;

    const planPagoId = Number(plan_pago_id);
    const montoPago = Number(monto);
    const usuarioCreador = usuario_creador ? Number(usuario_creador) : null;
    const tipo =
      tipo_pago && ["anticipo", "abono", "otro"].includes(tipo_pago)
        ? tipo_pago
        : "abono";

    if (!planPagoId || !montoPago || montoPago <= 0) {
      return res.status(400).json({
        message: "plan_pago_id y monto (> 0) son obligatorios",
      });
    }

    if (!String(numero_transferencia || "").trim()) {
      return res.status(400).json({
        message: "numero_transferencia es obligatorio",
      });
    }

    const fechaPagoSql = normalizarFechaPago(fecha_pago);
    if (!fechaPagoSql) {
      return res.status(400).json({
        message: "fecha_pago es obligatoria (formato YYYY-MM-DD)",
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [planes] = await connection.query(
      `SELECT plan_pago_id, saldo_pendiente, valor_a_cobrar FROM planes_pago WHERE plan_pago_id = ? AND estado = 1`,
      [planPagoId]
    );

    if (!planes.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Plan de pago no encontrado" });
    }

    const plan = planes[0];
    const saldo = Number(plan.saldo_pendiente);

    if (montoPago > saldo + 0.009) {
      await connection.rollback();
      return res.status(400).json({
        message: `El monto excede el saldo pendiente (${saldo.toFixed(2)})`,
      });
    }

    const codigoRecibo = await generarCodigoRecibo(connection);

    const [insertPago] = await connection.query(
      `
        INSERT INTO pagos_cliente (
          plan_pago_id,
          codigo_recibo,
          monto,
          numero_transferencia,
          tipo_pago,
          notas,
          fecha_pago,
          usuario_creador
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        planPagoId,
        codigoRecibo,
        montoPago,
        String(numero_transferencia).trim(),
        tipo,
        notas ? String(notas).trim() : null,
        fechaPagoSql,
        usuarioCreador,
      ]
    );

    const totales = await recalcularTotalesPlan(planPagoId, connection);

    await connection.commit();

    return res.status(201).json({
      message: "Pago registrado correctamente",
      pago_cliente_id: insertPago.insertId,
      codigo_recibo: codigoRecibo,
      total_abonado: totales.totalAbonado,
      saldo_pendiente: totales.saldoPendiente,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error en registrarPago:", error);
    return res.status(500).json({
      message: "Error al registrar el pago",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { registrarPago };
