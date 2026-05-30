const db = require("../../config/db");

exports.obtenerTiposMedidaActivos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tipo_medida_id, nombre_tipo_medida, descripcion_tipo_medida
         FROM tipo_medidas
        WHERE estado = 1`
    );

    res.json(rows);

  } catch (error) {
    console.error("Error al obtener tipos de medida activos:", error);
    res.status(500).json({ message: "Error al obtener tipos de medida" });
  }
};