const db = require("../../config/db");

const obtenerCotizacionCompleta = async (cotizacionId) => {
  const [cotizaciones] = await db.query(
    `SELECT * FROM cotizaciones WHERE cotizacion_id = ? AND estado = 1 LIMIT 1`,
    [cotizacionId]
  );

  if (cotizaciones.length === 0) return null;

  const cotizacion = cotizaciones[0];

  const [medidas] = await db.query(
    `SELECT nombre_tipo_medida, valor, unidad_label
     FROM cotizacion_medidas
     WHERE cotizacion_id = ?
     ORDER BY cotizacion_medida_id ASC`,
    [cotizacionId]
  );

  const [materiales] = await db.query(
    `SELECT nombre_material, cantidad, precio_unitario, observaciones
     FROM cotizacion_materiales
     WHERE cotizacion_id = ?
     ORDER BY cotizacion_material_id ASC`,
    [cotizacionId]
  );

  return {
    ...cotizacion,
    medidas,
    materiales,
  };
};

const obtenerDatosPrendaParaCotizacion = async (clientePrendaId, clienteId) => {
  const [prendaRows] = await db.query(
    `
      SELECT
        cp.cliente_prenda_id,
        cp.cliente_id,
        cp.titulo,
        c.nombre_cliente,
        c.apellido_cliente,
        c.telefono,
        tp.nombre AS tipo_prenda_nombre
      FROM cliente_prenda cp
      INNER JOIN clientes c ON cp.cliente_id = c.cliente_id
      LEFT JOIN tipo_prendas tp ON cp.tipo_prenda_id = tp.tipo_prendas_id
      WHERE cp.cliente_prenda_id = ?
        AND cp.cliente_id = ?
      LIMIT 1
    `,
    [clientePrendaId, clienteId]
  );

  if (prendaRows.length === 0) return null;

  const prenda = prendaRows[0];

  const [medidasRows] = await db.query(
    `
      SELECT
        tm.nombre_tipo_medida,
        cpm.valor,
        COALESCE(um.simbolo_unidad, um.nombre_unidad, '') AS unidad_label
      FROM cliente_prenda_medidas cpm
      LEFT JOIN tipo_medidas tm ON cpm.tipo_medida_id = tm.tipo_medida_id
      LEFT JOIN cliente_medidas cm
        ON cm.cliente_id = ?
        AND cm.tipo_medida_id = cpm.tipo_medida_id
      LEFT JOIN unidades_medida um ON cm.unidad_id = um.unidad_id
      WHERE cpm.cliente_prenda_id = ?
      ORDER BY tm.nombre_tipo_medida ASC
    `,
    [clienteId, clientePrendaId]
  );

  const [materialesRows] = await db.query(
    `
      SELECT
        m.nombre_material,
        cpmat.cantidad,
        m.precio_unitario,
        cpmat.observaciones
      FROM cliente_prenda_material cpmat
      LEFT JOIN materiales m ON cpmat.material_id = m.material_id
      WHERE cpmat.cliente_prenda_id = ?
      ORDER BY m.nombre_material ASC
    `,
    [clientePrendaId]
  );

  const nombreCliente = `${prenda.nombre_cliente || ""} ${prenda.apellido_cliente || ""}`.trim();

  return {
    prenda,
    nombreCliente,
    medidas: medidasRows,
    materiales: materialesRows,
  };
};

module.exports = {
  obtenerCotizacionCompleta,
  obtenerDatosPrendaParaCotizacion,
};
