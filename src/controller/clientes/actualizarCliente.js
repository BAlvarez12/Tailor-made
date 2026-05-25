const db = require("../../config/db");
const {
  validarFormatoDpi,
  buscarClientePorDpi,
} = require("../../utils/validarDpiCliente");

exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, dpi, estado } = req.body;

    if (!nombre?.trim() || !apellido?.trim() || !telefono?.trim()) {
      return res.status(400).json({
        message: "Nombre, apellido y teléfono son obligatorios.",
      });
    }

    const formato = validarFormatoDpi(dpi);
    if (!formato.ok) {
      return res.status(400).json({ message: formato.message });
    }

    const busqueda = await buscarClientePorDpi(db, dpi, id);
    if (busqueda.error) {
      return res.status(400).json({ message: busqueda.error });
    }

    if (busqueda.duplicado) {
      return res.status(409).json({
        message: "Ya existe un cliente registrado con este DPI.",
        dpiDuplicado: true,
        clienteExistente: busqueda.duplicado,
      });
    }

    await db.query("CALL sp_actualizarCliente(?, ?, ?, ?, ?, ?)", [
      id,
      nombre.trim(),
      apellido.trim(),
      telefono.trim(),
      busqueda.normalizado,
      estado,
    ]);

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe un cliente registrado con este DPI.",
        dpiDuplicado: true,
      });
    }

    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};
