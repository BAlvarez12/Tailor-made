const db = require("../../config/db");

exports.guardarMedidas = async (req, res) => {
  try {
    const { cliente_id, usuario, medidas } = req.body;

    if (!cliente_id) {
      return res.status(400).json({
        message: "cliente_id es obligatorio"
      });
    }

    for (let m of medidas) {
      if (m.valor === "" || m.valor === null || m.valor === undefined) continue;

      await db.query("CALL sp_MedidasRegistroCliente(?, ?, ?, ?, ?)", [
        cliente_id,
        m.tipo_medida_id,
        2,
        m.valor,
        usuario
      ]);
    }

    res.json({ message: "Medidas guardadas correctamente" });
  } catch (error) {
    console.error("Error al guardar medidas:", error);
    res.status(500).json({ message: "Error al guardar medidas" });
  }
};