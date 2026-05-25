const db = require("../../config/db");

exports.leerClientes = async (req, res) => {
  try {
    const [rows] = await db.query("CALL sp_leerClientes()");
    const clientes = Array.isArray(rows[0]) ? rows[0] : [];

    clientes.sort((a, b) => {
      const fechaA = new Date(a.fecha_creado || 0).getTime();
      const fechaB = new Date(b.fecha_creado || 0).getTime();
      if (fechaB !== fechaA) return fechaB - fechaA;
      return Number(b.cliente_id) - Number(a.cliente_id);
    });

    res.json(clientes);
  } catch (error) {
    console.error("Error al leer clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};