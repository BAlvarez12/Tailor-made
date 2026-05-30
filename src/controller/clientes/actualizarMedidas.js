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

      // Upsert: si ya existe la medida (cliente + tipo) se actualiza el valor,
      // de lo contrario se inserta con la unidad por defecto (2).
      const [existentes] = await db.query(
        `SELECT 1 FROM cliente_medidas
          WHERE cliente_id = ? AND tipo_medida_id = ?
          LIMIT 1`,
        [cliente_id, m.tipo_medida_id]
      );

      if (existentes.length > 0) {
        await db.query(
          `UPDATE cliente_medidas
              SET valor = ?, fecha_actualizado = NOW()
            WHERE cliente_id = ? AND tipo_medida_id = ?`,
          [valorNum, cliente_id, m.tipo_medida_id]
        );
      } else {
        await db.query(
          `INSERT INTO cliente_medidas
             (cliente_id, tipo_medida_id, unidad_id, valor, fecha_creado, fecha_actualizado, usuario_creado)
           VALUES (?, ?, 2, ?, NOW(), NOW(), ?)`,
          [cliente_id, m.tipo_medida_id, valorNum, usuario]
        );
      }
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
