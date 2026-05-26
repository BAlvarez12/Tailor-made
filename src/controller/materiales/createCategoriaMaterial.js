const db = require('../../config/db');
const { registrar, fromReq } = require('../../services/logOperaciones');

const createCategoriaMaterial = async (req, res) => {
  try {
    const { nombre_categoria, descripcion_categoria } = req.body;

    if (!nombre_categoria || !String(nombre_categoria).trim()) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
    }

    const nombre = String(nombre_categoria).trim();
    const descripcion = descripcion_categoria
      ? String(descripcion_categoria).trim()
      : null;

    if (nombre.length > 50) {
      return res.status(400).json({ error: 'El nombre no puede exceder 50 caracteres.' });
    }

    if (descripcion && descripcion.length > 255) {
      return res.status(400).json({ error: 'La descripción no puede exceder 255 caracteres.' });
    }

    const [existentes] = await db.query(
      `SELECT categoria_id FROM categorias_material WHERE LOWER(nombre_categoria) = LOWER(?) LIMIT 1`,
      [nombre]
    );

    if (existentes.length > 0) {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre.' });
    }

    const [resultado] = await db.query(
      `INSERT INTO categorias_material (nombre_categoria, descripcion_categoria, fecha_creado)
       VALUES (?, ?, NOW())`,
      [nombre, descripcion]
    );

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'categoria_material',
      entidadId: resultado.insertId,
      descripcion: `Categoría de material "${nombre}" creada`,
      datosDespues: { nombre, descripcion },
    });

    return res.status(201).json({
      categoria_id: resultado.insertId,
      nombre_categoria: nombre,
      descripcion_categoria: descripcion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

module.exports = { createCategoriaMaterial };
