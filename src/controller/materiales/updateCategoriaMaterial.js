const db = require('../../config/db');

const updateCategoriaMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria, descripcion_categoria } = req.body;

    if (!nombre_categoria || !String(nombre_categoria).trim()) {
      return res.status(400).json({ error: 'El nombre de la categoría es obligatorio.' });
    }

    const nombre = String(nombre_categoria).trim();
    const descripcion = descripcion_categoria
      ? String(descripcion_categoria).trim()
      : null;

    const [categoriaActual] = await db.query(
      `SELECT categoria_id FROM categorias_material WHERE categoria_id = ? LIMIT 1`,
      [id]
    );

    if (categoriaActual.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    const [duplicados] = await db.query(
      `SELECT categoria_id FROM categorias_material
       WHERE LOWER(nombre_categoria) = LOWER(?) AND categoria_id <> ?
       LIMIT 1`,
      [nombre, id]
    );

    if (duplicados.length > 0) {
      return res.status(409).json({ error: 'Ya existe otra categoría con ese nombre.' });
    }

    await db.query(
      `UPDATE categorias_material
       SET nombre_categoria = ?, descripcion_categoria = ?
       WHERE categoria_id = ?`,
      [nombre, descripcion, id]
    );

    return res.json({
      categoria_id: Number(id),
      nombre_categoria: nombre,
      descripcion_categoria: descripcion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

module.exports = { updateCategoriaMaterial };
