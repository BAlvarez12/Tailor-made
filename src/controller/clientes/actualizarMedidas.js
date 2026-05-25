const db = require("../../config/db");

const actualizarMedidas = async (req, res) => {
  try {
    const { cliente_id, usuario, medidas } = req.body;

    if (!cliente_id) {
      return res.status(400).json({ error: "cliente_id es obligatorio" });
    }

    for (const m of medidas) {
      if (m.valor === "" || m.valor === null || m.valor === undefined) continue;

      await db.query(
        "CALL sp_actualizarMedidasCliente(?, ?, ?, ?)",
        [cliente_id, m.tipo_medida_id, m.valor, usuario]
      );
    }

    res.json({ message: "Medidas actualizadas" });
  } catch (error) {
    console.error("Error actualizando medidas:", error);
    res.status(500).json({ message: "Error actualizando medidas" });
  }
};

module.exports = { actualizarMedidas };