const db = require("../../config/db");
const { registrar, fromReq } = require("../../services/logOperaciones");

exports.guardarMedidas = async (req, res) => {
  try {
    const { cliente_id, medidas } = req.body;
    const usuario = req.user?.usuario_id;

    if (!usuario) {
      return res.status(401).json({ message: "No autorizado." });
    }

    if (!cliente_id) {
      return res.status(400).json({
        message: "cliente_id es obligatorio"
      });
    }

    if (!Array.isArray(medidas)) {
      return res.status(400).json({
        message: "El campo 'medidas' debe ser un arreglo."
      });
    }

    let guardadas = 0;
    for (let m of medidas) {
      if (m.valor === "" || m.valor === null || m.valor === undefined) continue;

      const valorNum = Number(m.valor);
      if (Number.isNaN(valorNum) || valorNum < 0) {
        return res.status(400).json({
          message: `El valor de la medida #${m.tipo_medida_id} debe ser un número mayor o igual a 0.`
        });
      }

      await db.query("CALL sp_MedidasRegistroCliente(?, ?, ?, ?, ?)", [
        cliente_id,
        m.tipo_medida_id,
        2,
        valorNum,
        usuario
      ]);
      guardadas++;
    }

    registrar({
      ...fromReq(req),
      accion: "crear",
      entidad: "medidas_cliente",
      entidadId: Number(cliente_id),
      descripcion: `Se guardaron ${guardadas} medidas del cliente #${cliente_id}`,
    });

    res.json({ message: "Medidas guardadas correctamente" });
  } catch (error) {
    console.error("Error al guardar medidas:", error);
    res.status(500).json({ message: "Error al guardar medidas" });
  }
};
