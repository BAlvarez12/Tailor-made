const db = require("../../config/db");
const { obtenerPlanCompleto } = require("./pagosQueries");
const { generarPdfReciboPago } = require("../../utils/pdfReciboPago");

const descargarPdfRecibo = async (req, res) => {
  try {
    const pagoId = Number(req.params.pagoId);

    if (!pagoId || Number.isNaN(pagoId)) {
      return res.status(400).json({ message: "Id de pago inválido" });
    }

    const [pagos] = await db.query(
      `SELECT * FROM pagos_cliente WHERE pago_cliente_id = ? LIMIT 1`,
      [pagoId]
    );

    if (!pagos.length) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    const pago = pagos[0];
    const plan = await obtenerPlanCompleto(pago.plan_pago_id);

    if (!plan) {
      return res.status(404).json({ message: "Plan de pago no encontrado" });
    }

    const pdfBuffer = await generarPdfReciboPago(plan, pago);
    const nombreArchivo = `${pago.codigo_recibo}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${nombreArchivo}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error en generarPdfRecibo:", error);
    return res.status(500).json({
      message: "Error al generar el recibo PDF",
      error: error.message,
    });
  }
};

module.exports = { descargarPdfRecibo };
