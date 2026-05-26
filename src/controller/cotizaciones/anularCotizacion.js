const db = require("../../config/db");
const { registrar, fromReq } = require("../../services/logOperaciones");

/**
 * Anula (soft delete) una cotización.  Marca estado=0.
 * Reglas:
 *   - Si ya está anulada, responde 409.
 *   - Si tiene plan de pago activo con abonos registrados, NO se permite
 *     anular (rompería el rastro contable).
 *   - El motivo (opcional) se guarda en el log de operaciones.
 */
const anularCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const motivo = req.body?.motivo
      ? String(req.body.motivo).trim().slice(0, 200)
      : null;

    const [cotizaciones] = await db.query(
      `SELECT cotizacion_id, codigo_cotizacion, estado
         FROM cotizaciones
        WHERE cotizacion_id = ?
        LIMIT 1`,
      [id]
    );

    if (cotizaciones.length === 0) {
      return res.status(404).json({ message: "Cotización no encontrada." });
    }

    const cotizacion = cotizaciones[0];
    if (Number(cotizacion.estado) === 0) {
      return res.status(409).json({
        message: "Esta cotización ya está anulada.",
      });
    }

    // Si hay plan de pago activo con abonos, bloquear
    const [planes] = await db.query(
      `SELECT pp.plan_pago_id, pp.total_abonado
         FROM planes_pago pp
        WHERE pp.cotizacion_id = ? AND pp.estado = 1
        LIMIT 1`,
      [id]
    );

    if (planes.length > 0 && Number(planes[0].total_abonado) > 0) {
      return res.status(409).json({
        message:
          "No se puede anular: el plan de pago de esta cotización ya tiene abonos registrados.",
      });
    }

    if (planes.length > 0) {
      return res.status(409).json({
        message:
          "No se puede anular: esta cotización tiene un plan de pago activo. Anula el plan primero.",
      });
    }

    await db.query(
      `UPDATE cotizaciones SET estado = 0 WHERE cotizacion_id = ?`,
      [id]
    );

    registrar({
      ...fromReq(req),
      accion: "inactivar",
      entidad: "cotizacion",
      entidadId: Number(id),
      descripcion: `Cotización ${cotizacion.codigo_cotizacion} anulada${motivo ? ` — Motivo: ${motivo}` : ""}`,
      datosDespues: { estado: 0, motivo },
    });

    res.json({
      message: "Cotización anulada correctamente.",
      cotizacion_id: Number(id),
    });
  } catch (error) {
    console.error("Error al anular cotización:", error);
    res.status(500).json({ message: "Error al anular la cotización." });
  }
};

module.exports = { anularCotizacion };
