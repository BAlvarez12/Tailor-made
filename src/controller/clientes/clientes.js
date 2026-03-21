/* CONFIGURACIÓN DB */
const db = require('../../config/db');

/* OBTENER CLIENTES */
exports.getClientes = async (req, res) => {
  try {
    const { archivados } = req.query;

    let query = "SELECT * FROM clientes";

    /* FILTRO POR ESTADO */
    if (archivados == 1) {
      query += " WHERE estado = 0"; // archivados
    } else {
      query += " WHERE estado = 1"; // activos
    }

    console.log("QUERY:", query); 

    const [rows] = await db.query(query);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

/* OBTENER CLIENTE POR ID */
exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM clientes WHERE cliente_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};

/* CREAR CLIENTE */
exports.createCliente = async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, telefono, usuario_creador } =
      req.body;

    /* VALIDAR CAMPOS */
    if (!nombre_cliente || !apellido_cliente) {
      return res.status(400).json({ message: "Nombre y apellido son obligatorios" });
    }

    /* VALIDAR USUARIO */
    if (!usuario_creador) {
      return res.status(400).json({ message: "Usuario creador requerido" });
    }

    const [result] = await db.query(
      `INSERT INTO clientes 
      (nombre_cliente, apellido_cliente, telefono, usuario_creador, estado, fecha_creado) 
      VALUES (?, ?, ?, ?, 1, NOW())`,
      [nombre_cliente, apellido_cliente, telefono, usuario_creador]
    );

    res.status(201).json({
      message: "Cliente creado correctamente",
      cliente_id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

/* ACTUALIZAR CLIENTE */
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_cliente, apellido_cliente, telefono } = req.body;

    const [result] = await db.query(
      `UPDATE clientes 
       SET nombre_cliente = ?, apellido_cliente = ?, telefono = ?
       WHERE cliente_id = ?`,
      [nombre_cliente, apellido_cliente, telefono, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};

/* ARCHIVAR CLIENTE */
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE clientes SET estado = 0 WHERE cliente_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente archivado correctamente" });
  } catch (error) {
    console.error("Error al archivar cliente:", error);
    res.status(500).json({ message: "Error al archivar cliente" });
  }
};

/* DESARCHIVAR CLIENTE */
exports.restoreCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE clientes SET estado = 1 WHERE cliente_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente restaurado correctamente" });
  } catch (error) {
    console.error("Error al restaurar cliente:", error);
    res.status(500).json({ message: "Error al restaurar cliente" });
  }
};