const db = require("../../config/db");
const { registrar, fromReq } = require("../../services/logOperaciones");

const actualizarMedidas = async (req, res) => {
  try {
    const { cliente_id, medidas } = req.body;
    const usuario = req.user?.usuario_id;

    if (!usuario) {
      return res.status(401).json({ error: "No autorizado." });
    }

    if (!cliente_id) {
      return res.status(400).json({ error: "cliente_id es obligatorio" });
    }

    if (!Array.isArray(medidas)) {
      return res.status(400).json({ error: "El campo 'medidas' debe ser un arreglo." });
    }

    let actualizadas = 0;
    for (const m of medidas) {
      if (m.valor === "" || m.valor === null || m.valor === undefined) continue;

      const valorNum = Number(m.valor);
      if (Number.isNaN(valorNum) || valorNum < 0) {
        return res.status(400).json({
          error: `El valor de la medida #${m.tipo_medida_id} debe ser un número mayor o igual a 0.`
        });
      }

      await db.query(
        "CALL sp_actualizarMedidasCliente(?, ?, ?, ?)",
        [cliente_id, m.tipo_medida_id, valorNum, usuario]
      );
      actualizadas++;
    }

    registrar({
      ...fromReq(req),
      accion: "editar",
      entidad: "medidas_cliente",
      entidadId: Number(cliente_id),
      descripcion: `Se actualizaron ${actualizadas} medidas del cliente #${cliente_id}`,
    });

    res.json({ message: "Medidas actualizadas" });
  } catch (error) {
    console.error("Error actualizando medidas:", error);
    res.status(500).json({ message: "Error actualizando medidas" });
  }
};

module.exports = { actualizarMedidas };
