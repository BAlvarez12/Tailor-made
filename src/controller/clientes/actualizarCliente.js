const db = require("../../config/db");

exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, estado } = req.body;

    await db.query("CALL sp_actualizarCliente(?, ?, ?, ?, ?)", [
      id,
      nombre,
      apellido,
      telefono,
      estado,
    ]);

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};