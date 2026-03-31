const db = require("../../config/db");

exports.obtenerClientesActivos = async (req, res) => {
  try {
    const [rows] = await db.query("CALL sp_obtenerClientesActivos()");
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener clientes activos:", error);
    res.status(500).json({ message: "Error al obtener clientes activos" });
  }
};