const normalizarDpi = (dpi) => String(dpi ?? "").replace(/\D/g, "").trim();

const validarFormatoDpi = (dpi) => {
  const normalizado = normalizarDpi(dpi);

  if (!normalizado) {
    return { ok: false, message: "El DPI es obligatorio." };
  }

  if (normalizado.length !== 13) {
    return {
      ok: false,
      message: "El DPI debe tener exactamente 13 dígitos.",
    };
  }

  return { ok: true, normalizado };
};

const mapClienteExistente = (row) => ({
  cliente_id: row.cliente_id,
  nombre_completo: `${row.nombre_cliente || ""} ${row.apellido_cliente || ""}`.trim(),
  telefono: row.telefono || "—",
  dpi: row.dpi || "—",
});

const buscarClientePorDpi = async (db, dpi, excluirClienteId = null) => {
  const { ok, normalizado, message } = validarFormatoDpi(dpi);
  if (!ok) return { error: message };

  const params = [normalizado];
  let sql = `
    SELECT cliente_id, nombre_cliente, apellido_cliente, telefono, dpi
    FROM clientes
    WHERE dpi = ?
  `;

  if (excluirClienteId) {
    sql += ` AND cliente_id <> ?`;
    params.push(Number(excluirClienteId));
  }

  sql += ` LIMIT 1`;

  const [rows] = await db.query(sql, params);

  if (!rows.length) {
    return { normalizado, duplicado: null };
  }

  return {
    normalizado,
    duplicado: mapClienteExistente(rows[0]),
  };
};

module.exports = {
  normalizarDpi,
  validarFormatoDpi,
  mapClienteExistente,
  buscarClientePorDpi,
};
