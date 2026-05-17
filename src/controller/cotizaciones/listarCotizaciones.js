const db = require("../../config/db");

const listarCotizaciones = async (req, res) => {
  try {
    const { q } = req.query;
    const termino = q ? String(q).trim() : "";

    let sql = `
      SELECT
        cotizacion_id,
        codigo_cotizacion,
        cliente_id,
        cliente_prenda_id,
        titulo_prenda,
        tipo_prenda_nombre,
        cliente_nombre,
        cliente_telefono,
        valor_total,
        notas,
        fecha_creado
      FROM cotizaciones
      WHERE estado = 1
    `;

    const params = [];

    if (termino) {
      const like = `%${termino}%`;
      sql += `
        AND (
          codigo_cotizacion LIKE ?
          OR cliente_nombre LIKE ?
          OR cliente_telefono LIKE ?
          OR REPLACE(cliente_telefono, ' ', '') LIKE REPLACE(?, ' ', '')
        )
      `;
      params.push(like, like, like, like);
    }

    sql += ` ORDER BY fecha_creado DESC, cotizacion_id DESC LIMIT 200`;

    const [rows] = await db.query(sql, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en listarCotizaciones:", error);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({
        message:
          "Las tablas de cotizaciones no existen. Ejecuta database/cotizaciones.sql",
      });
    }

    return res.status(500).json({
      message: "Error al listar cotizaciones",
      error: error.message,
    });
  }
};

module.exports = { listarCotizaciones };
