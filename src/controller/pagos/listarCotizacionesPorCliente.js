const db = require("../../config/db");

const listarCotizacionesPorCliente = async (req, res) => {
  try {
    const clienteId = Number(req.params.clienteId);

    if (!clienteId || Number.isNaN(clienteId)) {
      return res.status(400).json({ message: "cliente_id inválido" });
    }

    const [rows] = await db.query(
      `
        SELECT
          c.cotizacion_id,
          c.codigo_cotizacion,
          c.cliente_id,
          c.cliente_nombre,
          c.cliente_telefono,
          c.titulo_prenda,
          c.tipo_prenda_nombre,
          c.valor_total,
          c.fecha_creado,
          CASE WHEN pp.plan_pago_id IS NOT NULL THEN 1 ELSE 0 END AS tiene_plan_pago,
          pp.plan_pago_id,
          pp.codigo_plan
        FROM cotizaciones c
        LEFT JOIN planes_pago pp ON pp.cotizacion_id = c.cotizacion_id
        WHERE c.cliente_id = ? AND c.estado = 1
        ORDER BY c.fecha_creado DESC, c.cotizacion_id DESC
      `,
      [clienteId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en listarCotizacionesPorCliente:", error);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({
        message: "Ejecuta database/pagos.sql en la base de datos",
      });
    }

    return res.status(500).json({
      message: "Error al listar cotizaciones del cliente",
      error: error.message,
    });
  }
};

module.exports = { listarCotizacionesPorCliente };
