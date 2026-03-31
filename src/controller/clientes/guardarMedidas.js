const db = require("../../config/db");

exports.guardarMedidas = async (req, res) => {
  try {
    const { cliente_id, usuario, medidas } = req.body;

    // 🔥 recorrer todas las medidas
    for (let m of medidas) {

      if (!m.valor) continue;

      await db.query("CALL sp_MedidasRegistroCliente(?, ?, ?, ?, ?)", [
        cliente_id,
        m.tipo_medida_id,
        2, // pulgadas
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