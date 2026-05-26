const db = require("../../config/db");
const { generarCodigoCotizacion } = require("../../utils/generarCodigoCotizacion");
const { obtenerDatosPrendaParaCotizacion } = require("./cotizacionQueries");
const { registrar, fromReq } = require("../../services/logOperaciones");

const crearCotizacion = async (req, res) => {
  let connection;

  try {
    const { cliente_id, cliente_prenda_id, valor_total, notas } = req.body;

    const usuarioCreador = req.user?.usuario_id;
    if (!usuarioCreador) {
      return res.status(401).json({ message: "No autorizado." });
    }

    const clienteId = Number(cliente_id);
    const clientePrendaId = Number(cliente_prenda_id);
    const valorTotal = Number(valor_total);

    if (!clienteId || !clientePrendaId || !valorTotal || valorTotal <= 0) {
      return res.status(400).json({
        message:
          "cliente_id, cliente_prenda_id y valor_total (mayor a 0) son obligatorios",
      });
    }

    const datos = await obtenerDatosPrendaParaCotizacion(
      clientePrendaId,
      clienteId
    );

    if (!datos) {
      return res.status(404).json({
        message: "No se encontró la prenda asociada al cliente seleccionado",
      });
    }

    const { prenda, nombreCliente, medidas, materiales } = datos;

    connection = await db.getConnection();
    await connection.beginTransaction();

    const codigo = await generarCodigoCotizacion(connection);

    const [insertCotizacion] = await connection.query(
      `
        INSERT INTO cotizaciones (
          codigo_cotizacion,
          cliente_id,
          cliente_prenda_id,
          titulo_prenda,
          tipo_prenda_nombre,
          cliente_nombre,
          cliente_telefono,
          valor_total,
          notas,
          usuario_creador
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        codigo,
        clienteId,
        clientePrendaId,
        prenda.titulo || null,
        prenda.tipo_prenda_nombre || null,
        nombreCliente,
        prenda.telefono || null,
        valorTotal,
        notas ? String(notas).trim() : null,
        usuarioCreador,
      ]
    );

    const cotizacionId = insertCotizacion.insertId;

    for (const medida of medidas) {
      await connection.query(
        `
          INSERT INTO cotizacion_medidas (
            cotizacion_id,
            nombre_tipo_medida,
            valor,
            unidad_label
          ) VALUES (?, ?, ?, ?)
        `,
        [
          cotizacionId,
          medida.nombre_tipo_medida || "Medida",
          medida.valor,
          medida.unidad_label || null,
        ]
      );
    }

    for (const material of materiales) {
      await connection.query(
        `
          INSERT INTO cotizacion_materiales (
            cotizacion_id,
            nombre_material,
            cantidad,
            precio_unitario,
            observaciones
          ) VALUES (?, ?, ?, ?, ?)
        `,
        [
          cotizacionId,
          material.nombre_material || "Material",
          material.cantidad ?? 1,
          material.precio_unitario ?? null,
          material.observaciones || null,
        ]
      );
    }

    await connection.commit();

    registrar({
      ...fromReq(req),
      accion: "crear",
      entidad: "cotizacion",
      entidadId: cotizacionId,
      descripcion: `Cotización ${codigo} creada para cliente ${nombreCliente} (Q ${valorTotal.toFixed(2)})`,
      datosDespues: {
        codigo_cotizacion: codigo,
        cliente_id: clienteId,
        cliente_prenda_id: clientePrendaId,
        valor_total: valorTotal,
      },
    });

    return res.status(201).json({
      message: "Cotización creada correctamente",
      cotizacion_id: cotizacionId,
      codigo_cotizacion: codigo,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error en crearCotizacion:", error);

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({
        message:
          "Las tablas de cotizaciones no existen. Ejecuta database/cotizaciones.sql",
      });
    }

    return res.status(500).json({
      message: "Error al crear la cotización",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { crearCotizacion };
