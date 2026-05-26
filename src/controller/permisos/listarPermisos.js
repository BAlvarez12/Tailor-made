const pool = require('../../config/db.js')

const listarPermisos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT permiso_id, nombre_permiso FROM permisos ORDER BY permiso_id'
    )
    res.json(rows)
  } catch (error) {
    console.error('Error al listar permisos:', error)
    res.status(500).json({ message: 'Error al listar permisos' })
  }
}

module.exports = { listarPermisos }
