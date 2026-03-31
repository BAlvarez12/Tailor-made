const db = require("../../config/db");

exports.leerClientes = async (req, res) => {
  try {
    const [rows] = await db.query("CALL sp_leerClientes()");
    res.json(rows[0]); // 🔥 importante en SP
  } catch (error) {
    console.error("Error al leer clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};