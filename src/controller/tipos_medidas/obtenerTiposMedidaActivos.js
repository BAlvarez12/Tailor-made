const db = require("../../config/db");

exports.obtenerTiposMedidaActivos = async (req, res) => {
  try {
    const [rows] = await db.query("CALL sp_obtenerTiposMedidaActivos()");

    res.json(rows[0]);

  } catch (error) {
    console.error("Error al obtener tipos de medida activos:", error);
    res.status(500).json({ message: "Error al obtener tipos de medida" });
  }
};