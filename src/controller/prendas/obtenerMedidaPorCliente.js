const db = require("../../config/db");

const obtenerMedidasPorCliente = async (req, res) => {
  try {
    const { cliente_id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        cm.cliente_medida_id,
        cm.cliente_id,
        cm.tipo_medida_id,
        tm.nombre_tipo_medida,
        cm.unidad_id,
        um.nombre_unidad,
        um.simbolo_unidad,
        cm.valor,
        cm.fecha_creado,
        cm.fecha_actualizado
      FROM cliente_medidas cm
      INNER JOIN tipo_medidas tm 
        ON cm.tipo_medida_id = tm.tipo_medida_id
      LEFT JOIN unidades_medida um
        ON cm.unidad_id = um.unidad_id
      WHERE cm.cliente_id = ?
      ORDER BY tm.nombre_tipo_medida ASC
      `,
      [cliente_id]
    );

    return res.status(200).json({
      ok: true,
      data: rows,
      message: rows.length
        ? "Medidas del cliente obtenidas correctamente."
        : "El cliente no tiene medidas registradas.",
    });
  } catch (error) {
    console.error("Error al obtener medidas del cliente:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al obtener medidas del cliente.",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerMedidasPorCliente,
};