const generarCodigoPlanPago = async (connection) => {
  const year = new Date().getFullYear();

  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total FROM planes_pago WHERE YEAR(fecha_creado) = ?`,
    [year]
  );

  const sec = Number(rows[0]?.total || 0) + 1;
  return `PAG-${year}-${String(sec).padStart(5, "0")}`;
};

module.exports = { generarCodigoPlanPago };
