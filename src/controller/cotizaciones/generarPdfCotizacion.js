const { obtenerCotizacionCompleta } = require("./cotizacionQueries");
const { generarPdfCotizacion } = require("../../utils/pdfCotizacion");

const descargarPdfCotizacion = async (req, res) => {
  try {
    const cotizacionId = Number(req.params.id);

    if (!cotizacionId || Number.isNaN(cotizacionId)) {
      return res.status(400).json({ message: "Id de cotización inválido" });
    }

    const cotizacion = await obtenerCotizacionCompleta(cotizacionId, {
      incluirAnuladas: true,
    });

    if (!cotizacion) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    const pdfBuffer = await generarPdfCotizacion(cotizacion);
    const nombreArchivo = `${cotizacion.codigo_cotizacion}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${nombreArchivo}"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error en generarPdfCotizacion:", error);
    return res.status(500).json({
      message: "Error al generar el PDF de la cotización",
      error: error.message,
    });
  }
};

module.exports = { descargarPdfCotizacion };
