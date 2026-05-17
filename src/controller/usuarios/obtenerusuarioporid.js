const pool = require('../../config/db.js');

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        t.usuario_id,
        t.nombre_usuario,
        t.apellido_usuario,
        t.usuario,
        t.email,
        t.estado,
        t.rol_id,
        a.nombre_rol
      FROM usuarios t
      INNER JOIN roles a
        ON t.rol_id = a.rol_id
      WHERE t.usuario_id = ?
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario por id:', error);
    res.status(500).json({
      message: 'Error al obtener usuario por id'
    });
  }
};

module.exports = {
  obtenerUsuarioPorId,
};