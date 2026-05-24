const db = require("../../config/db");
const { generarCodigoPlanPago } = require("../../utils/generarCodigoPlanPago");
const { generarCodigoRecibo } = require("../../utils/generarCodigoRecibo");
const { normalizarFechaPago } = require("../../utils/normalizarFechaPago");
const { recalcularTotalesPlan } = require("./pagosQueries");

const crearPlanPago = async (req, res) => {
  let connection;

  try {
    const {
      cotizacion_id,
      valor_a_cobrar,
      cantidad_pagos,
      valor_anticipo,
      numero_transferencia,
      notas,
      registrar_anticipo,
      fecha_pago,
      usuario_creador,
    } = req.body;

    const cotizacionId = Number(cotizacion_id);
    const valorACobrar = Number(valor_a_cobrar);
    const cantidadPagos = Math.max(1, Number(cantidad_pagos) || 1);
    const valorAnticipo = Number(valor_anticipo) || 0;
    const debeRegistrarAnticipo =
      registrar_anticipo !== false && valorAnticipo > 0;
    const usuarioCreador = usuario_creador ? Number(usuario_creador) : null;

    if (!cotizacionId || !valorACobrar || valorACobrar <= 0) {
      return res.status(400).json({
        message: "cotizacion_id y valor_a_cobrar (> 0) son obligatorios",
      });
    }

    if (valorAnticipo < 0) {
      return res.status(400).json({ message: "valor_anticipo no puede ser negativo" });
    }

    if (valorAnticipo > valorACobrar) {
      return res.status(400).json({
        message: "El anticipo no puede ser mayor al valor a cobrar",
      });
    }

    if (debeRegistrarAnticipo && !String(numero_transferencia || "").trim()) {
      return res.status(400).json({
        message: "numero_transferencia es obligatorio al registrar el anticipo",
      });
    }

    let fechaPagoAnticipoSql = null;
    if (debeRegistrarAnticipo) {
      fechaPagoAnticipoSql = normalizarFechaPago(fecha_pago);
      if (!fechaPagoAnticipoSql) {
        return res.status(400).json({
          message: "fecha_pago es obligatoria al registrar el anticipo",
        });
      }
    }

    const [cotizaciones] = await db.query(
      `
        SELECT cotizacion_id, cliente_id, codigo_cotizacion, cliente_nombre,
               cliente_telefono, valor_total
        FROM cotizaciones
        WHERE cotizacion_id = ? AND estado = 1
        LIMIT 1
      `,
      [cotizacionId]
    );

    if (!cotizaciones.length) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    const cotizacion = cotizaciones[0];

    const [existente] = await db.query(
      `SELECT plan_pago_id FROM planes_pago WHERE cotizacion_id = ? LIMIT 1`,
      [cotizacionId]
    );

    if (existente.length) {
      return res.status(409).json({
        message:
          "Esta cotización ya tiene un plan de pago. Registra abonos en el plan existente.",
        plan_pago_id: existente[0].plan_pago_id,
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const codigoPlan = await generarCodigoPlanPago(connection);
    const saldoInicial = valorACobrar - (debeRegistrarAnticipo ? valorAnticipo : 0);
    const totalInicial = debeRegistrarAnticipo ? valorAnticipo : 0;

    const [insertPlan] = await connection.query(
      `
        INSERT INTO planes_pago (
          codigo_plan,
          cotizacion_id,
          cliente_id,
          codigo_cotizacion,
          cliente_nombre,
          cliente_telefono,
          valor_cotizacion_original,
          valor_a_cobrar,
          cantidad_pagos,
          valor_anticipo,
          total_abonado,
          saldo_pendiente,
          notas,
          usuario_creador
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        codigoPlan,
        cotizacion.cotizacion_id,
        cotizacion.cliente_id,
        cotizacion.codigo_cotizacion,
        cotizacion.cliente_nombre,
        cotizacion.cliente_telefono,
        cotizacion.valor_total,
        valorACobrar,
        cantidadPagos,
        valorAnticipo,
        totalInicial,
        saldoInicial,
        notas ? String(notas).trim() : null,
        usuarioCreador,
      ]
    );

    const planPagoId = insertPlan.insertId;
    let pagoAnticipoId = null;
    let codigoReciboAnticipo = null;

    if (debeRegistrarAnticipo) {
      codigoReciboAnticipo = await generarCodigoRecibo(connection);

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
          ) VALUES (?, ?, ?, ?, 'anticipo', ?, ?, ?)
        `,
        [
          planPagoId,
          codigoReciboAnticipo,
          valorAnticipo,
          String(numero_transferencia).trim(),
          "Anticipo inicial del plan de pago",
          fechaPagoAnticipoSql,
          usuarioCreador,
        ]
      );

      pagoAnticipoId = insertPago.insertId;
      await recalcularTotalesPlan(planPagoId, connection);
    }

    await connection.commit();

    return res.status(201).json({
      message: "Plan de pago creado correctamente",
      plan_pago_id: planPagoId,
      codigo_plan: codigoPlan,
      pago_anticipo_id: pagoAnticipoId,
      codigo_recibo_anticipo: codigoReciboAnticipo,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error en crearPlanPago:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Esta cotización ya tiene un plan de pago asociado",
      });
    }

    return res.status(500).json({
      message: "Error al crear el plan de pago",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { crearPlanPago };
