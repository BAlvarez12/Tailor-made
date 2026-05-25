const db = require('../../config/db');

const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query(`CALL sp_get_categorias()`);
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);

    try {
      const [categorias] = await db.query(
        `SELECT categoria_id, nombre_categoria, descripcion_categoria, fecha_creado
         FROM categorias_material
         ORDER BY nombre_categoria ASC`
      );
      return res.json(categorias);
    } catch (fallbackError) {
      console.error(fallbackError);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }
};

module.exports = { getCategorias };
