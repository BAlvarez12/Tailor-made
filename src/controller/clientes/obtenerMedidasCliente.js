const db = require("../../config/db");

exports.obtenerMedidasCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    const [rows] = await db.query(
      `SELECT m.cliente_medida_id, m.tipo_medida_id, t.nombre_tipo_medida, m.valor
         FROM cliente_medidas m
         INNER JOIN tipo_medidas t ON m.tipo_medida_id = t.tipo_medida_id
        WHERE m.cliente_id = ?`,
      [cliente_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener medidas:", error);
    res.status(500).json({ message: "Error al obtener medidas" });
  }
};