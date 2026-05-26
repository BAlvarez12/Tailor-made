const db = require("../../config/db");
const { registrar, fromReq } = require("../../services/logOperaciones");

/**
 * Edita una cotización existente. Reglas:
 *   - Solo se permiten cambiar `valor_total` y `notas`.
 *   - Cliente y prenda NO se pueden cambiar (sería otra cotización).
 *   - Bloqueado si la cotización ya está anulada (estado=0).
 *   - Bloqueado si ya tiene un plan de pago activo (cambiaría el monto base
 *     de un compromiso financiero ya pactado).
 */
const editarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_total, notas } = req.body;

    const valor = Number(valor_total);
    if (!valor_total || Number.isNaN(valor) || valor <= 0) {
      return res.status(400).json({
        message: "El valor de la cotización debe ser un número mayor a 0.",
      });
    }

    const notasLimpio = notas ? String(notas).trim() : null;

    // Validar que la cotización exista y esté activa
    const [cotizaciones] = await db.query(
      `SELECT cotizacion_id, codigo_cotizacion, valor_total, estado
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
        message: "No se puede editar una cotización anulada.",
      });
    }

    // Bloquear si ya tiene plan de pago activo
    const [planes] = await db.query(
      `SELECT plan_pago_id FROM planes_pago
        WHERE cotizacion_id = ? AND estado = 1
        LIMIT 1`,
      [id]
    );

    if (planes.length > 0) {
      return res.status(409).json({
        message:
          "No se puede editar: esta cotización ya tiene un plan de pago. Anula el plan antes de modificar.",
      });
    }

    await db.query(
      `UPDATE cotizaciones
          SET valor_total = ?, notas = ?
        WHERE cotizacion_id = ?`,
      [valor, notasLimpio, id]
    );

    registrar({
      ...fromReq(req),
      accion: "editar",
      entidad: "cotizacion",
      entidadId: Number(id),
      descripcion: `Cotización ${cotizacion.codigo_cotizacion} editada (Q ${cotizacion.valor_total} → Q ${valor.toFixed(2)})`,
      datosAntes: { valor_total: cotizacion.valor_total },
      datosDespues: { valor_total: valor, notas: notasLimpio },
    });

    res.json({
      message: "Cotización actualizada correctamente.",
      cotizacion_id: Number(id),
    });
  } catch (error) {
    console.error("Error al editar cotización:", error);
    res.status(500).json({ message: "Error al editar la cotización." });
  }
};

module.exports = { editarCotizacion };
