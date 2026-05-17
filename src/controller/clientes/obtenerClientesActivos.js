const db = require("../../config/db");

exports.obtenerClientesActivos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        cliente_id,
        nombre_cliente,
        apellido_cliente,
        telefono
      FROM clientes
      WHERE estado = 1
      ORDER BY nombre_cliente ASC, apellido_cliente ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener clientes activos:", error);
    res.status(500).json({ message: "Error al obtener clientes activos" });
  }
};