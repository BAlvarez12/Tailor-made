const db = require("../../config/db");
const {
  validarFormatoDpi,
  buscarClientePorDpi,
} = require("../../utils/validarDpiCliente");
const { registrar, fromReq } = require("../../services/logOperaciones");

exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, telefono, dpi } = req.body;
    const usuario = req.user?.usuario_id;

    if (!usuario) {
      return res.status(401).json({ message: "No autorizado." });
    }

    if (!nombre?.trim() || !apellido?.trim()) {
      return res.status(400).json({
        message: "Nombre y apellido son obligatorios.",
      });
    }

    // Teléfono opcional, pero si viene debe ser solo dígitos (7-15)
    const telefonoLimpio = String(telefono ?? "").replace(/\D/g, "").trim();
    if (telefono && telefonoLimpio !== String(telefono).trim()) {
      return res.status(400).json({
        message: "El teléfono solo puede contener números.",
      });
    }
    if (telefonoLimpio && (telefonoLimpio.length < 7 || telefonoLimpio.length > 15)) {
      return res.status(400).json({
        message: "El teléfono debe tener entre 7 y 15 dígitos.",
      });
    }
    const telefonoNormalizado = telefonoLimpio || null;

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
      `INSERT INTO clientes
         (nombre_cliente, apellido_cliente, telefono, dpi, estado, fecha_creado, usuario_creador)
       VALUES (?, ?, ?, ?, 1, NOW(), ?)`,
      [
        nombre.trim(),
        apellido.trim(),
        telefonoNormalizado,
        busqueda.normalizado,
        usuario,
      ]
    );

    const cliente_id = resultCliente.insertId;

    registrar({
      ...fromReq(req),
      accion: "crear",
      entidad: "cliente",
      entidadId: cliente_id,
      descripcion: `Cliente ${nombre.trim()} ${apellido.trim()} creado`,
      datosDespues: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dpi: busqueda.normalizado,
        telefono: telefonoNormalizado,
      },
    });

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
