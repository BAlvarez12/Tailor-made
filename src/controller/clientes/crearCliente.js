const db = require("../../config/db");

exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, telefono, usuario } = req.body;

    // 🔥 1. Crear cliente
    const [resultCliente] = await db.query(
      "CALL sp_crearCliente(?, ?, ?, ?)",
      [nombre, apellido, telefono, usuario]
    );

    const cliente_id = resultCliente[0][0].cliente_id;

    // 🔥 RESPUESTA
    res.json({
      message: "Cliente creado correctamente",
      cliente_id,
      //cliente_prenda_id,
    });

  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};