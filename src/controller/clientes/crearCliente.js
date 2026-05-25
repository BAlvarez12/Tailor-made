const db = require("../../config/db");
const {
  validarFormatoDpi,
  buscarClientePorDpi,
} = require("../../utils/validarDpiCliente");

exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, telefono, dpi, usuario } = req.body;

    if (!nombre?.trim() || !apellido?.trim() || !telefono?.trim()) {
      return res.status(400).json({
        message: "Nombre, apellido y teléfono son obligatorios.",
      });
    }

    const formato = validarFormatoDpi(dpi);
    if (!formato.ok) {
      return res.status(400).json({ message: formato.message });
    }

    const busqueda = await buscarClientePorDpi(db, dpi);
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

    const [resultCliente] = await db.query(
      "CALL sp_crearCliente(?, ?, ?, ?, ?)",
      [
        nombre.trim(),
        apellido.trim(),
        telefono.trim(),
        busqueda.normalizado,
        usuario,
      ]
    );

    const cliente_id = resultCliente[0][0].cliente_id;

    res.json({
      message: "Cliente creado correctamente",
      cliente_id,
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe un cliente registrado con este DPI.",
        dpiDuplicado: true,
      });
    }

    res.status(500).json({ message: "Error al crear cliente" });
  }
};
