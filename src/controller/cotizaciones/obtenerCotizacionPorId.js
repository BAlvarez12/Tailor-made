const { obtenerCotizacionCompleta } = require("./cotizacionQueries");

const obtenerCotizacionPorId = async (req, res) => {
  try {
    const cotizacionId = Number(req.params.id);

    if (!cotizacionId || Number.isNaN(cotizacionId)) {
      return res.status(400).json({ message: "Id de cotización inválido" });
    }

    const cotizacion = await obtenerCotizacionCompleta(cotizacionId);

    if (!cotizacion) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    return res.status(200).json(cotizacion);
  } catch (error) {
    console.error("Error en obtenerCotizacionPorId:", error);
    return res.status(500).json({
      message: "Error al obtener la cotización",
      error: error.message,
    });
  }
};

module.exports = { obtenerCotizacionPorId };
