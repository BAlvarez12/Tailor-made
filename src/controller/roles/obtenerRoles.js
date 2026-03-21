const pool = require('../../config/db.js');

const obtenerRoles = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.rol_id,
        t.nombre_rol
      FROM roles t
      ORDER BY t.rol_id DESC
    `)

    res.json(rows)
  } catch (error) {
    console.error('Error al obtener roles:', error)
    res.status(500).json({ message: 'Error al obtener roles' })
  }
}

module.exports = {
  obtenerRoles,
}