const generarCodigoRecibo = async (connection) => {
  const year = new Date().getFullYear();

  const [rows] = await connection.query(
    `SELECT COUNT(*) AS total FROM pagos_cliente WHERE YEAR(fecha_registro) = ?`,
    [year]
  );

  const sec = Number(rows[0]?.total || 0) + 1;
  return `REC-${year}-${String(sec).padStart(5, "0")}`;
};

module.exports = { generarCodigoRecibo };
