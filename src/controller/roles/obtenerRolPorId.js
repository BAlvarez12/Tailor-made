const pool = require('../../config/db.js')

const obtenerRolPorId = async (req, res) => {
  try {
    const { id } = req.params

    const [rol] = await pool.query(
      'SELECT rol_id, nombre_rol FROM roles WHERE rol_id = ?',
      [id]
    )

    if (rol.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado' })
    }

    const [permisos] = await pool.query(
      'SELECT permiso_id FROM permisos_rol WHERE rol_id = ?',
      [id]
    )

    res.json({
      ...rol[0],
      permiso_ids: permisos.map((p) => p.permiso_id),
    })
  } catch (error) {
    console.error('Error al obtener rol:', error)
    res.status(500).json({ message: 'Error al obtener rol' })
  }
}

module.exports = { obtenerRolPorId }
