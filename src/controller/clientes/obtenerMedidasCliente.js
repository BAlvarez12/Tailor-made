const db = require("../../config/db");

exports.obtenerMedidasCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    //console.log("Cliente ID recibido:", cliente_id);

    const [rows] = await db.query(
      "CALL sp_obtenerMedidasCliente(?)",
      [cliente_id]
    );

    //console.log("Medidas encontradas:", rows[0]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener medidas:", error);
    res.status(500).json({ message: "Error al obtener medidas" });
  }
};