const db = require("../../config/db");
const {
  validarFormatoDpi,
  buscarClientePorDpi,
} = require("../../utils/validarDpiCliente");
const { registrar, fromReq } = require("../../services/logOperaciones");

exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, dpi, estado } = req.body;

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

    await db.query(
      `UPDATE clientes
          SET nombre_cliente = ?,
              apellido_cliente = ?,
              telefono = ?,
              dpi = ?,
              estado = ?
        WHERE cliente_id = ?`,
      [
        nombre.trim(),
        apellido.trim(),
        telefonoNormalizado,
        busqueda.normalizado,
        estado,
        id,
      ]
    );

    const estadoNum = Number(estado);
    const accion =
      estadoNum === 0 ? "inactivar" : estadoNum === 1 ? "activar" : "editar";
    const descripcionAccion =
      accion === "inactivar"
        ? `Cliente ${nombre.trim()} ${apellido.trim()} inactivado`
        : accion === "activar"
          ? `Cliente ${nombre.trim()} ${apellido.trim()} activado`
          : `Cliente ${nombre.trim()} ${apellido.trim()} editado`;

    registrar({
      ...fromReq(req),
      accion,
      entidad: "cliente",
      entidadId: Number(id),
      descripcion: descripcionAccion,
      datosDespues: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dpi: busqueda.normalizado,
        telefono: telefonoNormalizado,
        estado: estadoNum,
      },
    });

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
